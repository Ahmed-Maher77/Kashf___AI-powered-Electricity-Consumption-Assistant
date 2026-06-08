# Kashf — Team Task Board

**Last updated:** June 2026  
**Related:** [System Operations & Flows](./SYSTEM_OPERATIONS_AND_USER_FLOWS.md) · [Backend Services](./02-backend-services-and-middlewares.md) · [Sitemap & IA](./01-sitemap-and-information-architecture.md)

Use this file to track task ownership across all workstreams. Update status inline and commit the change in your PR.

**Status legend:** `🔴 Todo` · `🟡 In Progress` · `🟢 Done` · `⚪ Planned` · `🔵 Blocked`

---

## Frontend

### Auth & Session
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | Register page + form (React Hook Form + Zod) | — | |
| 🟢 Done | Login page + form | — | |
| 🟢 Done | AuthBootstrap: silent refresh on mount | — | |
| 🟢 Done | Session coordinator (token refresh + retry) | — | |
| 🟢 Done | Redux auth slice (user, accessToken, status) | — | Now includes consumptionGoals, notificationPreferences, phone, governorate, preferredLanguage, createdAt |
| 🟢 Done | Route guards (protected / public / admin) | — | |

### Welcome Page
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | HeroSection | — | |
| 🟢 Done | HowItWorksSection | — | |
| 🟢 Done | FeaturesSection | — | |
| 🟢 Done | ComparisonSection | — | |
| 🟢 Done | AIAssistantSection | — | |
| 🟢 Done | PricingSection | — | Translations in en.json + ar.json |
| 🟢 Done | PWASection (responsive, install prompt) | — | |
| 🟢 Done | TestimonialsSection | — | |
| 🟢 Done | CTASection | — | |
| 🟢 Done | Tabs equal width (grid layout) | — | |
| 🟢 Done | Toggle RTL fix | — | Negative translate in RTL |

### About Page
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | AboutHero (full-viewport, scroll indicator) | — | |
| 🟢 Done | AboutStory (2-col layout + timeline) | — | |
| 🟢 Done | AboutValues (4-card grid) | — | |
| 🟢 Done | AboutTeam (photo, name, title, LinkedIn) | — | |
| 🟢 Done | AboutFAQ (animated accordion) | — | |
| 🟢 Done | AboutCTA (Get Started + Contact Us) | — | |
| 🟢 Done | i18n translations (en + ar) | — | `about.*` namespace |

### i18n & Localization
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | i18next setup (en + ar) | — | |
| 🟢 Done | Language toggle (Navbar) | — | |
| 🟢 Done | RTL layout support | — | Tailwind logical properties |
| 🟢 Done | Pricing translations | — | |
| 🟢 Done | About page translations | — | |
| 🟢 Done | Dashboard translations | — | Done for all user modules |
| 🟢 Done | Scan page translations | — | |
| 🟢 Done | Tips page translations | — | |
| 🟢 Done | Global CSS Configuration | — | Added Tailwind v4 base styles (global cursor pointer) |
| 🔴 Todo | Admin panel translations | — | Lower priority |

### Dashboard (User)
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | PersonalInformation (view + edit profile form) | — | Real data from Redux, edit via PATCH /api/auth/profile, fallbacks for empty fields |
| 🟢 Done | NotificationPreferences (functional toggles) | — | Optimistic toggle, debounced PATCH /api/auth/notifications, RTL fix |
| 🟢 Done | AIAssistantPreferences | — | |
| 🟢 Done | ConsumptionGoals (real goals + edit) | — | Reads user.consumptionGoals, edit via PATCH /api/auth/goals, 0% progress until scans |
| 🟢 Done | SecuritySettings | — | |
| 🟢 Done | ActivityHistory (real API data + semantic icons) | — | useActivity hook, 13-type icon map, relative time, skeleton, empty state, pagination |
| 🟢 Done | PWAStatus | — | |
| 🟢 Done | ProfileHeader (RTL avatar fix, real member since) | — | flex-row-reverse in RTL, real createdAt |
| 🟢 Done | AccountOverview (RTL icon fix) | — | Logical start alignment for icons |
| 🟢 Done | Subscription (real plan data + functional actions) | — | Plan-based feature lists, navigate to /pricing |
| 🟢 Done | ConsumptionAnalyticsPage | — | UI Mocked: Recharts integration for visual data |
| 🟢 Done | MyMetersPage | — | UI Mocked: View, manage, edit meters + AI Tips |
| 🟢 Done | BillsPage & BillingPage | — | UI Mocked: Billing history and subscription management |
| 🟢 Done | ReportsPage & AlertsPage | — | UI Mocked: Detailed exports and notification center |

