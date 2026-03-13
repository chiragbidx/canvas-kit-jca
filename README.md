# Next.js App Router Boilerplate — Operational Guide

This repository is a minimal Next.js 16 (App Router) starter with React 19, TypeScript, Tailwind-ready PostCSS, and **Drizzle ORM + PostgreSQL ready**. It now includes a working email/password auth page backed by Drizzle + Postgres. Use this document as the single operational reference. If anything is unclear: **STOP AND ASK** before proceeding.

---

## 1. Current Scope
- Purpose: baseline UI scaffold with Postgres-backed Drizzle schema and a DB-backed auth entry flow.
- Data: Drizzle configured for PostgreSQL; base `users` model (email, first/last name, password hash, emailVerified, timestamps) with migration in `drizzle/`.
- Auth: `/auth` route is implemented with Sign in / Sign up forms and server actions in `app/auth/actions.ts`.
- Current auth contract: credentials are validated against `users` table (`bcryptjs` for password hashing/compare).
- Current auth limitation: no session/cookie middleware or protected-route guard is wired yet.
- Dashboard: authenticated routes are implemented at `/dashboard` and `/dashboard/settings`.
- Dashboard actions:
  - `app/dashboard/actions.tsx` contains shared actions (currently `signOutAction`).
  - `app/dashboard/settings/actions.tsx` contains settings-specific actions (`updateEmailAction`, `updatePasswordAction`).
- AI integration default: OpenAI with model `gpt-4o-mini` (override via `OPENAI_MODEL`).
- Env vars: `env.example` lists `OPENAI_API_KEY`, `OPENAI_MODEL`, `DATABASE_URL`, `DATABASE_SSL`, `NEXTAUTH_SECRET` (reuse `AUTH_SECRET`), and `BASE_URL`.
- Current landing: section-composed layout with centralized navbar and modular `Layout*Section` components.
  - Active sections: `layout-hero`, `layout-sponsors`, `layout-benefits`, `layout-features`, `layout-services`, `layout-testimonials`, `layout-team`, `layout-pricing`, `layout-contact`, `layout-faq`, `layout-footer`.
  - Runtime visibility control is enabled via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
  - Layout is responsive with wrapping controls and an app max width around `1600px`.
- Theme system is centralized under `components/theme` and mounted in `app/layout.tsx`.
- Client interactivity is isolated to small islands (`HeroOrbs`, `ThemeToggle`, etc.); `AgentActionPanel` exists as a client stub and is not rendered by default on landing.

## First Request Rule
- Ship the first feature directly in `app/page.tsx` before adding new routes or structure.
- Build the requested feature end to end with production-ready integration (AI/dataflow/API/UX). Keep the client island (e.g., `ContractAIDemo` with `"use client"`) handling interactivity while the rest of the landing stays server-rendered and performant.
- Once the production-grade feature works, rebrand the entire page (header, hero, body, footer) to match the feature; polish visuals after functionality is solid.

## 2. Technology Stack
- Next.js 16 App Router (server-first, file-based routing).
- React 19, TypeScript 5 (strict).
- Styling: Tailwind via `@tailwindcss/postcss` pipeline; global CSS in `app/globals.css` with additional utilities in `app/shadcn.css`.
- UI kit: shadcn/ui (Radix + Nova preset). Components live under `components/ui` and rely on `components.json` aliases.
- Icons: `lucide-react` + custom icon components under `components/icons`.
- Data: Drizzle ORM + PostgreSQL (schema + migration present).
- Auth deps present: `bcryptjs` for credentials flow; `next-auth` dependency remains available for future session-based expansion.
- Theming: `next-themes` with shared `ThemeProvider` + `ThemeToggle`.
- Tooling: ESLint 9 (`eslint-config-next`), PostCSS.

