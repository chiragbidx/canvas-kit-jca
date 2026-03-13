# FILES.md — Structural & Architectural Index (Next.js App Router Starter)

AI-facing index of the repository as it exists today. Drizzle ORM (PostgreSQL) is wired with a working credentials auth flow at `/auth` (server actions + users table). If something is unclear: **STOP AND ASK**.

---

## 1. High-Level Overview
- Purpose: minimal App Router scaffold for future SaaS UI, with Drizzle + Postgres base schema and modular section-based landing architecture.
- Style: file-system routing, server-preferred components, small isolated client islands.
- Tech: Next.js 16, React 19, TypeScript 5, Tailwind-ready PostCSS, ESLint 9.
- Present: Drizzle schema + initial migration for `users`; `/auth` route with sign-in/sign-up server actions; reusable UI primitives; centralized theme system.
- Not present: session middleware/guards, API routes, queues, tests.

## 2. Application Entry Points
- `app/layout.tsx`: Root layout; mounts `ThemeProvider`, global CSS, and `ErrorReporter`.
- `app/page.tsx`: Public landing page (server component) that composes `Layout*Section` components.
- `app/auth/page.tsx`: Split auth UI (left visual panel + right single auth card with sign-in/sign-up toggle).
- `app/auth/actions.ts`: Server actions that read/write users in Postgres through Drizzle.
- `app/dashboard/page.tsx`: Authenticated dashboard overview page.
- `app/dashboard/actions.tsx`: Shared dashboard server actions (currently sign-out).
- `app/dashboard/settings/page.tsx`: Account settings UI route.
- `app/dashboard/settings/actions.tsx`: Settings-only server actions (email/password updates).
- `app/globals.css`: Global styles; imports Tailwind and design tokens.
- `app/shadcn.css`: shadcn/radix utility classes + keyframes.
- `next.config.ts`: Next config.
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss`.
- No `middleware.ts`; requests go straight to App Router.

## 3. Modules / Feature Areas
- `app/`: UI shell and routing.
- `components/`: Shared UI and landing sections.
  - `components/home/`: active modular sections (`Layout*Section.tsx`).
  - `components/layout/`: navbar.
  - `components/theme/`: shared `theme-provider` and `theme-toggle`.
  - client-only helpers: `HeroOrbs.tsx`, `AgentActionPanel.tsx` (stub, unused by default), `ErrorReporter.tsx`.
- `content/`: typed landing content source (`home.ts`) for data-driven copy/config.
- `public/`: static assets (hero/team/images/icons).
- `lib/db/`: Drizzle schema and DB client.
- `drizzle/`: SQL migrations + meta journal.
- Config/tooling: `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`, `drizzle.config.ts`, `railpack.json`, `railway.json`.
- No route groups yet; create when needed.

## 4. Routes (Controllers)
- `/` → `app/page.tsx`
  - Purpose: section-based landing page composed from `components/home/Layout*Section.tsx` modules.
  - Section IDs currently include: `layout-hero`, `layout-sponsors`, `layout-benefits`, `layout-features`, `layout-services`, `layout-testimonials`, `layout-team`, `layout-pricing`, `layout-contact`, `layout-faq`, `layout-footer`.
  - Visibility controls: `ONLY_SECTIONS` (whitelist) and `HIDE_SECTIONS` (blacklist).
  - Layout: responsive, centered content up to ~1600px; client interactivity kept in small islands.
  - To add a custom section: create `components/home/<NewLayoutSection>.tsx` and register it in the `sections` array in `app/page.tsx` with a stable ID.
  - DTOs/validation/guards: none; render-focused route.
- `/auth` → `app/auth/page.tsx`
  - Purpose: credentials entry (one visible form at a time, toggled sign-in/sign-up).
  - Backend wiring: form `action` targets server actions in `app/auth/actions.ts`.
  - Data contract:
    - Sign up inserts into `users` with `password_hash` from bcrypt.
    - Sign in verifies `email` + bcrypt password compare.
  - Mode deep links: `/auth#signin`, `/auth#signup`.
- `/dashboard` → `app/dashboard/page.tsx`
  - Purpose: authenticated overview shell with account summary and sign-out action.
  - Backend wiring: sign-out form uses server action from `app/dashboard/actions.tsx`.
- `/dashboard/settings` → `app/dashboard/settings/page.tsx`
  - Purpose: authenticated account settings for email/password updates.
  - Backend wiring: forms target server actions in `app/dashboard/settings/actions.tsx`.
  - Data contract:
    - Update email verifies current password, checks uniqueness, updates `users.email`, and refreshes auth session email.
    - Update password verifies current password and writes new bcrypt hash to `users.password_hash`.

## 5. Services & Providers
- `ThemeProvider`: centralized in `components/theme/theme-provider.tsx`, mounted at root layout.
- OpenAI helper: `lib/openai.ts` (server-side helper layer).
- No background service layer or worker runtime in-app.

## 6. Data Layer
- ORM/DB: Drizzle ORM + PostgreSQL.
- Schema: `lib/db/schema.ts`.
- Client: `lib/db/client.ts`.
- Migrations: `drizzle/*.sql` + `drizzle/meta/_journal.json`.
- Auth persistence: `users` table is the source of truth for credentials flow.
- Rule: keep migrations and journal in sync; `scripts/db-init.js` validates journal integrity before migrate.

## 7. DTOs, Schemas & Validation
- No formal DTO/validation layer yet for API routes (APIs not added).
- UI form primitives exist in `components/ui/form.tsx` and related controls.
- When adding APIs/forms, keep validators with the feature or under `lib/validation/` and document contracts.