### Scan Page
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| ⚪ Planned | CameraCapture component | — | `getUserMedia` API |
| ⚪ Planned | ImageUploader (drag & drop + file picker) | — | |
| ⚪ Planned | CapturePreview + retake flow | — | |
| ⚪ Planned | SubmitScanButton → POST /api/scans | — | |
| ⚪ Planned | ProcessingStepper page (`/processing`) | — | |

### History
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| ⚪ Planned | ScanHistoryList (paginated) | — | |
| ⚪ Planned | ScanDetailPage (`/history/:id`) | — | |
| ⚪ Planned | ConsumptionTimeline chart | — | |
| ⚪ Planned | FilterTabs (scans / bills / tiers) | — | |

### Tips & Recommendations
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | PersonalizedTipsFeed | — | UI Mocked: Driven by dummy AI Advices integrated into My Meters |
| ⚪ Planned | TipCategoryFilter | — | |
| ⚪ Planned | SavingsEstimateCard | — | |

### Profile & Account
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| ⚪ Planned | LanguageSelector (already partially done via Navbar) | — | |
| ⚪ Planned | NotificationToggles | — | |
| ⚪ Planned | ThemeSelector (dark/light/system) | — | |
| ⚪ Planned | Profile section (name, email, picture) | — | |

### Admin Panel
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| ⚪ Planned | AdminLayout (sidebar + navbar) | — | |
| ⚪ Planned | Admin Dashboard (KPI cards, charts) | — | |
| ⚪ Planned | Users Management table | — | |
| ⚪ Planned | Scan Management table | — | |
| ⚪ Planned | Tier Management CRUD | — | |
| ⚪ Planned | AI Logs viewer | — | |
| ⚪ Planned | Notifications composer | — | |
| ⚪ Planned | System Settings form | — | |

---

## Backend

### Auth (Implemented ✅)
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | POST /api/auth/register | — | bcrypt, Cloudinary, JWT, cookies, logActivity(register) |
| 🟢 Done | POST /api/auth/login | — | logActivity(login) |
| 🟢 Done | POST /api/auth/logout | — | logActivity(logout) |
| 🟢 Done | POST /api/auth/refresh-token | — | rotating refresh tokens |
| 🟢 Done | GET /api/auth/me | — | isAuthenticated guard |
| 🟢 Done | PATCH /api/auth/profile/picture | — | Multer + Cloudinary, logActivity(picture_updated) |
| 🟢 Done | PATCH /api/auth/profile | — | Edit username, phone, governorate, preferredLanguage; logActivity(profile_updated) |
| 🟢 Done | PATCH /api/auth/goals | — | Update consumptionGoals; logActivity(goals_updated) |
| 🟢 Done | PATCH /api/auth/notifications | — | Partial update notificationPreferences; logActivity(notification_prefs_updated) |
| 🟢 Done | GET /api/activity | — | Paginated activity history for current user |
| 🟢 Done | User model (Mongoose) | — | Added: phone, governorate, preferredLanguage, consumptionGoals, notificationPreferences |
| 🟢 Done | Activity model (Mongoose) | — | userId, type enum (13 types), metadata, 90-day TTL |
| 🟢 Done | activity.service.js (logActivity + getUserActivity) | — | logActivity is non-critical (fire-and-forget) |
| 🟢 Done | User model (Mongoose) | — | username, email, password, role, picture |
| 🟢 Done | token.service.js (sign, verify, set/clear cookies) | — | |
| 🟢 Done | asyncHandler middleware | — | |
| 🟢 Done | isAuthenticated middleware | — | |
| 🟢 Done | isAdmin middleware | — | |
| 🟢 Done | validateRequestBody (Joi factory) | — | |
| 🟢 Done | uploadProfilePicture (Multer memory) | — | |
| 🟢 Done | CORS config (whitelist with localhost + production) | — | |
| 🟢 Done | Global error handler | — | |
| 🟢 Done | AppError utility | — | |
| 🟢 Done | userMapper (toPublicUser) | — | |
| 🟢 Done | Admin seed script | — | `npm run seed:admin` |

