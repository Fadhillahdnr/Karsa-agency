# Karsa Agency — Website & CMS

**Creative & Digital Agency.** _Dari Karsa Menjadi Karya._

## 1. Overview

The official marketing site, headless CMS, admin panel, and lead-generation pipeline for Karsa Agency: a minimal, editorial Nuxt 4 site — Website · Design · Photography · Film — with a Karsa-mark 3D hero, a Karsa Method process narrative, honestly-labeled work/services/case studies, an insights blog, careers, legal pages, and a 5-step project-inquiry wizard (Zod validation → Turnstile → Supabase → Resend), all backed by a bilingual (EN/ID) database-driven CMS with role-gated admin access.

Built against `Karsa_Agency_Full_Website_CMS_Admin_AI_Agent_Master_Prompt_v2.1.md` — a 13-milestone rebrand + CMS/admin build-out (00-Audit through 12-Production Handover, see that document's §127 milestone plan). Originally scaffolded against an earlier `Karsa_Studio_Website_AI_Agent_Blueprint_v1.0.md` under the prior "Karsa Studio / digital product & software studio" positioning; the repositioning to "Karsa Agency" and the full CMS revamp are what this document now describes. Where business information doesn't exist yet (contact channels, some legal/registration details), the site hides those elements gracefully instead of fabricating them — see [§20 Known Limitations](#20-known-limitations).

## 2. Stack

- **Core:** Nuxt 4, Vue 3, TypeScript, pnpm
- **Styling:** Tailwind CSS v4, CSS custom-property design tokens (`app/assets/css/tokens.css`)
- **Theme:** `@nuxtjs/color-mode` — light/dark/system, `data-theme` attribute on `<html>` (see §17)
- **i18n:** `@nuxtjs/i18n` — English (default, unprefixed) / Indonesian (`/id/**`), see §16
- **Motion:** GSAP + ScrollTrigger, Lenis
- **3D:** TresJS (Three.js), procedural geometry (no GLB dependency)
- **Content (file-based):** Nuxt Content v3 (work case studies only — everything else moved to the database, see §9)
- **Content (database):** Supabase Postgres — services, packages, projects, portfolio evidence, articles/insights, company updates, careers, legal pages, FAQs, clients, testimonials, leads, site settings/navigation, page sections, media assets, audit log, redirects, admin profiles (16 migrations, see §11)
- **Rich text:** TipTap (admin editor) → server-side `sanitize-html` render (see §9)
- **Backend:** Nuxt Server API (Nitro), Zod, Supabase (Auth + Postgres + Storage), Cloudinary (media uploads), Resend (email), Cloudflare Turnstile (bot protection)
- **SEO:** `@nuxtjs/sitemap` (dynamic per-locale sources), `@nuxtjs/robots`, `nuxt-schema-org` (Organization/WebSite/Article/JobPosting/Question/Service/Breadcrumb)
- **Testing:** Vitest (unit), Playwright (e2e)
- **Deployment:** Vercel (primary), Nitro `vercel` preset

## 3. Prerequisites

- Node.js (version pinned in `.nvmrc`, and `engines.node: 22.x` in `package.json`)
- pnpm (`corepack enable` or `npm i -g pnpm`; `packageManager` pins `pnpm@11.9.0`)

## 4. Install

```bash
pnpm install
```

`better-sqlite3` (used by Nuxt Content's dev-time database) and `esbuild` require a native build step. If `pnpm install` reports ignored build scripts, approve them once:

```bash
pnpm approve-builds
```

## 5. Environment Variables

Copy `.env.example` to `.env` and fill in what's available:

```bash
cp .env.example .env
```

| Variable | Required for | Notes |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, hreflang, OG tags, schema.org | Defaults to `https://karsa-agency.vercel.app` if unset |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Bot verification widget | Widget is skipped entirely if unset (see §14) |
| `NUXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | `useAnalytics()` no-ops if unset |
| `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Admin login (Supabase Auth, client-side) | Safe to expose — anon key only authenticates against Auth + RLS-gated Storage policies |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | All CMS reads/writes, lead storage, admin RBAC | **Server-only.** Every public and admin API route needs this to return real data — without it, public pages render empty-state, admin routes 500 |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Admin media uploads (`/admin/media`, cover images/videos) | **Server-only.** Upload endpoint 500s if unset |
| `TURNSTILE_SECRET_KEY` | Server-side bot verification | Verification is skipped if unset |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `KARSA_INQUIRY_EMAIL` | Lead notification/confirmation emails | Emails are skipped if unset |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional env-var alternative to CLI args for `pnpm seed:admin` | Not read anywhere else at runtime |

The **public marketing pages** still render (with empty states, not crashes) if Supabase env vars are unset — every integration degrades gracefully rather than throwing. The **admin panel and full CMS content are not usable** without `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` — this is a hard requirement as of the Milestone 04+ database migration, unlike the original Milestone 00 blueprint where Supabase was fully optional. Server-only keys are never exposed to the client.

## 6. Development

```bash
pnpm dev
```

Runs on `http://localhost:3000` (or the next free port). If another dev server already holds the Nuxt dev lock (common when running `pnpm test:e2e` right after `pnpm dev`), either stop it or set `NUXT_IGNORE_LOCK=1`.

### Docker (alternative)

Run the dev server in a container with the source bind-mounted, so edits on your machine hot-reload inside the container exactly like local `pnpm dev`:

```bash
docker compose up --build
```

Then open `http://localhost:3000`. Stop with `docker compose down` (add `-v` to also drop the `node_modules` volume, e.g. after changing dependencies).

How it's wired (`Dockerfile` / `docker-compose.yml`):

- The image is Debian-based (`node:22-bookworm-slim`) with `python3`/`make`/`g++` installed, because `pnpm install` compiles a native module (`better-sqlite3`, used by Nuxt Content) via node-gyp.
- `docker-compose.yml` bind-mounts the whole project into `/app`, but shadows `/app/node_modules` with a separate anonymous volume — the image's `node_modules` contains Linux-native binaries, and letting the bind mount replace it with your host's (macOS/Windows) `node_modules` would break the container.
- `CHOKIDAR_USEPOLLING=true` is set for the container: Docker Desktop's bind mounts don't reliably forward native file-change events into Linux containers, so without polling, Vite's dev server never notices edits. This is gated behind an env var (see `nuxt.config.ts`) so native/local `pnpm dev` outside Docker keeps using fast native file watching instead.
- `.env` is loaded automatically if present (`cp .env.example .env` first) — see §5.
- Host/port are set via `HOST`/`PORT` env vars, not CLI flags — `pnpm dev -- --host 0.0.0.0` is fragile here: an extra `--` reaching Nuxt's CLI gets parsed as its positional `[DIR]` argument, which silently scaffolds a brand-new empty Nuxt project in a directory literally named `--host` and serves that instead. Worth knowing if you ever add CLI args to the container command.

## 7. Build

```bash
pnpm build
pnpm preview   # serve the production build locally
```

To verify a Vercel-targeting build locally (catches ESM/CJS dependency bugs a plain `pnpm build` can miss — see §15's caveat):

```bash
NITRO_PRESET=vercel pnpm build
```

## 8. Tests

```bash
pnpm lint          # ESLint
pnpm typecheck     # nuxt typecheck (vue-tsc)
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright e2e (spins up its own dev server on :4123)
```

All are green as of this handover — see [§10 Testing Executed](#10-testing-executed-and-results).

## 9. Content Management

Almost all content is database-backed and managed through `/admin` — no file edits or redeploys needed to publish. The one exception is **work case studies**, which still live in `content/work/*.md` (Nuxt Content, file-based).

### Publishing model

Most CMS tables (`services`, `packages`, `portfolio_evidence`, `articles`, `company_updates`, `careers`, `legal_pages`, `faqs`) share a `status` column — `draft` / `scheduled` / `published` / `archived` — plus a `published_at` timestamp; public API routes only return rows where `status = 'published' AND published_at <= now()`. The `projects` table predates this pattern and instead uses a simple `published` boolean (see §20 Known Limitations). Set status/publish state from the corresponding `/admin/<entity>` list or detail page.

### Adding a case study (file-based)

Create `content/work/<slug>.md`:

```yaml
---
title: "Project Name"
year: 2026
type: "Independent Project" # or "Internal Concept" | "Experimental Work"
category: "E-Commerce"
services: [UI/UX Design, Web Development]
description: "One-sentence summary."
cover: "/images/work/<slug>/cover.webp"
featured: true # shows on homepage Selected Work (max 3)
order: 2
challenge: "..."
approach: "..."
outcome: "..."
---

## Overview
...
```

Only add real, honestly-labeled projects — do not invent clients, metrics, or testimonials (see the blueprint's anti-fabrication rules, carried through in `content/work/aanaya.md` as the working example).

### Everything else (database-backed, via `/admin`)

| Entity | Admin route | Migration |
|---|---|---|
| Projects | `/admin/projects` | `0002_create_projects.sql`, `0004_add_project_links.sql` |
| Services & FAQs per service | `/admin/services` | `0008_create_services.sql` |
| Packages | `/admin/packages` | `0009_create_packages.sql` |
| Clients & logos | `/admin/clients` | `0007_create_clients_testimonials.sql` |
| Testimonials | `/admin/testimonials` | `0007_create_clients_testimonials.sql` |
| Portfolio evidence (design/photography/videography) | `/admin/portfolio/[discipline]` | `0013_create_portfolio_evidence.sql` |
| Insights articles | `/admin/articles` | `0014_create_insights_updates_faq.sql` |
| Company updates | `/admin/updates` | `0014_create_insights_updates_faq.sql` |
| Site-wide FAQs | `/admin/faqs` | `0014_create_insights_updates_faq.sql` |
| Careers | `/admin/careers` | `0015_create_careers_legal_pages.sql` |
| Legal pages | `/admin/legal` | `0015_create_careers_legal_pages.sql` |
| Media library (Cloudinary-backed) | `/admin/media` | `0006_create_media_assets.sql` |
| Homepage sections | `/admin/content/home` | `0010_create_pages_sections.sql` |
| Leads (5-step inquiry CRM) | `/admin/leads` | `0001_create_leads.sql`, `0016_lead_crm_expansion.sql` |

Rich text fields use a TipTap editor in the admin UI; content is sanitized server-side (`server/utils/render-rich-text.ts`, via `sanitize-html`) before being persisted/rendered — never trust the client-submitted HTML directly.

Bilingual entities (services, packages, articles, careers, legal pages, etc.) follow a base + translation table pattern (e.g. `services` + `service_translations`), so each row of translatable copy exists once per locale while non-translatable fields (slugs, media, ordering) live on the base row.

### One-time setup (Supabase + first admin user)

1. Run all migrations in `supabase/migrations/` (in numeric order) against your Supabase project — SQL Editor, `supabase db push` if the CLI is linked, or the `mcp__supabase__apply_migration` tool if working with Claude Code. See §11.
2. Set `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (server) and `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY` (client) in `.env`.
3. Create an admin user: `pnpm seed:admin -- <email> <password>` (uses the service role key to provision/reset the account; re-running with the same email updates the password instead of erroring).
4. **`pnpm seed:admin` only creates the Supabase Auth user — it does not grant admin access.** Insert a matching row into `admin_profiles` (RLS-gated, no public policy — insert via SQL Editor or the service role key) with the desired `role`:
   ```sql
   insert into admin_profiles (user_id, display_name, role)
   values ('<auth-user-uuid-from-step-3>', 'Your Name', 'super_admin');
   ```
   Until this row exists, the account can authenticate via Supabase Auth but every `/admin` API call returns 403 (`requireAdmin`, see §13).

Then sign in at `/admin/login`. `pnpm seed:projects` and `pnpm seed:services` insert placeholder content for exercising those two sections locally (upserted by slug, safe to re-run) — there are no seed scripts yet for the other entities (careers, legal pages, articles, updates, FAQs, clients, testimonials, packages, portfolio evidence); populate those through the admin UI (see §20).

## 10. Testing Executed (and Results)

Run against this codebase at handover time:

| Check | Result |
|---|---|
| `pnpm lint` | 0 errors, 0 warnings |
| `pnpm typecheck` | 0 errors |
| `pnpm test` (Vitest) | 52/52 passed — schema validation (inquiry/lead/career/legal-page), reading-time, text-list, lead-status, relative-date formatting |
| `pnpm test:e2e` (Playwright, chromium + mobile-chrome) | 22/22 passed — home, work, services, inquiry wizard (validation/success/server-failure), mobile menu, reduced motion |
| `NITRO_PRESET=vercel pnpm build` | Succeeds; client + server bundles built, `.vercel/output/functions/*` produced |
| Production smoke test | All public/admin routes verified live on Vercel post-deploy; `/sitemap.xml` and `/robots.txt` served correctly with per-locale hreflang alternates |

Two real regressions were caught and fixed by re-running the full suite before this handover (not by manual review): `tests/e2e/inquiry.spec.ts` had gone stale against the 5-step wizard rewrite (Milestone 09) and was rewritten; `tests/e2e/reduced-motion.spec.ts` asserted pre-rebrand hero copy. Both are now passing against current behavior. This is also why e2e is now a mandatory step in this project's per-milestone verification routine, not an occasional check.

## 11. Supabase Setup

1. Create a Supabase project.
2. Run all 16 migrations in `supabase/migrations/`, in order:
   `0001_create_leads.sql` → `0002_create_projects.sql` → `0003_fix_function_search_path.sql` → `0004_add_project_links.sql` → `0005_create_admin_profiles.sql` → `0006_create_media_assets.sql` → `0007_create_clients_testimonials.sql` → `0008_create_services.sql` → `0009_create_packages.sql` → `0010_create_pages_sections.sql` → `0011_create_site_settings_navigation.sql` → `0012_create_audit_log_redirects.sql` → `0013_create_portfolio_evidence.sql` → `0014_create_insights_updates_faq.sql` → `0015_create_careers_legal_pages.sql` → `0016_lead_crm_expansion.sql`.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (service role, **never** the anon key server-side — used in `server/utils/supabase.ts`).
4. RLS is enabled on every data table with **zero public policies** — this denies all anon/authenticated direct access by design; every read and write goes through server API routes using the service role key, which bypasses RLS. There is no scenario where a browser talks to Postgres directly.
5. See §9 for the required `admin_profiles` row after creating an Auth user.

## 12. Resend Setup

1. Create a Resend account and verify a sending domain.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (must be on the verified domain).
3. Set `KARSA_INQUIRY_EMAIL` to the inbox that should receive new-inquiry notifications.
4. Email templates live in `server/utils/resend.ts` (`buildInternalNotificationEmail`, `buildConfirmationEmail`); both HTML-escape user input.

## 13. Auth & RBAC

Admin access is Supabase Auth (sign-in) **plus** an `admin_profiles` row (authorization) — a valid Supabase session alone is not sufficient. `server/utils/require-admin.ts` exports `requireAdmin(event, allowedRoles?)`, which every `/api/admin/**` route calls: it verifies the bearer token against Supabase Auth, then requires an active `admin_profiles` row, then (if `allowedRoles` is passed) checks the row's `role` against the allow-list.

| Role | Typical access |
|---|---|
| `super_admin` | Everything, including destructive actions (delete projects, manage other admins) |
| `content_editor` | Create/edit content across CMS entities; no delete on some entities, no admin-user management |
| `sales` | Leads/CRM-focused routes |
| `viewer` | Read-only across admin routes |

The exact allow-list is per-route (see each `server/api/admin/**/*.ts` handler's `requireAdmin(event, [...])` call) — `super_admin` is a superset of every other role's access. Inactive profiles (`is_active = false`) are rejected regardless of role.

## 14. Turnstile Setup

1. Create a Turnstile widget in the Cloudflare dashboard.
2. Set `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (client) and `TURNSTILE_SECRET_KEY` (server).
3. Until both are set, the widget doesn't render and the server skips verification — this keeps local development unblocked but means **bot protection is inactive until configured**. Configure both before taking real public traffic (see §20 — this is currently unset in production).

## 15. Inquiry Flow (Lead CRM)

```
Browser (5-step ProjectInquiryForm wizard, useProjectInquiry.ts)
  → POST /api/inquiry
  → Zod validation        (server/validation/inquiry.ts)
  → Turnstile verification (server/utils/turnstile.ts)
  → Rate limiting          (server/utils/rate-limit.ts)
  → Supabase insert        (leads + leads_activities "created" event)
  → Resend emails          (server/utils/resend.ts)
  → { success, referenceId } or { success: false, code, message }
```

The client preserves all entered form data on failure and surfaces the server's actual error message (not a generic one) by reading `error.data` from the thrown `$fetch` rejection. No stack traces reach the browser.

Once stored, a lead moves through `/admin/leads`: status transitions (`new → contacted → qualified → discovery → proposal → won/lost/archived`), assignee, notes (`lead_notes`), and a full activity timeline (`lead_activities` — created/status_changed/note_added/email_sent/follow_up_set/assigned) are all tracked and visible per-lead at `/admin/leads/[id]`.

## 16. Internationalization (i18n)

- Locales: English (`en`, default, **unprefixed** URLs) and Indonesian (`id`, prefixed `/id/**`) — strategy `prefix_except_default`.
- Locale detection via cookie (`karsa_locale`), redirecting only at the root route.
- `useLocaleHead()` (in `app/app.vue`) emits self-referencing canonical + hreflang alternates + `og:locale` globally on every page — no per-page boilerplate needed.
- The admin panel (`/admin/**`) is intentionally **not localized** — it's an internal tool, not public-facing content.
- Bilingual database content uses the base + translation table pattern described in §9.
- **Known limitation:** the default locale remains English rather than Indonesian, an explicit scope decision made mid-project (see §20) — swapping the default would require changing `defaultLocale` and re-verifying every hardcoded route assumption.

## 17. Theme (Light / Dark / System)

`@nuxtjs/color-mode` drives a `data-theme="light"|"dark"` attribute on `<html>` (not Tailwind's `.dark` class strategy), which `app/assets/css/tokens.css` keys its CSS custom properties off of. Default preference is `system` (falls back to `light` if unresolvable), user choice persisted under the `karsa-color-mode` localStorage key. All color tokens (background, text, borders, accents) are defined for both modes — there is no page or component that hardcodes a light-only or dark-only color.

## 18. Deployment (Vercel)

`vercel.json` pins the framework to `nuxt`; `package.json` pins `engines.node` (`22.x`) and `packageManager` (`pnpm@11.9.0`) so Vercel's build image matches local dev.

1. Connect the repository to Vercel.
2. Set every variable from `.env.example` in the Vercel project's Environment Variables (Production **and** Preview — the admin panel and inquiry flow need Supabase/Cloudinary/Resend/Turnstile in both).
3. Deploy — Nuxt's Vercel preset is auto-detected from `VERCEL=1` at build time; `@nuxt/image` also switches to the Vercel image provider automatically in that environment.
4. Post-deploy checklist:
   - [ ] Custom domain + HTTPS
   - [ ] `NUXT_PUBLIC_SITE_URL` matches the live domain (affects sitemap/OG/canonical/hreflang)
   - [ ] `/sitemap.xml` and `/robots.txt` resolve, `/id/sitemap.xml` variants included
   - [ ] Submit a real test inquiry end-to-end (Supabase `leads` row + both emails arrive)
   - [ ] Run all 16 `supabase/migrations/*.sql` against the production Supabase project (see §11)
   - [ ] Insert the first `admin_profiles` row for a real admin (see §9 step 4)
   - [ ] Sign in at `/admin/login` and confirm content management works end-to-end
   - [ ] Run Lighthouse against the live URL

**Critical deployment lesson (learned from two production incidents this project):** Vercel's Nitro server bundles **every** server route into a single serverless function. One bad `require()` of an ESM-only dependency anywhere in that dependency graph crashes **every** route, not just the one that imports it. A plain local `pnpm build` + boot test is **not sufficient** to catch this — local Node ≥22.12 silently interoperates `require()` of ESM packages in a way Vercel's runtime does not, so a broken bundle can boot fine locally and still crash 100% of production traffic. Before upgrading or adding any server-side dependency, check its `package.json` `exports` map for an actual `require` condition; if it's missing, the package is unrequireable regardless of local Node version. Always verify with `NITRO_PRESET=vercel pnpm build` at minimum (see §7), and treat that as necessary but not sufficient — the exports-map check is the reliable one.

**Known deployment caveat:** the in-memory rate limiter (`server/utils/rate-limit.ts`) is per-instance. On serverless platforms with multiple concurrent function instances, each instance tracks its own counters — it's a best-effort abuse guard, not a hard limit. A distributed store (Upstash Redis, Vercel KV) would be needed for a hard guarantee.

## 19. Environment Variables Reference

See `.env.example` for the authoritative list and §5 above for what each unlocks.

## 20. Known Limitations

- **`TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` are not currently set in production.** The site runs and the inquiry form still returns a reference ID, but bot protection is inactive and neither the internal-notification nor confirmation emails send until these are configured on Vercel. This is a deliberate, user-deferred item, not an oversight — see §14/§12.
- **`projects` uses a legacy `published` boolean** instead of the `status`/`published_at` pattern every later CMS table uses (see §9). Functionally fine (both gate on "is this visible publicly"), but inconsistent — a future migration could normalize `projects` onto the same pattern.
- **No seed scripts for most CMS entities.** `pnpm seed:projects` and `pnpm seed:services` exist; careers, legal pages, articles, company updates, FAQs, clients, testimonials, packages, and portfolio evidence have no equivalent — populate them via `/admin` after deployment.
- **Package ↔ service taxonomy mismatch.** `packages.category` (solo/combo/signature/maintenance) and `services.category` are separate vocabularies and are not cross-filtered in the inquiry form's package selector.
- **English remains the default locale**, not Indonesian, per an explicit scope decision (see §16) — this was a deliberate call, not a gap to close later.
- **`/work` does not yet aggregate the newer portfolio-evidence disciplines** (design/photography/videography galleries) — those live at their own `/design`, `/photography`, `/videography` routes rather than being pulled into the original file-based `/work` case-study listing.
- **Photography lightbox is not implemented** — photography portfolio items link out to their detail page rather than opening an in-page lightbox.
- **`page_sections.theme_variant` is stored but not consumed** by any public component yet — the column exists for future per-section theme overrides.
- **OG image is a single global placeholder card** (`public/og/default.png`), not per-entity designed marketing assets. Careers and legal pages have no `cover_media_id` field, so they always fall back to this default — acceptable for internal/legal pages, worth revisiting for articles/projects if a designer produces real OG art.
- **Rate limiting is per-instance**, not distributed (see §18).
- **No response-time SLA is promised anywhere in the copy**, intentionally.
- **Brand mark is a placeholder.** No official Karsa vector logo was supplied. The 3D hero symbol and favicon are an original geometric mark (ring + tick), not a redesign of anything existing.
- **Contact channels are empty.** `email`, `whatsapp`, `instagram`, `linkedin` in `app/utils/site-config.ts` are blank pending business input; the UI hides each one gracefully rather than showing a broken link.
- **Admin panel has automated test coverage via schema/unit tests but not a full Playwright e2e suite** — e2e coverage focuses on the public site (§10); manually verify the full `/admin` login → create → publish flow against production after any RBAC or CMS-entity change.

## 21. Recommended Phase 2

- Configure real `TURNSTILE_SECRET_KEY`/site key and `RESEND_API_KEY` in production (see §20 — currently the only genuinely "unfinished" item blocking full production readiness).
- Normalize `projects` onto the `status`/`published_at` pattern used by every other CMS table.
- Add seed scripts (or a documented manual-import path) for the remaining CMS entities listed in §20.
- Real per-entity OG images (articles, projects) once a designer produces them, replacing the single global placeholder.
- A photography lightbox and a unified `/work` view that pulls in design/photography/videography portfolio evidence alongside file-based case studies.
- Distributed rate limiting (Upstash Redis / Vercel KV) if inquiry-endpoint abuse becomes a real concern.
- A real GLB-based 3D brand mark once official brand assets exist.
- Admin-panel Playwright e2e coverage (login → create → publish per entity), matching the public-site suite's rigor.

## Further Documentation

- [`docs/admin-guide.md`](docs/admin-guide.md) — non-developer walkthrough of the admin panel: logging in, roles, and managing each content type.
- [`docs/content-model.md`](docs/content-model.md) — full database schema reference: every table, its purpose, and how it relates to the public site.
- [`docs/deployment.md`](docs/deployment.md) — step-by-step Vercel + Supabase production deployment and redeployment procedure.
