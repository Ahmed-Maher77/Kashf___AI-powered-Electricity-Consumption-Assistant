# Kashf — Project Guidelines

Team reference for consistent backend and frontend development. Follow these conventions on every PR.

**Related docs:** [Sitemap & IA](./01-sitemap-and-information-architecture.md) · [Backend services](./02-backend-services-and-middlewares.md) · [System Flows](./SYSTEM_OPERATIONS_AND_USER_FLOWS.md) · [Deployment](./VERCEL_DEPLOYMENT.md)

---

## Table of contents

1. [Repository structure](#1-repository-structure)
2. [Environment variables (.env)](#2-environment-variables-env)
3. [Error handling — AppError](#3-error-handling--apperror)
4. [Validation (Joi)](#4-validation-joi)
5. [Middlewares](#5-middlewares)
6. [Backend module pattern](#6-backend-module-pattern)
7. [Service & database layers](#7-service--database-layers)
8. [Frontend guidelines](#8-frontend-guidelines)
9. [Git & collaboration](#9-git--collaboration)
10. [Checklist before opening a PR](#10-checklist-before-opening-a-pr)

---

## 1. Repository structure

```
Kashf/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI (common/, Loader/, …)
│       ├── layouts/        # UserLayout, AdminLayout
│       ├── pages/          # Route pages (user/, admin/)
│       └── routes/         # router.jsx, lazyPages.js
├── server/                 # Express API
│   ├── config/             # cors, server startup
│   ├── database/           # MongoDB connection
│   └── src/
│       ├── middlewares/
│       ├── modules/        # routes + controllers per feature
│       ├── validations/    # Joi schemas (use this for new features)
│       ├── services/       # Business logic (add here)
│       ├── models/         # Mongoose models (add here)
│       └── utils/          # AppError, helpers
└── docs/                   # Architecture & guidelines
```

**Naming**

| Item | Convention | Example |
|------|------------|---------|
| Files | `kebab-case` or `camelCase` matching existing folder | `user.controller.js` |
| Routes mount | `/api/<feature>` | `/api/auth`, `/api/scans` |
| React components | `PascalCase` | `Header.jsx` |
| Env keys | `SCREAMING_SNAKE_CASE` | `MONGO_URI` |

---

## 2. Environment variables (.env)

Create `server/.env` locally (never commit — already in `.gitignore`). Share values securely with the team (not in chat screenshots).

### Required (server)

```env
# Server port (optional — defaults to 3000; ignored on Vercel)
PORT=3000

# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/kashf

# JWT
JWT_SECRET=your-long-random-secret
JWT_REFRESH_SECRET=your-different-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS — comma-separated list of allowed client origins
# In production, set on Vercel dashboard
ALLOWED_ORIGIN=http://localhost:5173
```

### Required (client)

```env
# Full URL including https://
VITE_API_BASE_URL=http://localhost:3000
```

### Planned (add when feature is implemented)

```env
# AI — Gemini
GEMINI_API_KEY=

# Stripe (payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Upload limits
MAX_FILE_SIZE_MB=5
```

### Rules

- Do **not** commit `.env` files.
- Document new variables in this file and in PR descriptions.
- Use `process.env.VAR_NAME` only on the server; use `import.meta.env.VITE_*` on the client.

---

## 3. Error handling — AppError

**Rule:** Use `AppError` for operational failures in controllers and services. Do **not** scatter `res.status(4xx).json({ error: ... })` for expected errors in business logic.

**Location:** `server/src/utils/AppError.js`

### Constructor (correct order)

```javascript
throw new AppError("Human-readable message", statusCode);
```

| Argument | Type | Default |
|----------|------|---------|
| `message` | `string` | required |
| `statusCode` | `number` | `500` |

### Examples

```javascript
import AppError from "../utils/AppError.js";

// 400 — bad input / business rule
throw new AppError("Email is already registered.", 400);

// 401 — not authenticated
throw new AppError("Invalid email or password.", 401);

// 403 — authenticated but not allowed
throw new AppError("Admin access required.", 403);

// 404 — resource missing
throw new AppError("Scan not found.", 404);

// 500 — unexpected (prefer rarely; log internally)
throw new AppError("Failed to process meter image.", 500);
```

### Global response shape

The global handler in `server.js` returns:

```json
{
  "error": "Human-readable message"
}
```

HTTP status = `err.statusCode` (or `500`).

### Controller pattern

Always forward errors to Express so the global handler runs:

```javascript
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err); // AppError or unexpected Error
    }
};
```

Or `async` + `throw` inside services and let a wrapper call `next(err)` (see [asyncHandler](#async-handler-recommended) below).

### Do / Don't

| Do | Don't |
|----|--------|
| `throw new AppError("Not found.", 404)` | `res.status(404).json({ error: "Not found." })` in services |
| `next(err)` in `catch` | Swallow errors with empty `catch {}` |
| Meaningful messages for clients | Leaking stack traces or `err.message` from Mongo in production |
| Consistent `{ error: message }` via global handler | Mixed shapes (`msg`, `message`, `errors`) for AppError paths |

### Joi validation responses

`validateRequestBody` returns field-level errors **without** `AppError` (by design):

```json
{
  "message": "Validation failed.",
  "details": [
    { "field": "email", "message": "\"email\" must be a valid email" }
  ]
}
```

Status `400`. Controllers should not duplicate this — attach validation middleware on the route instead.

### Fix existing calls

`AppError` is `(message, statusCode)`. Any call like `new AppError(400, "text")` is **wrong** and must be corrected to `new AppError("text", 400)`.

---

## 4. Validation (Joi)

### Folder

Put Joi schemas in:

```
server/src/validations/
  user.validation.js
  scan.validation.js
  ...
```

**Legacy:** `user.validation.js` currently lives under `src/modules/`. New schemas go in `src/validations/`; migrate old files when touching that module.

### File template

```javascript
// server/src/validations/user.validation.js
import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
});

export const signupSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9-]+( [a-zA-Z0-9-]+)?$/)
        .min(3)
        .max(200)
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    repassword: Joi.valid(Joi.ref("password")).required()
        .messages({ "any.only": "Passwords must match." }),
    role: Joi.string().valid("user", "admin").default("user"),
});
```

### Wire validation on routes

```javascript
// server/src/modules/user.routes.js
import { Router } from "express";
import * as userController from "./user.controller.js";
import validateRequestBody from "../middlewares/validateRequestBody.js";
import { loginSchema, signupSchema } from "../validations/user.validation.js";

const router = Router();

router.post(
    "/register",
    validateRequestBody(signupSchema),
    userController.register
);

router.post(
    "/login",
    validateRequestBody(loginSchema),
    userController.login
);

export default router;
```

### Joi conventions

- One schema per operation (`loginSchema`, `createScanSchema`).
- `abortEarly: false` is already set in middleware — return all field errors at once.
- Use `.messages({ ... })` for user-friendly copy when defaults are unclear.
- Export named schemas; avoid default export for multiple schemas.
- Validate **only** at the edge (route middleware), not again inside services unless transforming data.

### What middleware checks (before Joi)

1. Body exists and is non-empty object.
2. Joi `validate()` runs.
3. On success → `next()` → controller.

---

## 5. Middlewares

### Global (register in `server.js` only)

| Order | Middleware | Purpose |
|-------|------------|---------|
| 1 | `express.json()` | Parse JSON bodies |
| 2 | `cors(corsOptions)` | CORS; `credentials: true` |
| … | Route mounts | `/api/...` |
| n-1 | 404 handler | Unmatched routes (HTML today) |
| n | Error handler | `AppError` → JSON `{ error }` |

Do not register feature-specific middleware globally unless every route needs it.

### Project middleware (`server/src/middlewares/`)

| File | Usage |
|------|--------|
| `validateRequestBody.js` | `validateRequestBody(schema)` on routes with JSON body |

### Adding new middleware

1. Create `src/middlewares/<name>.js`.
2. Export a factory or function `(req, res, next)`.
3. Use `throw new AppError("...", 4xx)` for failures (correct argument order).
4. Apply on routes that need it, not globally, unless required.

### Planned middleware (create when feature lands)

| Middleware | Purpose |
|------------|---------|
| `authenticate` | Verify JWT / session; attach `req.user` |
| `authorizeAdmin` | `req.user.role === "admin"` |
| `uploadImage` | Multer + MIME/size checks |
| `rateLimiter` | Brute-force protection on auth |
| `asyncHandler` | Wrap async controllers → `next(err)` |

### Async handler (recommended)

```javascript
// server/src/middlewares/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

```javascript
import asyncHandler from "../middlewares/asyncHandler.js";

router.post(
    "/login",
    validateRequestBody(loginSchema),
    asyncHandler(userController.login)
);
```

Then controllers may `throw new AppError(...)` without try/catch.

### CORS

Configured in `server/config/corsOptions.js`. The `allowedOrigins` array is the active whitelist (localhost + production Vercel/Netlify URLs). Add any new deployment URL to the array and redeploy.

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for full CORS and deployment guidance.

---

## 6. Backend module pattern

Each feature = one module folder or prefix under `src/modules/`:

```
user.routes.js      → HTTP paths only
user.controller.js  → thin: parse req, call service, send res
user.service.js     → business logic (create in services/)
user.validation.js  → move to validations/ (see above)
```

### Controller responsibilities

- Read `req.body`, `req.params`, `req.query`, `req.user`.
- Call **one** service method.
- Return `res.status(20x).json({ ... })` on success.
- Never access Mongoose directly — use service layer.

### Route responsibilities

- Map method + path → middleware chain → controller.
- No business logic in routes file.

### Response shape (success)

Prefer a consistent envelope:

```json
{
  "success": true,
  "data": { }
}
```

Agree on extensions (`message`, `meta`) in PR review; document new patterns here.

### Register routes in `server.js`

```javascript
import scanRoutes from "./src/modules/scan.routes.js";

app.use("/api/scans", scanRoutes);
```

---

## 7. Service & database layers

### Services (`server/src/services/`)

- All business rules, hashing, JWT, external APIs (Gemini, OCR).
- Throw `AppError` for expected failures.
- Return plain data objects to controllers.

```javascript
// server/src/services/auth.service.js
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }
    // … verify password, return safe user + token
};
```

### Models (`server/src/models/`)

- Mongoose schemas only.
- No HTTP or `res`/`req` in models.

### Database connection

- `database/dbConnect.js` uses `MONGO_URI`.
- Server starts only after DB connects (`config/startServerWithDB.js`), with retry (max 5 × 5s).

---

## 8. Frontend guidelines

### Stack

- React 19 + Vite + React Router 7
- Tailwind CSS v4 (`@import "tailwindcss"` in `index.css`)
- Theme tokens: `kashf-blue`, `kashf-light-blue`, `kashf-bg`, etc.
- Framer Motion (for complex animations and scroll reveals)
- Recharts (for data visualization)

### Structure

| Area | Location |
|------|----------|
| Pages | `src/pages/user/`, `src/pages/admin/` |
| Shared UI | `src/components/common/` (Header, Footer) |
| Layouts | `src/layouts/` |
| Routes | `src/routes/router.jsx` + lazy imports in `lazyPages.js` |
| Utils | `src/utils/` (Helper functions, shared `animations.js`) |

### Routing

- Add lazy import in `lazyPages.js`.
- Register path in `router.jsx` under `UserLayout` or `AdminLayout`.
- Match paths in [sitemap doc](./01-sitemap-and-information-architecture.md).

### Styling

- Use **Tailwind utility classes** in JSX.
- Component-specific CSS only when necessary (e.g. `Loader.css` for SVG animations).
- Do not add new plain `.css` layout files without team agreement.
- For Framer Motion animations, do not inline standard variants (like `fadeUpVariants`). Import them centrally from `src/utils/animations.js` to ensure consistent easing and timings across the app.

### API calls (when integrated)

- Base URL from `import.meta.env.VITE_API_BASE_URL`.
- Handle `{ error: string }` from backend.
- Handle validation `400` with `details[]` for forms.

### Components

- Keep pages thin; extract reusable pieces to `components/`.
- Use `PagePlaceholder` only for unfinished pages — replace with real UI when implementing.

---

## 9. Git & collaboration

- **Branch naming:** `feature/scan-upload`, `fix/auth-validation`, `docs/guidelines`
- **Commits:** Short imperative subject; optional body for why.
- **PRs:** Link issue/task; list env vars added; note API contract changes.
- **Reviews:** Check AppError usage, validation on routes, no secrets in diff.
- **Do not commit:** `node_modules/`, `.env`, build output (`dist/`).

### Run locally

```bash
# Terminal 1 — API
cd server
npm install
# create .env with MONGO_URI and PORT
npm run dev

# Terminal 2 — Client
cd client
npm install
npm run dev
```

---

## 10. Checklist before opening a PR

### Backend

- [ ] Route registered in `server.js` under correct `/api/...` prefix
- [ ] Joi schema in `src/validations/` and `validateRequestBody(schema)` on route
- [ ] Controller is thin; logic in service
- [ ] Errors use `throw new AppError(message, statusCode)` — not `res.json` for errors
- [ ] Async controller uses `next(err)` or `asyncHandler`
- [ ] New env vars documented in this file + `.env` example in PR
- [ ] No secrets or real credentials in code

### Frontend

- [ ] Route added with lazy loading
- [ ] Tailwind classes (no unnecessary new CSS files)
- [ ] Matches IA route from docs/01
- [ ] API errors displayed appropriately

### Docs

- [ ] Update `02-backend-services-and-middlewares.md` when adding endpoints or middleware

---

## Quick reference card

```javascript
// Error
throw new AppError("Something went wrong.", 400);

// Route
router.post("/path", validateRequestBody(mySchema), asyncHandler(controller.action));

// Success
res.status(200).json({ success: true, data: result });

// Never in service/controller for expected errors
res.status(400).json({ error: "..." });  // ❌ use AppError instead
```

---

*Questions or proposed changes to these guidelines: discuss in team chat and update this document in the same PR as the convention change.*