### Scan & OCR
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | Scan model (Mongoose) | — | kWh, image, ocrResult, userId, tier, bill |
| 🔴 Todo | POST /api/scans (upload + OCR trigger) | — | |
| 🔴 Todo | GET /api/scans (user history, paginated) | — | |
| 🔴 Todo | GET /api/scans/:id (scan detail) | — | |
| 🔴 Todo | DELETE /api/scans/:id (admin only) | — | |
| 🔴 Todo | scan.service.js | — | Orchestrates OCR + tier calc + tips |
| 🔴 Todo | scan.validation.js | — | |

### Sheriha Tier System
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | Tier model (thresholds, price/kWh, name) | — | |
| 🔴 Todo | tier.service.js (calculate current tier + bill) | — | Core business logic |
| 🔴 Todo | GET /api/tiers (public - for display) | — | |
| 🔴 Todo | Admin CRUD: POST/PATCH/DELETE /api/admin/tiers | — | |
| 🔴 Todo | Seed default Egyptian tariff tiers | — | 2024/2025 rates |

### Dashboard API
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | GET /api/dashboard | — | Latest scan + tier + bill + tips preview |
| 🔴 Todo | dashboard.service.js | — | Aggregation query |

### Tips & AI
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | GET /api/tips | — | Returns tips for current user |
| 🔴 Todo | tips.service.js | — | Calls AI service, caches results |
| 🔴 Todo | Tip model | — | category, body, priority, userId, scanId |

### Admin APIs
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | GET /api/admin/users | — | Paginated user list |
| 🔴 Todo | PATCH /api/admin/users/:id/disable | — | |
| 🔴 Todo | GET /api/admin/scans | — | All scans |
| 🔴 Todo | GET /api/admin/ai-logs | — | OCR + Gemini audit |
| 🔴 Todo | POST/PATCH/DELETE /api/admin/tiers | — | |
| 🔴 Todo | Notifications CRUD | — | |

### Infrastructure
| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | Rate limiting (auth routes) | — | `express-rate-limit` |
| 🔴 Todo | `helmet` security headers | — | |
| 🔴 Todo | Request logger (morgan or pino) | — | |
| 🔴 Todo | Input sanitization | — | Prevent NoSQL injection |
| 🔴 Todo | API versioning (`/api/v1/`) | — | Optional, discuss in team |

---

## AI (Gemini Integration)

| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🔴 Todo | Gemini Vision: OCR meter reading | — | Extract kWh from image |
| 🔴 Todo | Gemini text: generate personalized tips | — | Egyptian Arabic output |
| 🔴 Todo | gemini.service.js | — | Prompt engineering, retries, error handling |
| 🔴 Todo | Prompt templates for tips | — | Category: AC, lighting, appliances, behavior |
| 🔴 Todo | OCR confidence scoring | — | Reject low-confidence reads |
| 🔴 Todo | AI response caching | — | Avoid redundant Gemini calls for same scan |
| 🔴 Todo | AI audit log model | — | Store prompt + response for admin review |
| 🔴 Todo | Fallback tips (when AI unavailable) | — | Static curated tip bank |
| ⚪ Planned | Fine-tune prompts for Egyptian dialect | — | User research needed |
| ⚪ Planned | Multi-language tip generation (AR + EN) | — | |

---

## PWA

| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | PWA install prompt section (welcome page) | — | |
| 🟢 Done | Responsive PWA section layout (mobile stack) | — | |
| 🔴 Todo | `manifest.json` (name, icons, theme color) | — | Required for installability |
| 🔴 Todo | Service worker (offline caching) | — | Vite PWA plugin recommended |
| 🔴 Todo | Offline fallback page | — | |
| 🔴 Todo | Background sync for scan uploads | — | Queue scans when offline |
| 🔴 Todo | Push notifications (tier warning alerts) | — | |
| 🔴 Todo | App icon set (all sizes: 192, 512, maskable) | — | |
| 🔴 Todo | iOS / Android install testing | — | |
| ⚪ Planned | Periodic background sync (auto meter reminder) | — | |

