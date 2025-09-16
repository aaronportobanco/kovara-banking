<p align="center">
  <img src="./public/logo/favicon-light.svg" alt="Kovara Banking Logo" width="120" />
</p>

# Kovara Banking

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Version](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-yellow)

---

## Overview
Kovara Banking is a modern online banking web app built with Next.js (App Router) and TypeScript. It lets users sign up, link bank accounts via Plaid (Sandbox), view balances and transactions, and simulate transfers with Dwolla (Sandbox). The UI is responsive and accessible using shadcn/ui and Tailwind CSS. Forms are validated with Zod and React Hook Form, and errors are monitored with Sentry.

- Authentication and user profiles with Appwrite
- Bank linking via Plaid (Sandbox)
- Simulated transfers via Dwolla (Sandbox)
- Bank, account, and transaction views
- Modern, responsive UI (Tailwind + shadcn/ui)
- Strong validation (Zod + React Hook Form)
- Observability (Sentry)

### Tech stack
- Language: TypeScript
- Framework: Next.js 15 (App Router) + React 19
- UI: Tailwind CSS, shadcn/ui, Radix UI
- Backend services: Appwrite (auth + DB), Plaid, Dwolla
- Monitoring: Sentry
- Tooling: ESLint, Prettier, Turbopack (dev)
- Package manager: npm (package-lock.json present)

---

## Requirements
- Node.js 18.18+ (recommended by Next.js 15)
- npm 9+ (npm 10+ recommended)
- Accounts/keys for:
  - Appwrite project (endpoint, project ID, API key, DB and collection IDs)
  - Plaid (client ID and secret; Sandbox recommended for local dev)
  - Dwolla (key/secret; DWOLLA_ENV=sandbox for local dev)

---

## Getting started

```bash
# 1) Clone and install
git clone https://github.com/aaronportobanco/kovara-banking.git
cd kovara-banking
npm install

# 2) Create your environment file
cp .env.local .env.local.backup  # keep your secrets safe; do NOT commit .env.local
# Then edit .env.local and fill values (see template below)

# 3) Run the dev server
npm run dev
# Visit http://localhost:3000
```

### Environment variables (.env.local)
These are read by the app. Never commit real secrets. Values below are placeholders.

```env
# Appwrite (public and server)
NEXT_PUBLIC_APPWRITE_ENDPOINT=<https://cloud.appwrite.io/v1>
NEXT_PUBLIC_APPWRITE_PROJECT=<your_appwrite_project_id>
NEXT_APPWRITE_KEY=<your_appwrite_api_key>   # server-side use

# Appwrite Database/Collections (server)
APPWRITE_DATABASE_ID=<db_id>
APPWRITE_USER_COLLECTION_ID=<collection_id_users>
APPWRITE_BANK_COLLECTION_ID=<collection_id_banks>
APPWRITE_TRANSACTION_COLLECTION_ID=<collection_id_transactions>

# Plaid (Sandbox recommended for local dev)
PLAID_CLIENT_ID=<your_plaid_client_id>
PLAID_SECRET=<your_plaid_secret>

# Dwolla
DWOLLA_ENV=sandbox  # or production
DWOLLA_KEY=<your_dwolla_key>
DWOLLA_SECRET=<your_dwolla_secret>
```

Notes:
- Sentry is configured via code (sentry.server.config.ts / sentry.edge.config.ts). Consider moving DSN to an env var in production. TODO
- An example .env file is not provided to avoid leaking secrets. Use the template above.

---

## How to run
- Development: `npm run dev` (Next.js with Turbopack)
- Production build: `npm run build` then `npm start`

### npm scripts
- `dev`: Start the Next.js dev server (Turbopack)
- `build`: Production build
- `start`: Start production server
- `lint`: Run ESLint (Next.js config)
- `lint:fix`: Run ESLint with --fix
- `format`: Prettier write
- `format:check`: Prettier check

---

## Entry points and routes
- App Router root layout: `src/app/layout.tsx`
- Home dashboard: `src/app/(root)/page.tsx`
- Auth pages:
  - `src/app/(auth)/sign-in/page.tsx`
  - `src/app/(auth)/sign-up/page.tsx`
  - `src/app/(auth)/plaid-link/page.tsx`
- Banking flows:
  - `src/app/(root)/payment-transfer/page.tsx`
  - `src/app/(root)/my-banks/page.tsx`
  - `src/app/(root)/transactions-history/page.tsx`
- Sentry/observability bootstrap: `src/instrumentation.ts`

Server-side actions and integrations live under `src/services`:
- `src/services/server/appwrite.ts` (Appwrite clients)
- `src/services/server/plaid.ts` (Plaid client)
- `src/services/actions/*.ts` (user, bank, transactions, dwolla)

---

## Project structure (high level)
```
.
├─ LICENSE
├─ README.md
├─ components.json                 # shadcn/ui config
├─ next.config.ts                  # Next.js + Sentry plugin
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
├─ eslint.config.mjs
├─ public/                         # static assets (logos, etc.)
├─ src/
│  ├─ app/
│  │  ├─ (auth)/sign-in/page.tsx
│  │  ├─ (auth)/sign-up/page.tsx
│  │  ├─ (auth)/plaid-link/page.tsx
│  │  ├─ (root)/page.tsx
│  │  ├─ (root)/payment-transfer/page.tsx
│  │  ├─ (root)/my-banks/page.tsx
│  │  ├─ (root)/transactions-history/page.tsx
│  │  ├─ components/ ...
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ services/
│  │  ├─ server/ (appwrite, plaid)
│  │  └─ actions/ (user, bank, transactions, dwolla)
│  └─ types/ ...
└─ ...
```

---

## Testing
No test framework is configured in this repository (no Jest/Vitest/Playwright dependencies found).

- TODO: Add unit tests (e.g., Vitest + React Testing Library)
- TODO: Add E2E tests (e.g., Playwright) for critical user flows

To run tests (future):
- TODO: Add `npm test` script once a test framework is added

---

## Configuration notes
- Tailwind/shadcn: see `tailwind.config.ts`, `src/app/globals.css`, and `components.json`.
- ESLint/Prettier: run `npm run lint` and `npm run format` before PRs.
- Sentry: manual setup is enabled via `withSentryConfig` in `next.config.ts` and initialization files in the repo. Review sampling before production.

---

## Contributing
Contributions are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feat/your-change`)
3. Make changes following the coding standards (ESLint, Prettier)
4. Open a Pull Request with a clear description

### Coding standards
- Use TypeScript and Next.js conventions
- Run `npm run lint` and `npm run format` before submitting PRs

---

## Roadmap
- [x] Auth & registration
- [x] Bank linking (Sandbox)
- [x] Account and transaction views
- [ ] Real transfers (Dwolla production)
- [ ] Additional bank integrations
- [ ] Security & audit improvements
- [ ] Internationalization (i18n)

---

## License
This project is licensed under the [MIT License](./LICENSE).

---

## Contact
| Maintainer | Email | GitHub |
| ---------- | ------------------------- | ------------------------------------------------------ |
| Aaron Portobanco | aaronportobanco@gmail.com | [@aaronportobanco](https://github.com/aaronportobanco) |

Note: Banking services run in Sandbox mode for development and are not intended for real users or real money movement.