## 3. Project Structure
```text
app/
  layout.tsx                # Root layout, ThemeProvider mount, ErrorReporter mount
  page.tsx                  # Public landing page that composes Layout* sections
  auth/
    page.tsx                # Split-screen auth UI (single visible form: sign in/sign up toggle)
    actions.ts              # Server actions for sign-in/sign-up (Drizzle + bcrypt)
  dashboard/
    page.tsx                # Dashboard overview route
    actions.tsx             # Shared dashboard actions (sign out)
    settings/
      page.tsx              # Account settings route
      actions.tsx           # Settings account actions (email/password)
  globals.css               # Global styles and tokens
  shadcn.css                # shadcn/radix utility styles and keyframes
content/
  home.ts                   # Typed landing content (`HomeContent`) and default values
public/                     # Static assets (hero images, team images, icons)
scripts/                    # Ops helpers
  dev-supervisor.js         # Starts Next dev server + git poller
  db-init.js                # Validates Drizzle journal, then runs DB migrations
  git-poll.js               # Polls git origin for branch updates
  error-reporter.ts         # Client-safe error forwarder (imported by components/ErrorReporter)
components/
  home/                     # Modular landing sections (Layout*Section.tsx)
  layout/
    navbar.tsx              # Responsive navbar used by landing
  theme/
    theme-provider.tsx      # Shared theme provider wrapper
    theme-toggle.tsx        # Shared theme toggle
  illustrations/            # Inline SVG illustrations
  icons/                    # Social/brand icons
  ui/                       # shadcn/Radix UI primitives
  HeroOrbs.tsx              # Client parallax orb interaction
  AgentActionPanel.tsx      # Client-only example island (not rendered by default)
  ErrorReporter.tsx         # Client error forwarder mount
Dockerfile                  # Not present currently (legacy copy in old-dockerfile.txt)
docker-compose.yml          # Local compose config (if used)
drizzle.config.ts           # Drizzle CLI config (Postgres)
lib/db/schema.ts            # Drizzle schema (users)
lib/db/client.ts            # Drizzle + pg pool client
drizzle/                    # SQL migrations + meta journal
eslint.config.mjs           # ESLint configuration
next.config.ts              # Next.js config
postcss.config.mjs          # PostCSS plugins (Tailwind-ready)
tsconfig.json               # TypeScript config
package.json                # Scripts and dependencies
package-lock.json           # Locked dependency tree
FILES.md                    # Structural index
RULES.md                    # Change boundaries (boilerplate)
```

## 4. Install & Run
```bash
npm install
npm run dev   # starts Next.js on localhost:3000
npm run lint  # ESLint
npm run build # production build
```

Dev server / supervisor notes
- `npm run dev` runs Next.js directly.
- `scripts/dev-supervisor.js` is available when you need a supervised process that starts both Next dev and `git-poll`.

Drizzle / DB (Postgres):
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db" npm run db:migrate
# To regenerate SQL after schema changes
DATABASE_URL="postgresql://user:pass@host:5432/db" npm run db:generate
```
- Important: Drizzle only applies migrations listed in `drizzle/meta/_journal.json`. Always commit both generated SQL files and the updated journal. `scripts/db-init.js` fails early if a `.sql` migration is not present in the journal.

## 5. Routing & Components
- Public landing page: `app/page.tsx`.
- Auth page: `app/auth/page.tsx` (`/auth`, with hash-aware mode support: `#signin`, `#signup`).
- Dashboard overview page: `app/dashboard/page.tsx` (`/dashboard`).
- Dashboard settings page: `app/dashboard/settings/page.tsx` (`/dashboard/settings`).
- No route groups exist yet.
- Keep components server-side by default; add `"use client"` only when required by client hooks/state.
- Landing composition currently imports section modules from `components/home/Layout*Section.tsx` and renders them through an ID-based section map.
- Section visibility workflow:
  1. Add or update a presentational section in `components/home/<LayoutName>Section.tsx`.
  2. Register/compose it in `app/page.tsx` with a stable section ID.
  3. Optionally control visibility via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
- Navbar remains separate and always mounted from `components/layout/navbar.tsx`.

## 6. Styling & UI Components (short)
- Tailwind via `app/globals.css`; no standalone `tailwind.config` required for current setup.
- Additional utility classes and keyframes live in `app/shadcn.css` and local page-level styles where needed.
- shadcn/ui primitives are pre-bundled in `components/ui/` (accordion, avatar, badge, button, card, carousel, collapsible, form, input, label, navigation-menu, scroll-area, select, separator, sheet, textarea).
- Icons: `lucide-react` plus local icon components in `components/icons`.
- Keep global CSS light; prefer component-scoped styling and reusable tokens.

