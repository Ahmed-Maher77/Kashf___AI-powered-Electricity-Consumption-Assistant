# Kashf — System Operations & User Flows

**Last updated:** June 2026  
**Related:** [Backend Services](./02-backend-services-and-middlewares.md) · [Sitemap & IA](./01-sitemap-and-information-architecture.md)

This document describes every significant user-facing operation in Kashf — step by step, covering what the client does, what the server does, and what can go wrong at each stage.

---

## Table of Contents

1. [Authentication Flows](#1-authentication-flows)
   - [Register](#11-register)
   - [Login](#12-login)
   - [Logout](#13-logout)
   - [Refresh Token (silent)](#14-refresh-token-silent)
   - [Load Current User (me)](#15-load-current-user-me)
2. [Profile Flows](#2-profile-flows)
   - [Update Profile Picture](#21-update-profile-picture)
3. [App Bootstrap Flow](#3-app-bootstrap-flow)
4. [Welcome Page Flow](#4-welcome-page-flow)
5. [About Page Flow](#5-about-page-flow)
6. [Meter & Bill Flow](#6-meter--bill-flow)
7. [Dashboard Flow](#7-dashboard-flow)
8. [Simulation Sandbox Flow](#8-simulation-sandbox-flow)
9. [AI Features Flow](#9-ai-features-flow)
10. [History Flow](#10-history-flow)
11. [Admin Flows](#11-admin-flows) *(planned)*

---

## 1. Authentication Flows

### 1.1 Register

**Entry point:** `/register` page → `RegisterForm` component

#### Step-by-step

```
USER fills form (username, email, password, repassword, optional picture)
  │
  ▼
CLIENT validates form locally (React Hook Form + Zod)
  │
  ├── invalid → show field errors inline, stop
  │
  ▼
CLIENT sends POST /api/auth/register (multipart/form-data)
  │
  ▼
SERVER: uploadProfilePicture middleware
  ├── no file → req.file = undefined (ok)
  └── file → parsed to memory buffer; MIME checked (image/* only)
      └── invalid MIME → 400 error
  │
  ▼
SERVER: validateRequestBody(signupSchema) middleware
  ├── body empty → 400
  ├── Joi validation fails → 400 { message, details[] }
  └── valid → next()
  │
  ▼
SERVER: authService.register()
  ├── User.findOne({ email | username }) → 409 if duplicate
  │
  ├── [if file] uploadToCloudinary(buffer)
  │     └── Cloudinary error → throw (500)
  │
  ├── bcrypt.hash(password, 10)
  │
  ├── User.create({ username, email, hashedPassword, role: "user", picture })
  │     └── DB error → deleteFromCloudinary(pictureUrl) then throw
  │
  ├── signAccessToken(payload)  ─┐
  ├── signRefreshToken(payload)  ├── payload: { userId, role }
  │                              │
  ├── setAuthCookies(res, tokens)
  │     └── sets HttpOnly, Secure, SameSite=None cookies:
  │           - accessToken (short-lived)
  │           - refreshToken (long-lived)
  │
  └── returns { user: toPublicUser(user), accessToken }
  │
  ▼
SERVER responds 201:
  { success: true, data: { user, accessToken } }
  │
  ▼
CLIENT receives response
  ├── stores accessToken in Redux state (in-memory only — not localStorage)
  ├── stores user profile in Redux state
  └── redirects to /dashboard
```

#### Error paths

| Error | HTTP | User sees |
|-------|------|-----------|
| Duplicate email/username | 409 | "Email or username already in use." |
| Joi validation failure | 400 | Field-level errors on the form |
| Image MIME type wrong | 400 | "Invalid file type" |
| Cloudinary failure | 500 | Generic error toast |
| DB failure | 500 | Generic error toast |

---

### 1.2 Login

**Entry point:** `/login` page → `LoginForm` component

#### Step-by-step

```
USER fills form (email, password)
  │
  ▼
CLIENT local validation
  │
  ▼
CLIENT sends POST /api/auth/login (application/json)
  │
  ▼
SERVER: validateRequestBody(loginSchema) → 400 on failure
  │
  ▼
SERVER: authService.login()
  ├── User.findOne({ email }).select("+password")
  │     └── not found → throw AppError(401)
  │
  ├── bcrypt.compare(password, user.password)
  │     └── mismatch → throw AppError(401)
  │
  ├── signAccessToken + signRefreshToken
  │
  ├── setAuthCookies(res, tokens)
  │
  └── returns { user: toPublicUser(user), accessToken }
  │
  ▼
SERVER responds 200:
  { success: true, data: { user, accessToken } }
  │
  ▼
CLIENT
  ├── stores accessToken + user in Redux
  └── redirects to /dashboard
```

#### Error paths

| Error | HTTP | User sees |
|-------|------|-----------|
| Wrong credentials | 401 | "Invalid email or password." |
| Validation failure | 400 | Field errors |

---

### 1.3 Logout

**Entry point:** User menu → Logout button

#### Step-by-step

```
USER clicks Logout
  │
  ▼
CLIENT sends POST /api/auth/logout
  │
  ▼
SERVER: authService.logout()
  └── clearAuthCookies(res)
        ├── sets accessToken cookie: maxAge=0 (delete)
        └── sets refreshToken cookie: maxAge=0 (delete)
  │
  ▼
SERVER responds 200:
  { success: true, message: "Logged out successfully." }
  │
  ▼
CLIENT
  ├── clears Redux auth state
  └── redirects to /login (or / welcome)
```

---

### 1.4 Refresh Token (silent)

**Entry point:** Automatic — triggered by `AuthBootstrap` on app mount, or when an API request gets 401.

#### Step-by-step

```
CLIENT app mounts  (or receives 401 on any API call)
  │
  ▼
refreshTokenService sends POST /api/auth/refresh-token
  └── cookie: refreshToken is sent automatically (HttpOnly)
  │
  ▼
SERVER: authService.refreshToken()
  ├── reads req.cookies[AUTH_COOKIE_KEYS.REFRESH_TOKEN]
  │     └── missing → throw AppError(401)
  │
  ├── verifyRefreshToken(value)
  │     └── invalid / expired → throw AppError(401)
  │
  ├── User.findById(decoded.userId)
  │     └── not found → throw AppError(401)
  │
  ├── buildTokens(user) → new access + refresh pair
  ├── setAuthCookies(res, tokens)
  └── returns { accessToken }
  │
  ▼
SERVER responds 200:
  { success: true, data: { accessToken } }
  │
  ▼
CLIENT
  ├── updates accessToken in Redux
  └── retries the original failed API request (if triggered by 401 interceptor)
```

#### Error paths

| Error | HTTP | Result |
|-------|------|--------|
| Missing / expired refresh token | 401 | Client clears auth state → user sees login page |

---

### 1.5 Load Current User (me)

**Entry point:** `AuthBootstrap` on app mount, after successful token refresh.

#### Step-by-step

```
CLIENT sends GET /api/auth/me
  └── header: Authorization: Bearer <accessToken>
  │
  ▼
SERVER: isAuthenticated middleware
  ├── extracts token from Authorization header or access-token cookie
  ├── verifies with JWT_SECRET
  │     └── invalid → 401
  └── attaches req.user = { id, role }
  │
  ▼
SERVER: authService.getMe({ userId: req.user.id })
  ├── User.findById(userId)
  │     └── not found → 404
  └── returns toPublicUser(user)
  │
  ▼
SERVER responds 200:
  { success: true, data: { user } }
  │
  ▼
CLIENT
  └── stores user in Redux auth state
```

---

## 2. Profile Flows

### 2.1 Update Profile Picture

**Entry point:** Settings or profile page → `ProfilePictureUploader`

#### Step-by-step

```
USER selects/drags an image
  │
  ▼
CLIENT local validation (file type, size)
  │
  ▼
CLIENT sends PATCH /api/auth/profile/picture (multipart/form-data)
  └── header: Authorization: Bearer <accessToken>
  │
  ▼
SERVER: isAuthenticated → req.user
  │
  ▼
SERVER: uploadProfilePicture middleware
  └── parses file to req.file.buffer
  │
  ▼
SERVER: authService.updateProfilePicture({ userId, file })
  ├── file missing → 400
  ├── User.findById(userId) → 404 if not found
  ├── uploadToCloudinary(file.buffer) → new pictureUrl
  ├── user.picture = pictureUrl; user.save()
  ├── [if previous picture] deleteFromCloudinary(previousUrl)
  └── returns toPublicUser(user)
  │
  ▼
SERVER responds 200:
  { success: true, data: { user } }
  │
  ▼
CLIENT
  └── updates user.picture in Redux state → avatar re-renders
```

#### Error paths

| Error | HTTP | User sees |
|-------|------|-----------|
| No file sent | 400 | "Profile picture is required." |
| Cloudinary error | 500 | Generic toast; old picture unchanged |

---

## 3. App Bootstrap Flow

**Triggered on:** every page load / app mount (`AuthBootstrap.jsx`)

```
App mounts
  │
  ▼
AuthBootstrap useEffect runs
  │
  ├── sessionCoordinator.initialize()
  │     │
  │     ├── POST /api/auth/refresh-token
  │     │     ├── success → new accessToken in memory
  │     │     │            └── GET /api/auth/me → populate Redux user
  │     │     └── failure (401) → Redux auth = unauthenticated
  │     │
  │     └── listen for token expiry events → auto-refresh
  │
  ▼
React Router renders:
  ├── [authenticated] → route guard passes → requested page
  └── [unauthenticated] → redirect to /login  (protected routes)
                        → welcome page renders  (public routes)
```

---

## 4. Welcome Page Flow

**Entry point:** `/` — public, no auth required

```
User visits /
  │
  ▼
WelcomePage renders sections in order:
  1. HeroSection         — headline, CTA, background animation
  2. HowItWorksSection   — 3-step explainer
  3. FeaturesSection     — feature cards
  4. ComparisonSection   — before/after comparison
  5. AIAssistantSection  — AI chat demo
  6. PricingSection      — pricing plans
  7. PWASection          — install prompt
  8. TestimonialsSection — social proof
  9. CTASection          — final call to action
  │
  ▼
i18n: all strings loaded from locales/en.json or locales/ar.json
  └── language determined by i18next (localStorage, browser, default)
  │
  ▼
User actions:
  ├── CTA "Get Started" → /register
  ├── "Sign In" → /login
  ├── Language toggle → switches locale, flips RTL direction
  └── PWA install button → browser install prompt
```

---

## 5. About Page Flow

**Entry point:** `/about` — public

```
User visits /about
  │
  ▼
AboutPage composes:
  1. AboutHero    — full-viewport hero with scroll indicator
  2. AboutStory   — 2-col layout: story text + colored timeline
  3. AboutValues  — 4-card values grid
  4. AboutTeam    — team member cards (photo, name, title, LinkedIn)
  5. AboutFAQ     — animated accordion (7 items)
  6. AboutCTA     — "Get Started" + "Contact Us" buttons
  │
  ▼
i18n: all strings from about.* namespace in locales/
  ├── EN: about.hero.title, about.story.body1, etc.
  └── AR: same keys, Arabic text, RTL layout auto-applied
  │
  ▼
User actions:
  ├── FAQ item click → accordion expand/collapse (CSS max-height transition)
  ├── Scroll indicator → smooth scroll to #about-story
  ├── "Get Started" → /register
  └── LinkedIn cards → open linkedin.com in new tab
```

---

## 6. Meter & Bill Flow

**Entry point:** `/meters` (user dashboard) or `/bills`

Consumption data enters the system through manual bill entry linked to meters. There is no automated OCR or hardware pipeline.

### 6.1 Create a Meter

```
USER opens My Meters page → clicks "Add Meter"
  │
  ▼
CLIENT shows create meter form (name, number, type, status)
  │
  ▼
CLIENT sends POST /api/meters
  │
  ▼
SERVER: isAuthenticated → req.user
  │
  ▼
SERVER: meterController.createMeter()
  ├── Validates name and number (required)
  ├── Checks meter limit by plan (free=1, plus=2, family=5)
  ├── Checks duplicate meter number for this user
  ├── Meter.create({ user, name, number, type, status })
  └── Returns created meter
  │
  ▼
CLIENT adds meter to Redux store → list re-renders
```

### 6.2 View Meters (with consumption)

```
CLIENT sends GET /api/meters
  │
  ▼
SERVER: meterController.getMeters()
  ├── Finds all meters for user
  ├── For each meter:
  │     ├── Query linked bills sorted by dueDate
  │     ├── If bills exist → use latest bill.consumption + bill.tier
  │     │                    and trend = all bill consumptions
  │     └── If no bills  → generate synthetic 5-point trend
  │                        based on meter type (residential/commercial/vacation)
  │                        and derive tier from consumption
  └── Returns formatted meters with consumption, tier, trend, lastReading
  │
  ▼
CLIENT renders meter cards with gauge, trend chart, tier badge
```

### 6.3 Add a Bill (Manual Entry)

```
USER navigates to Bills page → clicks "Add Bill"
  │
  ▼
CLIENT shows bill form (month, consumption kWh, tier, amount, status, dueDate, meter)
  │
  ▼
CLIENT sends POST /api/bills
  │
  ▼
SERVER: billController.addBill()
  ├── Bill.create({ user, meter, month, consumption, tier, amount, status, dueDate })
  └── Returns created bill
  │
  ▼
CLIENT adds bill to list → consumption updates on meter cards
```

#### Error paths

| Error | HTTP | User sees |
|-------|------|-----------|
| Missing name/number for meter | 400 | "Please provide name and number for the meter" |
| Duplicate meter number | 400 | "Meter with this number already exists" |
| Plan meter limit reached | 400 | "You have reached the maximum number of meters..." |

---

## 7. Dashboard Flow

**Entry point:** `/dashboard`

```
isAuthenticated guard → user must be logged in
  │
  ▼
Dashboard UI shell loads with sidebar navigation
  │
  ▼
User navigates through available modules:
  ├── Overview (/dashboard): Summary cards, Consumption Gauge, Monthly Trends Chart, and Recent Activity.
  ├── My Meters (/meters): Manage registered meters (CRUD using local React state) with dummy AI Advices.
  ├── Analytics (/analytics): Recharts-based consumption data.
  ├── Bills (/bills): Billing history and estimates.
  ├── AI Advisor (/ai-advisor): Personalized recommendations mock layout.
  ├── Alerts (/alerts): Notification center.
  ├── Reports (/reports): Detailed PDF/Excel exports.
  └── Profile (/profile): Manage settings and security.
  │
  ▼
Frontend requests specific endpoint data based on active route
  ├── NOTE: Core features (My Meters, Dashboard Stats, AI Advices) currently utilize local state and mock data arrays.
  └── UI fully supports RTL and LTR directionality based on the selected language (`ar` / `en`).
  │
  ▼
Data rendered visually using Recharts (Analytics), tables (Bills/History), etc.
```

---

## 8. Simulation Sandbox Flow

**Entry point:** `/simulations` — virtual appliance sandbox for what-if analysis and AI advice

### 8.1 Create & Configure Simulation

```
USER opens Simulations → clicks "New Simulation"
  │
  ▼
CLIENT sends POST /api/simulations { name, autoGenerate }
  │
  ▼
SERVER creates Simulation document with circuits & devices
  ├── autoGenerate=true → pre-populated with 5 circuits (Kitchen, Living Room,
  │                        Bedroom, Bathroom, Office) and default appliances
  └── autoGenerate=false → empty circuits, user adds manually
  │
  ▼
USER can add/remove circuits and devices
  ├── POST /api/simulations/:id/circuits
  ├── DELETE /api/simulations/:id/circuits/:cid
  ├── POST /api/simulations/:id/devices
  ├── PATCH /api/simulations/:id/devices/:did  (toggle isOn, set essential flag)
  └── DELETE /api/simulations/:id/devices/:did
```

### 8.2 Run Simulation

```
USER clicks "Start"
  │
  ▼
CLIENT sends POST /api/simulations/:id/start
  │
  ▼
SERVER: Engine tick loop starts
  ├── Every 1 second: totalKWh += totalWatts / 3600
  ├── Tracks currentTier, estimatedBill based on active devices
  ├── Runtime state kept in-memory (Map<simId, Runtime>)
  └── SSE stream broadcasts state to subscribed clients
  │
  ▼
CLIENT connects to GET /api/simulations/:id/stream (SSE)
  └── Receives real-time: totalKWh, tier, bill, circuit loads, device states
  │
  ▼
USER can pause (POST /pause), reset (POST /reset), or toggle devices live
```

### 8.3 Tier Prediction

```
CLIENT sends GET /api/simulations/:id/prediction
  │
  ▼
SERVER (pure math, no AI):
  ├── Calculates remaining kWh before next tier threshold
  ├── Hours until next tier at current consumption rate
  └── Warning level: green / yellow / orange / red
```

### 8.4 What-If Analysis

```
USER requests what-if projection
  │
  ▼
CLIENT sends POST /api/simulations/:id/what-if
Body: { deviceId: "...", turnOff: true }
  │
  ▼
SERVER clones current runtime, applies toggle,
projects kWh/bill/tier differences
  └── Returns comparison: current vs projected
```

---

## 9. AI Features Flow

AI features are powered by **Groq** (Llama 3.3 70B) via an OpenAI-compatible client, focused on the simulation sandbox.

### 9.1 AI Consumption Advisor

**Entry point:** Simulation detail page → "Get Advice" button

```
CLIENT sends POST /api/simulations/:id/advise
  │
  ▼
SERVER builds prompt from simulation state:
  ├── totalKWh, currentTier, estimatedBill
  ├── Circuits table with loadW per circuit
  └── User consumption goals
  │
  ▼
SERVER calls Groq API (groq.js → generateAdvice)
  └── Returns 3 parsed tips: { device, advice, savings }
  │
  ▼
CLIENT displays tips in Egyptian Arabic (Ammiya)
```

### 9.2 Smart Recommendations

```
CLIENT sends POST /api/simulations/:id/recommend
  │
  ▼
SERVER performs deep analysis:
  ├── Load distribution across circuits
  ├── Device profile breakdown (high-load vs essential vs non-essential)
  ├── Tier progression risk
  └── Calls Groq with structured context
  │
  ▼
Returns categorized findings + quick-wins + priority rating
```

### 9.3 Natural Language Chat

```
USER types a message (Arabic or English)
  │
  ▼
CLIENT sends POST /api/simulations/:id/chat
Body: { message: "شغل التكييف في غرفة النوم" }
  │
  ▼
SERVER:
  ├── Checks coin balance (1 coin per message)
  ├── Calls Groq for intent classification
  │     └── Detects intent: toggle_device | query_state | advise | what_if | unknown
  ├── Executes action (toggle device, run what-if, fetch prediction, etc.)
  ├── Deducts 1 coin
  └── Returns response in Arabic
  │
  ▼
CLIENT displays chat response
```

#### Error paths

| Error | HTTP | User sees |
|-------|------|-----------|
| Insufficient coins | 400 | "Insufficient coins. Please upgrade..." |
| Idempotent duplicate (same message within 5s) | 200 | Cached response, no coin deducted |

### 9.4 Auto-Pilot

```
USER sets consumption goal and enables Auto-Pilot
  │
  ▼
CLIENT sends POST /api/simulations/:id/auto-pilot/start
Body: { monthlyKwhLimit, targetBillEgp }
  │
  ▼
SERVER:
  ├── Saves consumption goal on simulation
  ├── Enables autoPilot flag
  └── Engine tick loop checks:
        If projected consumption exceeds goal →
        turns off non-essential devices automatically
```

---

## 10. History Flow

**Entry point:** `/bills`

```
GET /api/bills?page=1&limit=10&status=all&year=2026
  │
  ▼
SERVER: billController.getBills()
  ├── Filters by user, optional status and year
  ├── Paginated results sorted by dueDate desc
  └── Returns bills with populated meter data
  │
  ▼
CLIENT renders bill list with status badges, edit/delete actions
```

---

## 11. Admin Flows *(planned)*

### Admin Login

Same as user login, but `user.role === "admin"` → redirected to `/admin/dashboard`.

### Admin route guard

```
Request to /api/admin/* or /admin/* page
  │
  ▼
isAuthenticated → req.user attached
  │
  ▼
isAdmin → req.user.role === "admin"
  └── not admin → 403 AppError
```

### Planned admin operations

| Operation | Endpoint | Notes |
|-----------|----------|-------|
| List users | `GET /api/admin/users` | Paginated |
| Disable user | `PATCH /api/admin/users/:id/disable` | Sets user.active = false |
| List all bills | `GET /api/admin/bills` | |
| Manage tiers | `GET/POST/PATCH/DELETE /api/admin/tiers` | Sheriha pricing rules |
| View AI logs | `GET /api/admin/ai-logs` | Groq prompt/response audit trail |

---

## Appendix: Cookie Strategy

| Cookie | Name | Lifetime | Flags |
|--------|------|----------|-------|
| Access token | `accessToken` | `JWT_ACCESS_EXPIRES_IN` (default 15m) | `HttpOnly`, `Secure`, `SameSite=None` |
| Refresh token | `refreshToken` | `JWT_REFRESH_EXPIRES_IN` (default 7d) | `HttpOnly`, `Secure`, `SameSite=None` |

- `HttpOnly` — not accessible by JavaScript (XSS protection)
- `Secure` — only sent over HTTPS
- `SameSite=None` — required for cross-origin requests (client and server on different Vercel projects)
- `Credentials: true` must be set on both the client `fetch`/`axios` config and the server CORS config

---

## Appendix: Auth State Machine (client)

```
INITIAL
  │
  ├──[app mount]──▶ LOADING
  │                    │
  │         ┌──────────┴──────────┐
  │         │                     │
  │    refresh ok           refresh fail (401)
  │         │                     │
  │         ▼                     ▼
  │    AUTHENTICATED          UNAUTHENTICATED
  │         │                     │
  │   [logout / 401]        [login success]
  │         │                     │
  │         └──────────┬──────────┘
  │                    │
  └────────────────────┘
```

---

*Update this document when any new operation is implemented or an existing flow changes.*
