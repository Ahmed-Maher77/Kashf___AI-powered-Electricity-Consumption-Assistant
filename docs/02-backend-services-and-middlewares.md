# Backend Services & Middlewares Documentation

**Project:** Kashf Server (`kashf-server`)  
**Stack:** Node.js 20, Express 5, MongoDB (Mongoose), Joi, bcryptjs, JWT, Multer, Cloudinary, CORS, dotenv  
**Source root:** `server/`  
**Last updated:** June 2026

---

## 1. Project Architecture Overview

### Folder structure

```
server/
├── server.js                        # Entry point: app setup, route mounts, global middleware
├── vercel.json                      # Vercel deployment config (@vercel/node)
├── config/
│   ├── corsOptions.js               # CORS origin whitelist (env-configurable)
│   └── startServerWithDB.js         # DB connect + app.listen with retry
├── database/
│   ├── dbConnect.js                 # Mongoose connection helper
│   └── models/
│       ├── user.model.js            # User schema (auth + profile + goals + notif prefs)
│       └── activity.model.js        # Activity log schema (userId, type, metadata, 90-day TTL)
├── public/
│   └── views/
│       ├── home.html                # GET / static page
│       └── 404.html                 # Unmatched routes HTML response
├── scripts/
│   └── seedAdmin.js                 # One-time admin seed script
└── src/
    ├── config/
    │   ├── auth.constants.js        # AUTH_COOKIE_KEYS, USER_ROLES, SUBSCRIPTION_PLANS
    │   ├── activity.constants.js    # ACTIVITY_TYPES enum (13 types) + ACTIVITY_TYPE_VALUES
    │   └── cloudinary.js            # uploadToCloudinary / deleteFromCloudinary helpers
    ├── middlewares/
    │   ├── asyncHandler.js          # Wraps async controllers → next(err)
    │   ├── isAuthenticated.js       # JWT access-token guard → req.user
    │   ├── isAdmin.js               # Role guard: req.user.role === "admin"
    │   ├── uploadProfilePicture.js  # Multer memory-storage, image MIME filter
    │   └── validateRequestBody.js   # Joi body validation factory
    ├── modules/
    │   ├── user.routes.js           # Auth + user profile routes (8 endpoints)
    │   ├── user.controller.js       # Thin controllers → authService
    │   ├── user.validation.js       # loginSchema, signupSchema (Joi)
    │   ├── activity.routes.js       # GET /api/activity
    │   ├── activity.controller.js   # Reads page/limit, calls activityService
    │   └── admin.routes.js          # Admin route stubs (in progress)
    ├── services/
    │   ├── auth.service.js          # register, login, logout, refresh, getMe, updateProfilePicture, updateProfile, updateGoals, updateNotificationPrefs
    │   ├── activity.service.js      # logActivity (non-critical) + getUserActivity (paginated)
    │   └── token.service.js         # signAccessToken, signRefreshToken, verifyRefreshToken, setAuthCookies, clearAuthCookies
    └── utils/
        ├── AppError.js              # Operational error class
        └── userMapper.js            # toPublicUser() — public shape including all new fields
```

### Route organization

- API routes live under `src/modules/` as feature modules.
- Auth routes are mounted at `/api/auth` via `app.use("/api/auth", userRoutes)`.
- Admin routes are mounted at `/api/admin` via `app.use("/api/admin", adminRoutes)`.
- Activity routes are mounted at `/api/activity` via `app.use("/api/activity", activityRoutes)`.
- `GET /` serves a static HTML home page; unmatched routes return `404.html`.

---

## 2. Registered API Endpoints

### Auth & User Routes (`/api/auth`)

| Method | Route | Auth Required | Middlewares | Controller |
|--------|-------|--------------|-------------|------------|
| `POST` | `/api/auth/register` | No | `uploadProfilePicture`, `validateRequestBody(signupSchema)` | `register` |
| `POST` | `/api/auth/login` | No | `validateRequestBody(loginSchema)` | `login` |
| `POST` | `/api/auth/logout` | No | — | `logout` |
| `GET` | `/api/auth/me` | Yes (JWT) | `isAuthenticated` | `me` |
| `PATCH` | `/api/auth/profile/picture` | Yes (JWT) | `isAuthenticated`, `uploadProfilePicture` | `updateProfilePicture` |
| `POST` | `/api/auth/refresh-token` | No (reads cookie) | — | `refreshToken` |

### Static Routes

| Method | Route | Handler |
|--------|-------|---------|
| `GET` | `/` | `public/views/home.html` |
| `*` | Any unmatched | `public/views/404.html` (status 404) |

---

## 3. Endpoint Details

### POST /api/auth/register

**Purpose:** Create a new user account, optionally with a profile picture.

**Request:**

| Part | Detail |
|------|--------|
| Body (`multipart/form-data`) | `username`, `email`, `password`, `repassword`, optional `picture` file |

