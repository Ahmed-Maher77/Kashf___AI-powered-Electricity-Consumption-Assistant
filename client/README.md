# Kashf — AI-Powered Electricity Management

Egyptian households' smart electricity assistant: scan meters, track Sheriha tiers in real time, forecast bills, and get personalized Arabic-language recommendations to save money every month.

## Features

- **Smart Meter Scanning** — OCR-powered instant meter reading via phone camera
- **Sheriha Tier Tracking** — Real-time consumption monitoring with 48-hour cost forecasting
- **AI Energy Assistant** — Personalized recommendations in Egyptian Arabic
- **Progressive Web App** — Installable offline-first, works on iOS/Android/Windows/macOS without app store
- **Multi-language** — English & Arabic (RTL support)
- **Responsive Design** — Mobile-first, optimized for curved screens

## Tech Stack

- **React 19** + **Vite 8** + **React Compiler**
- **Tailwind CSS v4** — utility-first styling
- **React Router v7** — client-side routing
- **Redux Toolkit** — state management
- **TanStack Query** — server state & caching
- **React Hook Form + Zod** — forms & validation
- **i18next** — internationalization (EN/AR)
- **Lucide React** — icon system
- **ESLint** — linting

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts
│   ├── components/
│   │   ├── about/          # About page sections
│   │   ├── auth/           # Auth forms & components
│   │   ├── common/         # Shared UI (headers, footer, logo)
│   │   ├── icons/          # Custom SVG icons
│   │   ├── welcome/        # Landing page sections
│   │   │   └── ui/         # Reusable welcome components
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Translations (EN/AR)
│   ├── pages/              # Route-level components
│   │   ├── admin/          # Admin dashboard pages
│   │   └── user/           # User-facing pages
│   ├── store/              # Redux slices
│   ├── utils/              # Helper functions
│   ├── App.jsx             # App entry with routing
│   └── main.jsx            # Vite entry point
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml            # Netlify deployment config
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing, testimonials |
| `/about` | Company story, values, team, FAQ, CTA |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | User dashboard (authenticated) |
| `/scan` | Meter scanning (authenticated) |
| `/history` | Consumption history (authenticated) |
| `/tips` | AI recommendations (authenticated) |
| `/settings` | User settings (authenticated) |
| `/admin/*` | Admin panel (role-based) |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Environment Variables

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Deployment (Netlify)

The project includes `netlify.toml` for zero-config deployment:

1. Connect Git repo to Netlify
2. Set base directory to `client`
3. Add `VITE_API_BASE_URL` environment variable
4. Deploy

Build command: `npm run build`
Publish directory: `dist`

## Internationalization

Translations live in `src/i18n/locales/`:
- `en.json` — English
- `ar.json` — Arabic (RTL)

Add new keys to both files. Use `t('namespace.key')` in components.

## Navbar Scroll Sync

The marketing header uses `IntersectionObserver` to highlight the active section as you scroll. Sections tracked:
- Hero, Stats, Meter, Features, How It Works, PWA, Testimonials, Pricing

## Responsive Breakpoints

- Mobile: `< 640px` (px-4 → px-6 padding)
- Tablet: `640px–1023px`
- Desktop: `≥ 1024px` (burger menu hidden, full nav visible)

## License

ISC — Kashf Team