---

## Payment (Stripe)

| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| ⚪ Planned | Stripe account setup | — | Egyptian payment options TBD |
| ⚪ Planned | Plan/subscription model (Free / Plus / Pro) | — | See pricing section |
| ⚪ Planned | Stripe Checkout integration (server-side) | — | `POST /api/payments/create-session` |
| ⚪ Planned | Stripe webhook handler | — | `POST /api/payments/webhook` |
| ⚪ Planned | Subscription status stored on User model | — | `user.plan`, `user.stripeCustomerId` |
| ⚪ Planned | Feature gating (Plus/Pro features behind plan check) | — | |
| ⚪ Planned | Billing portal (manage subscription) | — | Stripe Customer Portal redirect |
| ⚪ Planned | Invoice / receipt emails | — | Stripe handles automatically |
| ⚪ Planned | Free trial logic | — | |
| ⚪ Planned | Promo/coupon codes | — | |
| ⚪ Planned | Frontend: PricingSection → Checkout flow | — | Already designed, needs wiring |
| ⚪ Planned | Frontend: billing/subscription settings page | — | |

---

## Docker & Hosting

| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | Vercel deployment (client) | — | `client/vercel.json` |
| 🟢 Done | Vercel deployment (server) | — | `server/vercel.json` |
| 🟢 Done | CORS configured for Vercel + Netlify + localhost | — | `config/corsOptions.js` |
| 🟢 Done | `.env` removed from git tracking | — | `git rm --cached` |
| 🟡 In Progress | MongoDB Atlas (production cluster) | — | M0 free → M10 when usage grows |
| 🔴 Todo | Dockerfile for server (local dev parity) | — | Optional but recommended |
| 🔴 Todo | `docker-compose.yml` (server + MongoDB locally) | — | |
| 🔴 Todo | GitHub Actions CI (lint, build, test on PR) | — | |
| 🔴 Todo | Staging environment on Vercel (`preview` branch) | — | |
| ⚪ Planned | CDN for static assets (Cloudinary already handles images) | — | |
| ⚪ Planned | Monitoring & alerting (Sentry or Vercel analytics) | — | |
| ⚪ Planned | Migrate to dedicated server (Railway, Render, EC2) | — | When Vercel serverless limits hit |

---

## Docs

| Status | Task | Owner | Notes |
|--------|------|-------|-------|
| 🟢 Done | Sitemap & Information Architecture | — | `docs/01-sitemap-and-information-architecture.md` |
| 🟢 Done | Backend Services & Middlewares | — | `docs/02-backend-services-and-middlewares.md` |
| 🟢 Done | Project Guidelines | — | `docs/03-project-guidelines.md` |
| 🟢 Done | Vercel Deployment Guide | — | `docs/VERCEL_DEPLOYMENT.md` |
| 🟢 Done | System Operations & User Flows | — | `docs/SYSTEM_OPERATIONS_AND_USER_FLOWS.md` |
| 🟢 Done | Team Task Board (this file) | — | `docs/teamTasks.md` |
| 🔴 Todo | API reference (OpenAPI / Swagger) | — | Auto-generate from routes |
| 🔴 Todo | Database schema diagrams | — | Draw.io or Mermaid ER diagrams |
| 🔴 Todo | OCR + AI pipeline diagram | — | |
| 🔴 Todo | Onboarding guide for new team members | — | |
| 🟢 Done | Update docs when scan/dashboard/tips are implemented | — | Updated with current implementation |
| 🔴 Todo | Changelog (notable releases) | — | |

---

## Conventions

- **Status updates:** Change the emoji in your task row when you start or finish. Commit the change in the same PR as the implementation.
- **New tasks:** Add a new row under the correct section. Use `⚪ Planned` if it's future work with no active owner yet.
- **Blocked tasks:** Use `🔵 Blocked`, add a note explaining the dependency.
- **Owner field:** Put your GitHub username or initials. Leave `—` if unassigned.