**Middleware chain:** `uploadProfilePicture` → `validateRequestBody(signupSchema)` → `register` controller

**Business flow:**
1. Multer parses multipart body; image stored in memory buffer.
2. Joi validates `username`, `email`, `password`, `repassword`.
3. `authService.register` checks for duplicate email/username (409 if exists).
4. If file provided, uploads buffer to Cloudinary; stores URL.
5. Hashes password with bcrypt (10 rounds).
6. Creates `User` document in MongoDB.
7. Signs access + refresh JWTs.
8. Sets `accessToken` and `refreshToken` as `HttpOnly` cookies via `setAuthCookies`.
9. Returns `201` with `{ success: true, data: { user, accessToken } }`.

**Success response:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "username": "...", "email": "...", "role": "user", "picture": "..." },
    "accessToken": "<jwt>"
  }
}
```

**Error responses:**

| Code | Cause |
|------|-------|
| 400 | Joi validation failure — `{ message: "Validation failed.", details: [...] }` |
| 409 | Email or username already in use — `{ error: "Email or username already in use." }` |
| 500 | Cloudinary upload failure or DB error |

---

### POST /api/auth/login

**Purpose:** Authenticate a user and issue tokens.

**Request:**

| Part | Detail |
|------|--------|
| Body (`application/json`) | `email`, `password` |

**Business flow:**
1. Joi validates `email` and `password`.
2. `authService.login` looks up user by email (with `+password` select).
3. If not found or password mismatch → 401.
4. Signs access + refresh JWTs.
5. Sets `HttpOnly` cookies.
6. Returns `200` with `{ success: true, data: { user, accessToken } }`.

**Error responses:**

| Code | Cause |
|------|-------|
| 400 | Validation failure |
| 401 | Invalid email or password |

---

### POST /api/auth/logout

**Purpose:** Clear auth cookies on the server side.

**Business flow:**
1. `authService.logout` calls `clearAuthCookies(res)`.
2. Returns `200 { success: true, message: "Logged out successfully." }`.

---

### GET /api/auth/me

**Purpose:** Return the currently authenticated user's profile.

**Auth:** `isAuthenticated` middleware verifies access token from cookie, attaches `req.user`.

**Business flow:**
1. `authService.getMe({ userId: req.user.id })` queries MongoDB.
2. Returns `200 { success: true, data: { user } }`.

**Error responses:**

| Code | Cause |
|------|-------|
| 401 | Missing or invalid access token |
| 404 | User not found (deleted after token was issued) |

---

### PATCH /api/auth/profile/picture

**Purpose:** Replace a user's profile picture.

**Auth:** `isAuthenticated` required.

**Business flow:**
1. Multer parses multipart body.
2. Uploads new image to Cloudinary.
3. Updates `user.picture` in MongoDB.
4. Deletes previous Cloudinary image (if any).
5. Returns `200 { success: true, data: { user } }`.

---

### POST /api/auth/refresh-token

**Purpose:** Exchange a valid refresh token (from cookie) for a new access token + refresh token pair.

**Business flow:**
1. Reads `refreshToken` from `req.cookies[AUTH_COOKIE_KEYS.REFRESH_TOKEN]`.
2. If missing → 401.
3. Verifies JWT signature and expiry.
4. Loads user from MongoDB.
5. Signs new access + refresh tokens.
6. Overwrites cookies.
7. Returns `200 { success: true, data: { accessToken } }`.

**Error responses:**

| Code | Cause |
|------|-------|
| 401 | Missing, invalid, or expired refresh token; user not found |

---

## 4. Middlewares

### asyncHandler

**File:** `src/middlewares/asyncHandler.js`  
**Purpose:** Wraps async controller functions and forwards any thrown error to `next(err)`.

```javascript
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

Used on **all** controllers — eliminates the need for try/catch in every handler.

---

### isAuthenticated

**File:** `src/middlewares/isAuthenticated.js`  
**Purpose:** Verifies the access JWT from the `Authorization: Bearer <token>` header or the access-token cookie. Attaches `req.user = { id, role }`.

**Failure:** Throws `AppError("Not authenticated.", 401)`.

---

### isAdmin

**File:** `src/middlewares/isAdmin.js`  
**Purpose:** After `isAuthenticated`, checks `req.user.role === "admin"`.

**Failure:** Throws `AppError("Admin access required.", 403)`.

---

### uploadProfilePicture

**File:** `src/middlewares/uploadProfilePicture.js`  
**Purpose:** Multer middleware configured with memory storage. Accepts a single `picture` field. Filters MIME types to `image/*` only.

**File available as:** `req.file.buffer` (passed to Cloudinary).

---

### validateRequestBody

**File:** `src/middlewares/validateRequestBody.js`  
**Purpose:** Factory that returns a middleware validating `req.body` against a Joi schema.

**Failure response (400):**
```json
{
  "message": "Validation failed.",
  "details": [
    { "field": "email", "message": "\"email\" must be a valid email" }
  ]
}
```