## 7. Environment & Secrets
- Required for AI: set `OPENAI_API_KEY` in environment.
- Optional model override: `OPENAI_MODEL`.
- Database: set `DATABASE_URL` (Postgres) and `DATABASE_SSL` as needed by your provider.
- Auth (current credentials flow): requires `DATABASE_URL`.
- Optional/future auth (NextAuth-based sessions): `NEXTAUTH_SECRET` can still be set for future route wiring.
- Canonical app URL: set `BASE_URL`.
- Add additional env vars only when explicitly requested; never commit secrets.

## 8. Data & Backend
- Drizzle + Postgres are configured with a base `users` table (email, first/last name, password hash, emailVerified, timestamps).
- Migrations live under `drizzle/` and are run via `npm run db:migrate`.
- DB init automation: `scripts/db-init.js` validates migration journal integrity before migration execution.
- Auth server actions live in `app/auth/actions.ts`:
  - `signUpWithPassword`: validates input, checks existing user, hashes password, inserts row.
  - `signInWithPassword`: validates input, fetches by email, compares password hash.
- When adding routes or server actions, place data helpers under `lib/` and document contracts in `FILES.md` and `RULES.md`.

## 9. Server vs Client Components (Guardrails)
- Default to Server Components for files inside `app/`. They may fetch data, access databases, and read env vars, but must not use React hooks or browser APIs.
- Client-only features (`useState`/`useEffect`, handlers like `onClick`/`onSubmit`, browser APIs like `window`/`document`/`localStorage`) must only exist in files that begin with `"use client"`.
- Keep Client Components small and isolated. Example: theme toggle or interaction widgets should be small client components imported into server layouts/pages.
- Import rules: Server Components can import Client Components; Client Components must not import Server Components.
- Mutations/actions: use Server Actions or API routes; trigger them from a Client Component via forms, handlers, or helper calls.
- Security: never expose secrets or server-only logic inside Client Components.
- Quick check: if a file has hooks, event handlers, or browser APIs, add `"use client"` at the top or move that logic into a dedicated Client Component.

## 10. Testing (Not Present)
- No tests are included. If adding tests, prefer:
  - Unit: `__tests__/` or co-located `*.test.tsx`
  - E2E: Playwright under `e2e/`
  - Provide lightweight stubs/utilities

## 11. Change Guidelines
- Default to minimal diffs; avoid rewrites.
- Do not move files across route groups without coordination.
- Avoid new Markdown explainer files unless explicitly requested; update existing docs instead.
- Do not introduce time- or randomness-dependent values directly in React render (`Date.now()`, `Math.random()`). Precompute in server components, constants, or `useEffect` if client-only.
- If adding auth, billing, or DB changes: implement the full contract in one coherent change.
- Only `scripts/error-reporter.ts` may be imported into runtime UI (`components/ErrorReporter.tsx`); keep other scripts server-only.

## 12. Hard Stops
- Unclear requirements or missing context.
- Requests to alter session/cookie behavior without explicit approval.
- Hand-editing generated migration SQL without explicit intent (Drizzle migrations are committed; edit cautiously).
- Storing or logging secrets in code or assets.

## 13. Deployment
- Development target: Railpack by Railway (dev server/runtime workflow).
- Production target: Vercel for Next.js hosting.
- Docker is not part of the active deployment workflow for this repository.
- If a future request reintroduces container deployment, treat it as an explicit architecture change and document runtime assumptions before implementation.

## 14. Cookie Configuration Rules (Iframe Auth)
- When setting auth/session cookies (session helpers, middleware refresh/cleanup), set `SameSite: "none"`, `secure: true`, `httpOnly: true`, and `path: "/"` so they remain first-party inside iframes (e.g., Bubble embedding).
- Do not alter redirect/guard logic; middleware that deletes/refreshes tokens stays the same, only cookie metadata changes.
- If embedding in another repo/app: ensure iframe host and Next.js app share the same root domain (or use a parent-proxy domain) to keep cookies first-party.
- Avoid client-side cookie hacks; adjust only server-set cookie options.

---

Please operate cautiously, keep changes small, and align new features with the documented structure. When uncertain: **STOP AND ASK**.