## 8. Cross-Cutting Concerns
- Auth, middleware guards, tracing, and centralized logging are not implemented.
- Credentials auth form + DB actions are implemented; session cookies/route protection are not implemented yet.
- Error forwarding exists via `scripts/error-reporter.ts` + `components/ErrorReporter.tsx`.
- Theme switching is cross-cutting and centralized in `components/theme/*`.

## 9. Configuration & Environment
- `env.example` currently defines: `OPENAI_API_KEY`, optional `OPENAI_MODEL`, `DATABASE_URL`, `DATABASE_SSL`, `BASE_URL`, and optional `NEXTAUTH_SECRET` (currently set as `${AUTH_SECRET}`).
- Secrets: keep in `.env.local` (gitignored); never commit secrets.
- Config files in repo: `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `drizzle.config.ts`, `railpack.json`, `railway.json`.
- Runtime/deployment contract: Railpack by Railway for development workflow and Vercel for production.

## 10. Async & Background Processing
- Queues/workers/schedulers: none.
- Operational scripts in `scripts/`:
  - `dev-supervisor.js`: supervised dev runtime (Next + git poll integration).
  - `git-poll.js`: optional origin polling for supervised environments.
  - `db-init.js`: migration bootstrap with Drizzle journal guard.

## 11. Testing Structure
- No tests currently.
- Suggested layout when added: unit (`__tests__/` or co-located), e2e (`e2e/` via Playwright), shared fixtures in `tests/utils/`.

## 12. File & Directory Index
```text
.gitignore                 # Git ignores
README.md                  # Operational guide
FILES.md                   # Structural index (this file)
RULES.md                   # Change boundaries
app/
  favicon.ico              # Favicon
  auth/
    actions.ts             # Server actions for sign in / sign up
    page.tsx               # Auth UI route
  dashboard/
    actions.tsx            # Shared dashboard actions (sign out)
    page.tsx               # Dashboard overview
    settings/
      actions.tsx          # Settings actions (email/password updates)
      page.tsx             # Account settings route
  globals.css              # Global styles + tokens
  layout.tsx               # Root layout (ThemeProvider + ErrorReporter)
  page.tsx                 # Public landing page (composes Layout* sections)
  shadcn.css               # Utility classes/keyframes
content/
  home.ts                  # Typed landing content + defaults
public/
  demo-img.jpg             # Demo image
  hero-image-light.jpeg    # Hero asset
  hero-image-dark.jpeg     # Hero asset
  team1.jpg                # Team asset
  team2.jpg                # Team asset
  team3.jpg                # Team asset
  file.svg                 # Sample asset
  globe.svg                # Sample asset
  next.svg                 # Next.js logo
  vercel.svg               # Vercel logo
  window.svg               # Sample asset
scripts/
  db-init.js               # Validates Drizzle journal + runs migrate
  dev-supervisor.js        # Supervisor for Next dev + git poller
  git-poll.js              # Polls git origin for updates
  error-reporter.ts        # Client-safe error forwarder
components/
  home/
    LayoutHeroSection.tsx
    LayoutSponsorsSection.tsx
    LayoutBenefitsSection.tsx
    LayoutFeatureGridSection.tsx
    LayoutServicesSection.tsx
    LayoutTestimonialSection.tsx
    LayoutTeamSection.tsx
    LayoutPricingSection.tsx
    LayoutContactSection.tsx
    LayoutFaqSection.tsx
    LayoutFooterSection.tsx
  layout/
    navbar.tsx             # Responsive navbar
  theme/
    theme-provider.tsx     # Shared ThemeProvider wrapper
    theme-toggle.tsx       # Shared theme toggle
  illustrations/
    HeroStackIllustration.tsx
    GlobeBadgeIllustration.tsx
  icons/
    discord-icon.tsx
    github-icon.tsx
    linkedin-icon.tsx
    x-icon.tsx
  ui/
    accordion.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    carousel.tsx
    collapsible.tsx
    form.tsx
    icon.tsx
    input.tsx
    label.tsx
    navigation-menu.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    textarea.tsx
  HeroOrbs.tsx             # Client parallax helper
  AgentActionPanel.tsx     # Client note stub (not rendered by default)
  ErrorReporter.tsx        # Mounts error reporter on client
lib/
  openai.ts                # OpenAI helper
  utils.ts                 # Shared utility helpers
  db/
    schema.ts              # Drizzle schema
    client.ts              # Drizzle + pg pool client
drizzle/
  0000_init.sql            # Initial migration
  meta/_journal.json       # Migration journal
drizzle.config.ts          # Drizzle CLI config
eslint.config.mjs          # ESLint config
next.config.ts             # Next.js config
postcss.config.mjs         # PostCSS config (Tailwind-ready)
tsconfig.json              # TypeScript config
package.json               # Scripts and dependencies
package-lock.json          # Locked deps
docker-compose.yml         # Legacy/local compose artifact (not active deployment path)
old-dockerfile.txt         # Legacy Docker reference (inactive)
railpack.json              # Railpack config
railway.json               # Railway start/build config
.git/                      # Git metadata
```

## 13. Safe Modification Guidance
- New public pages: add under `app/` with route folders (for example `app/about/page.tsx`).
- Future dashboard/auth: create route groups (`app/(dashboard)/...`, `app/(login)/...`) when introduced; wire shared layouts there.
- Landing sections: add under `components/home/` and register in `app/page.tsx` using stable section IDs.
- Data/API: place server code in `lib/` or `app/api/.../route.ts`; validate inputs at the edge; keep server-only dependencies out of client components.
- Keep theme logic centralized in `components/theme/*`.
- Avoid expanding global CSS unnecessarily; prefer scoped/component styles.
- Keep changes minimal; update `README.md` and `RULES.md` if scope (auth, DB, billing, deployment architecture) changes.

---

If structure or intent is uncertain, **STOP AND ASK** before modifying.