---

### CORS (corsOptions)

**File:** `config/corsOptions.js`  
**Origin whitelist:**

```javascript
const allowedOrigins = [
    "https://kashf-ai-electricity-assistant.vercel.app",
    "https://kashf-smart-electricity-assistant.netlify.app",
    "http://localhost:5173",
    "http://localhost:4173",
];
```

`credentials: true` — cookies and Authorization headers allowed.

---

## 5. Services

### auth.service.js

| Export | Purpose |
|--------|---------|
| `register({ body, file, res })` | Full registration flow: duplicate check → Cloudinary upload → bcrypt → User.create → JWT → cookies |
| `login({ body, res })` | Credential check → JWT → cookies |
| `logout({ res })` | Clear auth cookies |
| `refreshToken({ refreshTokenValue, res })` | Verify refresh JWT → new token pair → cookies |
| `getMe({ userId })` | Fetch user by ID → `toPublicUser()` |
| `updateProfilePicture({ userId, file })` | Upload new image → update user → delete old image |
| `hashPasswordForSeed` | Exported alias for `hashPassword` (used by seed script) |

### token.service.js

| Export | Purpose |
|--------|---------|
| `signAccessToken(payload)` | Signs JWT with `JWT_SECRET`, expires in `JWT_ACCESS_EXPIRES_IN` |
| `signRefreshToken(payload)` | Signs JWT with `JWT_REFRESH_SECRET`, expires in `JWT_REFRESH_EXPIRES_IN` |
| `verifyRefreshToken(token)` | Verifies with `JWT_REFRESH_SECRET`; throws on invalid/expired |
| `setAuthCookies(res, { accessToken, refreshToken })` | Sets two `HttpOnly`, `SameSite=None`, `Secure` cookies |
| `clearAuthCookies(res)` | Clears both auth cookies |

---

## 6. Database

### User model (`database/models/user.model.js`)

| Field | Type | Notes |
|-------|------|-------|
| `username` | String | Required, unique |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, selected out by default (`select: false`) |
| `role` | String | `"user"` or `"admin"`, default `"user"` |
| `picture` | String | Cloudinary URL or null |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Connection

- `database/dbConnect.js` connects via `process.env.MONGO_URI`.
- `config/startServerWithDB.js` retries connection **up to 5 times** with **5-second** delay before starting the HTTP server.

---

## 7. Error Handling

### Global error handler (`server.js`)

```json
{ "error": "<message>" }
```

HTTP status = `err.statusCode || 500`.

### AppError (`src/utils/AppError.js`)

```javascript
throw new AppError("Human-readable message", statusCode);
```

Constructor: `(message: string, statusCode: number = 500)`.

### Validation errors (`validateRequestBody`)

Returns `400` directly (not via global handler):
```json
{
  "message": "Validation failed.",
  "details": [{ "field": "email", "message": "..." }]
}
```

---

## 8. Environment Variables

| Variable | Used in | Required |
|----------|---------|----------|
| `MONGO_URI` | `database/dbConnect.js` | ✅ |
| `PORT` | `server.js` | Default: `3000` |
| `JWT_SECRET` | `token.service.js` | ✅ |
| `JWT_REFRESH_SECRET` | `token.service.js` | ✅ |
| `JWT_ACCESS_EXPIRES_IN` | `token.service.js` | Default: `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `token.service.js` | Default: `7d` |
| `CLOUDINARY_CLOUD_NAME` | `src/config/cloudinary.js` | ✅ |
| `CLOUDINARY_API_KEY` | `src/config/cloudinary.js` | ✅ |
| `CLOUDINARY_API_SECRET` | `src/config/cloudinary.js` | ✅ |
| `ALLOWED_ORIGIN` | (future env-driven CORS) | Optional |

---

## 9. Server Startup Flow

```
server.js
 ├── load dotenv
 ├── create express app
 ├── register global middleware (express.json, cookieParser, cors)
 ├── mount routes (GET /, /api/auth, /api/admin)
 ├── 404 handler
 ├── global error handler
 └── startServerWithDB(app, PORT)
       └── dbConnect() → mongoose.connect(MONGO_URI)
             ├── success → app.listen(PORT)
             └── failure → retry x5 @ 5s intervals
```

---

## 10. Planned / In Progress

| Feature | Status |
|---------|--------|
| Admin routes & controllers | Route file exists; handlers stubbed |
| Scan / meter OCR upload | Not yet implemented |
| AI / Gemini tips generation | Not yet implemented |
| Dashboard aggregation API | Not yet implemented |
| History / scan detail API | Not yet implemented |
| Notification system | Not yet implemented |
| Tier management API | Not yet implemented |
| Rate limiting (`express-rate-limit`) | Planned |
| `helmet` security headers | Planned |
| Structured logging | Planned |

---

*This document reflects files under `server/` as of June 2026. Update when adding endpoints, middleware, or services.*
