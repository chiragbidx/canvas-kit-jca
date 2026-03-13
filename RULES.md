# RULES.md — Change Boundaries & Placement (Boilerplate)

`/auth` credentials flow and `/dashboard` + `/dashboard/settings` routes are wired. Session middleware/guards are still not wired yet. These guardrails keep changes predictable. Update this file first if scope expands.

## 1) Routing & Placement
- Public/marketing pages live directly under `app/` (e.g., `app/page.tsx`, `app/about/page.tsx`).
- Current landing sections live in `components/home/Layout*Section.tsx` and are composed in `app/page.tsx`.
- Keep section visibility controls in `app/page.tsx` via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
- Current authenticated pages live at `app/dashboard/page.tsx` and `app/dashboard/settings/page.tsx`.
- Shared dashboard actions belong in `app/dashboard/actions.tsx` (for example `signOutAction`).
- Settings-only mutations belong in `app/dashboard/settings/actions.tsx` and should stay co-located with `app/dashboard/settings/page.tsx`.
- Existing auth flow is in `app/auth/` with co-located server actions (`app/auth/actions.ts`).
- Additional auth flows should stay co-located with their route segment unless explicitly migrating to grouped routes.
- New feature areas should be added under `app/dashboard/<feature>/` unless and until route groups are intentionally introduced.
- If/when a shared dashboard layout is introduced, consolidate repeated sidebar/nav definitions into `app/dashboard/layout.tsx` in the same change.

## 2) Dashboard Page Pattern
- Use existing dashboard pages (`app/dashboard/page.tsx` and `app/dashboard/settings/page.tsx`) as the reference for spacing, heading, card wrappers, and form placement.
- Keep dashboard pages as Server Components; add `'use client'` only when client hooks are needed.
- Do not import Client Components (or hooks like `useState`, `useEffect`, `useActionState`) into Server Components. If a file needs these, add `"use client"` at the top and keep server-only code out of it. Prefer small client islands (e.g., `components/HeroOrbs.tsx` for hero parallax, `components/AgentActionPanel.tsx` as a stub) that are imported into server pages.
- Sidebar/nav markup is currently duplicated between dashboard pages. Do not introduce a third variant; if changed, refactor both pages together or extract a shared layout/component.

## 3) Backend & Data
- Drizzle + Postgres are configured. Edit `lib/db/schema.ts`; generate migrations via `npm run db:generate` and apply via `npm run db:migrate`; keep migration SQL committed.
- Drizzle only applies migrations listed in `drizzle/meta/_journal.json`. Whenever you add a `.sql` migration, commit the updated journal as well or the migration will be skipped. The init script/CI will fail if it detects unjournaled migrations.
- Stripe/billing (if introduced) goes in `lib/payments/*`; update server actions and route handlers together.
- Avoid time- or randomness-dependent values inside React render (`new Date()`, `Date.now()`, `Math.random()`). Precompute in server components, shared constants, or `useEffect` for client-only needs.

## 4) Auth & Security
- Credentials auth is implemented at `app/auth/page.tsx` and `app/auth/actions.ts` using Drizzle + bcrypt.
- Session cookies, `middleware.ts` guards, and NextAuth route wiring are not implemented yet. Any addition of middleware/session handling requires explicit approval.
- Guard mutations with validated wrappers (`validatedAction*`, `withTeam`) when available; do not bypass them.

## 5) Infrastructure & Scripts
- Treat `scripts/` as infrastructure; adjust only with intent.
- Current script contracts:
  - `scripts/db-init.js` validates Drizzle journal integrity and runs migrations.
  - `scripts/dev-supervisor.js` supervises dev runtime and can launch git polling.
  - `scripts/git-poll.js` polls origin for branch updates in supervised environments.
- Respect existing path structure; avoid moving files across route groups without agreement.
- Runtime UI may import only `scripts/error-reporter.ts` (via `components/ErrorReporter.tsx`); keep other scripts server-only.
- Deployment/runtime contract: Railpack by Railway for development workflow and Vercel for production. Do not introduce Docker as an active deployment path without explicit approval.

## 6) Coordination
- Keep shared UI primitives backward compatible or update all consumers.
- For cross-cutting changes, document affected routes/actions in PR/commit notes.
- Avoid creating new `*.md` explainer files unless explicitly requested; prefer updating existing docs.
- Never use double quotes (`"`) in any BuildArtifact title.

# Next.js Server / Client Component Rules (App Router)

## Server vs Client Components
1. Default: files under `app/` are Server Components.
2. Use `"use client"` only when the file needs hooks (`useState`, `useEffect`, etc.), browser APIs (`window`, `document`, `localStorage`), event handlers, or other interactive UI.
3. Keep Server Components for data fetching, API calls, DB access, env vars, and static rendering.

## Server Actions
- Never place `"use server"` inside a Client Component.
- Server actions may be placed under `app/actions/` or co-located inside the route segment (current auth pattern: `app/auth/actions.ts`); each action file must start with `"use server"`.
- Return only serializable data (strings, numbers, booleans, objects, arrays); never return JSX.

**Pattern**
```
app/actions/generateDocs.ts
"use server";
export async function generateDocs(formData: FormData) { /* server logic */ }

components/generate-form.tsx
"use client";
import { generateDocs } from "@/app/actions/generateDocs";
export default function GenerateForm() {
  return <form action={generateDocs}>{/* ... */}</form>;
}

app/page.tsx
import GenerateForm from "@/components/generate-form";
export default function Page() { return <GenerateForm />; }
```

## Hydration Safety
- Do not call `new Date()`, `Date.now()`, or `Math.random()` directly in render. Precompute on the server, inside `useEffect`, or as constants.

## Environment Variables
- Access `process.env` only in Server Components or Server Actions. Never expose secrets in Client Components.

## File Structure (target)
```
app/
  actions/
  auth/
  ai/
  data/
  shadcn.css
components/
  home/
  layout/
  theme/
  forms/
  ui/
lib/
  openai.ts
  db/
    client.ts
    schema.ts
```

## Quick checks before coding
1) Does it need hooks? → mark `"use client"`.
2) Does it touch env vars/APIs/DB? → keep on server.
3) Creating a server action? → place in `app/actions/`, start with `"use server"`.

Never mix client and server logic in the same file.
