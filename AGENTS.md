# AGENTS.md — Karsa Agency Website & CMS

**Purpose of this file:** this is the single primary-reference document for any AI agent (or new human contributor) picking up work on this repository. Read this file fully before making changes. It is meant to eliminate the need for the project owner to re-explain architecture, conventions, or history — everything an agent needs to act correctly and on-point should be here or linked from here.

Verify anything time-sensitive (env vars actually set, current deployment state, current DB rows) against the live system rather than trusting this document blindly — code and infra state can drift after this file was written. Re-read `git log --oneline` before assuming "what's next" — this document is updated opportunistically, not on every commit.

Last verified against repo state: commit `9c12eab` (2026-09-14). Working tree at that point had only two untracked files: `docs/Karsa_Agency_Creative_Services_Launch_Pricing*.pdf` (client-facing pricing PDFs, unrelated to app code).

---

## 1. What this project is

Karsa Agency's marketing website + headless CMS + admin panel + lead-generation pipeline. A minimal, editorial Nuxt 4 site (Website · Design · Photography · Film creative agency) with a 3D hero, a process narrative ("Karsa Method"), portfolio/case studies, an insights blog, careers, legal pages, and a 5-step project-inquiry wizard — all backed by a bilingual (EN/ID) Postgres CMS with role-gated admin access.

The project was originally scaffolded as "Karsa Studio" (a digital product/software studio) under an earlier v1.0 blueprint, then fully rebranded and rebuilt as "Karsa Agency" (a creative/design/photography/video agency) against `Karsa_Agency_Full_Website_CMS_Admin_AI_Agent_Master_Prompt_v2.1.md` (repo root — a 142-section, 13-milestone spec). **That master prompt document is historical planning input, not a live spec to keep re-reading** — as of this file, all 13 milestones (00–12) plus every deliberately-deferred item from them are complete (see §11 History). Treat the master prompt as background/rationale, and this file + the code itself as the current source of truth.

**Anti-fabrication rule (carried through from the master prompt, still binding):** never invent clients, metrics, testimonials, company registration/legal details, or contact channels that don't exist. Where real business information is missing (e.g. `siteConfig.email`/`whatsapp`/`instagram`/`linkedin` in `app/utils/site-config.ts` are currently empty strings), the UI is built to hide that element gracefully rather than show a fabricated or broken one. Follow the same rule for any new content you add.

## 2. Tech stack (exact, from `package.json`)

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 (`^4.5.2`), Vue 3 (`^3.5.41`), TypeScript |
| Package manager | pnpm `11.9.0` (pinned via `packageManager`), Node `22.x` (pinned via `engines` and `.nvmrc`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), CSS custom-property design tokens (`app/assets/css/tokens.css`) |
| Theme | `@nuxtjs/color-mode` — light/dark/system via `data-theme` attribute on `<html>` (NOT Tailwind's `.dark` class strategy) |
| i18n | `@nuxtjs/i18n` v10 — English + Indonesian |
| Motion | GSAP + ScrollTrigger, Lenis (smooth scroll) |
| 3D | TresJS (Vue Three.js wrapper), procedural geometry — no GLB model dependency |
| File-based content | Nuxt Content v3 — used ONLY for `work` case studies, and currently has zero files checked in (see §6.3) |
| Database | Supabase Postgres — 16 migrations, ~30 tables, see §5 |
| Rich text | TipTap (admin editor) → server-side sanitize via `sanitize-html` (pinned `2.17.4` — see §9.1, do not bump casually) |
| Backend | Nuxt Server API (Nitro/H3), Zod validation, Supabase (Auth + Postgres + Storage), Cloudinary (media), Resend (email), Cloudflare Turnstile (bot protection) |
| SEO | `@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-schema-org` (Organization/WebSite/Article/JobPosting/Question/Service/Breadcrumb) |
| Testing | Vitest (unit), Playwright (e2e) |
| Deployment | Vercel, Nitro `vercel` preset (auto-detected via `VERCEL=1`) |

## 3. Repository structure

```
app/                          # Nuxt 4 "app" directory (client + universal code)
  pages/                      # File-based routing — see §7/§8 for full route list
    admin/                    # /admin/** — the CMS admin panel (not localized)
    <public pages>             # /, /services, /work, /insights, /careers, etc.
  layouts/
    default.vue               # Public site shell (header/footer/theme)
    admin.vue                 # Admin app-shell: independent-scroll sidebar + main pane
                               #   (see useScrollLock in §9 — DO NOT touch document.body.style.overflow
                               #   directly; use useScrollLock())
  components/
    admin/                    # Admin-only UI: forms per entity, AdminListPage, RichTextEditor, etc.
    base/                     # Generic design-system primitives (BaseButton, BaseSection, ...)
    forms/                    # Public-facing form pieces (inquiry wizard steps, etc.)
    home/                     # Homepage section components (CMS-driven, see §5 pages/page_sections)
    motion/                   # Scroll/reveal animation wrapper components
    navigation/               # Header, mobile menu, footer
    portfolio/                # PortfolioHub / PortfolioDetail — shared by design/photography/videography
    services/                 # Service-page-specific components
    three/                    # 3D hero scene components (TresJS)
    work/                     # /work case-study components
  composables/                # See §9 for the important ones
  middleware/
    admin-auth.ts             # Route guard for /admin/** (client-side; server routes independently
                               #   enforce via requireAdmin — see §8.1, never trust this alone)
  plugins/
    supabase.client.ts        # Browser Supabase client (anon key) for admin login
    lenis.client.ts, analytics.client.ts
  utils/
    site-config.ts            # Non-translatable identity (name, contact channels — currently empty)
    leads.ts, errors.ts
  types/gtag.d.ts
  app.vue                     # Root — wires useLocaleHead() for canonical/hreflang/og:locale globally
  error.vue

server/
  api/
    admin/**                  # Auth-gated CMS CRUD — every handler calls requireAdmin() (§8.1)
    __sitemap__/urls.ts       # Dynamic sitemap source (published-only, both locales)
    inquiry.post.ts           # The 5-step form's submission endpoint (§9.2)
    <entity>/index.get.ts,
    <entity>/[slug].get.ts    # Public read-only endpoints — always filter to published-only (§6)
  middleware/
    legacy-id-prefix-redirect.ts  # 301s old /id/** URLs after the Milestone 13 locale swap (§8.4)
  utils/
    supabase.ts                # getSupabaseClient() — service-role client + the full Database type (§5)
    require-admin.ts           # requireAdmin(event, allowedRoles?) — the RBAC gate, see §8.1
    render-rich-text.ts        # TipTap JSON → sanitized HTML (sanitize-html, NOT isomorphic-dompurify — §9.1)
    resend.ts, turnstile.ts, rate-limit.ts, cloudinary.ts, reading-time.ts, text-list.ts
  validation/                  # One Zod schema file per entity, shared by admin write routes + tests

supabase/migrations/           # 16 numbered SQL migrations, 0001–0016 — see §5. Idempotent
                                #   (create table if not exists), but ORDER MATTERS across files.
i18n/
  i18n.config.ts
  locales/{en,id}.json         # All UI copy — see §8 i18n section

content.config.ts              # Nuxt Content collection schemas (work / workId) — see §6.3
tests/
  unit/                        # Vitest — Zod schemas, pure-logic utils
  e2e/                         # Playwright — home, work, services, inquiry wizard, mobile menu, reduced-motion

scripts/                       # seed-admin-user.mjs, seed-projects.mjs, seed-services.mjs (node --env-file=.env)
docs/
  admin-guide.md               # Non-developer walkthrough of /admin (roles, publishing states, per-entity how-to)
  content-model.md             # Full DB schema reference — EVERY table, columns, relations (deep-dive on §5 below)
  deployment.md                # Step-by-step Vercel+Supabase deploy/redeploy procedure, deep-dive on §11 below
Karsa_Agency_Full_Website_CMS_Admin_AI_Agent_Master_Prompt_v2.1.md   # Historical planning spec — see §1
README.md                      # Human-facing setup/overview doc — overlaps this file, less agent-oriented
```

**When you need more depth than this file gives on a topic, go to:** `docs/content-model.md` (schema), `docs/admin-guide.md` (non-dev admin usage), `docs/deployment.md` (deploy mechanics + the ESM/CJS trap in full), `README.md` (human setup walkthrough). This file (`AGENTS.md`) is the synthesis/index; those are the authoritative deep-dives, and migrations under `supabase/migrations/*.sql` always win over any prose description on a schema discrepancy.

## 4. Architecture overview

```
Browser (public site)              Browser (/admin panel)
  │                                   │
  │ SSR/CSR Nuxt pages                │ CSR-only (ssr:false routeRule), Supabase Auth session
  │                                   │ in localStorage/useState, bearer token on every /api/admin call
  ▼                                   ▼
Nuxt Server API (server/api/**, Nitro/H3, all bundled into ONE Vercel serverless function)
  │
  ├─ Public GET routes ──────────────► getSupabaseClient() (service-role key, bypasses RLS)
  │  (no auth; filter status=published                       │
  │   AND published_at<=now() at query time)                 ▼
  │                                              Supabase Postgres (RLS on, ZERO public policies —
  ├─ Admin routes (/api/admin/**) ──► requireAdmin() ──►     every table is service-role-only;
  │  (Bearer token → Supabase Auth →                          browser NEVER talks to Postgres directly)
  │   admin_profiles row → role check)
  │
  ├─ POST /api/inquiry ──► Zod validate ─► Turnstile verify ─► rate-limit ─► Supabase insert (leads +
  │                                                              lead_activities) ─► Resend emails
  │
  └─ Media uploads (/api/admin/upload, /api/admin/media) ──► Cloudinary ──► media_assets row
```

Key architectural facts an agent must internalize:

1. **RLS is enabled with zero public policies on every table.** There is no scenario where the browser queries Postgres directly — everything goes through a Nuxt server route using the service-role key. If you're tempted to add a Supabase client call in `app/**` code, stop — it belongs in `server/api/**` instead (the only sanctioned exception is `app/plugins/supabase.client.ts`, which uses the anon key purely for Supabase **Auth** sign-in on `/admin/login`, never for data queries).
2. **Every server route is bundled into a single Vercel serverless function.** One bad dependency anywhere in the graph can take down 100% of the site, not just one route. See §9.1 — this has caused two real production outages.
3. **Public content visibility is enforced entirely in the API layer at query time**, not via caching or build-time gating. Flipping a row's `status` to `published` in `/admin` takes effect on the very next request. There is no redeploy step for content changes.
4. **Admin authorization is two independent layers**: Supabase Auth (is this a real signed-in user?) AND an `admin_profiles` row (does this user have an active admin role?). A valid Supabase session alone grants nothing — see §8.1.

## 5. Database schema (Supabase Postgres)

Full authoritative reference: **`docs/content-model.md`**. Source of truth for exact columns/constraints is always `supabase/migrations/*.sql` — this section is a navigable summary.

### 5.1 Conventions used across almost every table

- **RLS + zero public policies** on every table (see §4).
- **Base + translation pattern** for bilingual content: non-translatable fields (slug, media refs, ordering, pricing, status) live on a base table; translatable copy lives in a `*_translations` table keyed by `(entity_id, locale)`, `locale in ('id','en')`.
- **Publishing status**: most content tables have `status text check (status in ('draft','scheduled','published','archived'))` + `published_at timestamptz`. Public routes filter `status='published' AND published_at<=now()`. A few simpler entities (`faqs`, `careers`, `legal_pages`, `clients`, `testimonials`) use a 3-state version without `scheduled`. **`projects` is the one outlier** — plain `published boolean`, predates the pattern (known, accepted inconsistency — see §12).
- **`order_index`**: manual ascending display order, editable from admin list/reorder UI.
- **`permission_to_show`**: an explicit consent flag on `clients`/`testimonials`/`portfolio_collections` — distinct from `status`, records that the featured party actually granted permission to publish (not just that the copy is ready).

### 5.2 Migration-by-migration table map

| # | File | Tables created |
|---|---|---|
| 0001 | `create_leads.sql` | `leads` |
| 0002 | `create_projects.sql` | `projects` |
| 0003 | `fix_function_search_path.sql` | (security hardening, no new tables) |
| 0004 | `add_project_links.sql` | adds `live_url`/`github_url` to `projects` |
| 0005 | `create_admin_profiles.sql` | `admin_profiles` (RBAC layer) |
| 0006 | `create_media_assets.sql` | `media_assets` (Cloudinary-backed media library) |
| 0007 | `create_clients_testimonials.sql` | `clients`, `testimonials` |
| 0008 | `create_services.sql` | `services`, `service_translations`, `service_faqs` |
| 0009 | `create_packages.sql` | `packages`, `package_translations`, `package_items`, `package_service_links` |
| 0010 | `create_pages_sections.sql` | `pages`, `page_translations`, `page_sections` (homepage builder) |
| 0011 | `create_site_settings_navigation.sql` | `site_settings` (singleton), `navigation_items`, `social_links` |
| 0012 | `create_audit_log_redirects.sql` | `audit_logs`, `redirects` |
| 0013 | `create_portfolio_evidence.sql` | `portfolio_collections`, `portfolio_collection_translations`, `portfolio_items` |
| 0014 | `create_insights_updates_faq.sql` | `articles`, `article_translations`, `company_updates`, `company_update_translations`, `faqs`, `faq_translations` |
| 0015 | `create_careers_legal_pages.sql` | `careers`, `career_translations`, `legal_pages`, `legal_page_translations` |
| 0016 | `lead_crm_expansion.sql` | alters `leads` (CRM fields, status enum); adds `lead_notes`, `lead_activities` |

**Order matters when applying migrations** — later ones reference tables created earlier (e.g. `0016` alters `leads` from `0001`; `0013` references `clients`/`projects` from `0002`/`0007`). Each migration is idempotent (`create table if not exists` / `add column if not exists`), so re-running an already-applied one is safe.

The full `Database` TypeScript type (every row/insert/update shape, used by every server route) lives in **`server/utils/supabase.ts`** — treat it as the canonical current schema-as-code; check it before writing any new query against a table, since it will be more current than this document if the two ever disagree.

### 5.3 Entity relationship summary

```
auth.users ──┬── admin_profiles (role-based access)
             └── created_by / updated_by / actor / assigned_to (audit trail across most tables)

media_assets ── referenced by: services, articles, company_updates, portfolio_collections/items,
                 clients, testimonials, site_settings, packages (via covers)

clients ── testimonials, portfolio_collections (optional link)
projects ── testimonials, portfolio_collections (optional link)
services ── service_translations, service_faqs, faqs.related_service, package_service_links
packages ── package_translations, package_items, package_service_links, leads.selected_package_id
pages ── page_translations, page_sections
leads ── lead_notes, lead_activities
portfolio_collections ── portfolio_collection_translations, portfolio_items
```

## 6. Content model & where each entity surfaces

| Entity | Public route(s) | Admin route | Migration |
|---|---|---|---|
| Projects (case studies) | `/work`, `/work/[slug]` | `/admin/projects` | 0002, 0004 |
| Services (+ FAQs) | `/services`, `/services/[slug]` | `/admin/services` | 0008 |
| Packages | `/packages` | `/admin/packages` | 0009 |
| Clients & logos | shown across site | `/admin/clients` | 0007 |
| Testimonials | shown across site | `/admin/testimonials` | 0007 |
| Portfolio evidence (design/photo/video) | `/design`, `/photography`, `/videography` (+ `[slug]`) | `/admin/portfolio/[discipline]` | 0013 |
| Insights articles | `/insights`, `/insights/[slug]` | `/admin/articles` | 0014 |
| Company updates | `/updates`, `/updates/[slug]` | `/admin/updates` | 0014 |
| Site-wide FAQs | `/faq` | `/admin/faqs` | 0014 |
| Careers | `/careers`, `/careers/[slug]` | `/admin/careers` | 0015 |
| Legal pages (privacy/terms/terms-of-service — fixed 3-slug set) | footer links | `/admin/legal` | 0015 |
| Homepage sections | `/` | `/admin/content/home` | 0010 |
| Media library (Cloudinary) | via whatever entity references it | `/admin/media` | 0006 |
| Leads (inquiry CRM) | write-only via `/start-a-project` | `/admin/leads`, `/admin/leads/[id]` | 0001, 0016 |

### 6.1 Publishing states

Draft / Scheduled / Published / Archived for most entities (3-state Draft/Published/Archived for `faqs`/`careers`/`legal_pages`/`clients`/`testimonials`). Only Published rows with `published_at <= now()` are publicly visible. `projects` uses a plain Published/Not-Published boolean instead (see §12).

### 6.2 Rich text

TipTap editor in `/admin` (`app/components/admin/RichTextEditor.vue`) → stored as TipTap JSON in the DB (`content` jsonb columns on `articles`/`company_updates`/`legal_pages`) → rendered server-side via `server/utils/render-rich-text.ts` (`sanitize-html`) before reaching the client. **Never trust client-submitted HTML directly** — this sanitize step is the one and only path rich content takes to the public page.

### 6.3 File-based content (`content/work/*.md`) — currently empty

`content.config.ts` defines `work`/`workId` Nuxt Content collections sourced from `content/work/*.md` / `content/id/work/*.md`. **As of this document, the `content/` directory does not exist in the working tree and nothing is tracked under it in git** — every case study currently live is DB-backed (`projects` table) or portfolio-evidence-backed (`portfolio_collections`), aggregated together by `/work` (see `server/api/work/index.get.ts` and `app/pages/work/index.vue`, which merge `queryCollection('work'|'workId')` results with `$fetch('/api/work')` results client-side). The file-based path is fully wired and will work the moment a `content/work/<slug>.md` file is added (frontmatter schema is in `content.config.ts`), but don't assume any exist unless you've just checked.

### 6.4 Site-wide config vs. per-locale copy

- `app/utils/site-config.ts` — non-translatable identity (name, contact channel URLs — currently blank, see §1 anti-fabrication note) and static route lists.
- `i18n/locales/{en,id}.json` — all UI copy (nav labels, headings, the Karsa Method steps, etc.), read via `useI18n()` / the `useKarsaConfig()` composable (which returns **computed refs**, not plain values, because the header/footer live in the persistent layout and don't remount on locale-only navigation — see the doc comment in `app/composables/useKarsaConfig.ts`).
- Database `*_translations` tables — per-entity bilingual CMS content (see §5.1).

## 7. Public routes (file-based, `app/pages/`)

```
/                          index.vue                    Homepage — CMS-driven via page_sections (§6, /admin/content/home)
/about                     about.vue                    Custom-designed, not CMS-driven (deliberate — see §12)
/process                   process.vue                  Composes karsaMethod i18n + services/faqs APIs, no new tables
/contact                   contact.vue                  Composes site_settings contact channels + faqs
/work, /work/[slug]        work/                         Merged content/work/*.md + DB projects + linked portfolio evidence
/services, /services/[slug] services/                    DB-backed (services table)
/packages                  packages/index.vue           DB-backed (packages table)
/design(+[slug])           design/                       Portfolio evidence, discipline='design'
/photography(+[slug])      photography/                  Portfolio evidence, discipline='photography'; has fullscreen lightbox
/videography(+[slug])      videography/                  Portfolio evidence, discipline='videography'
/insights, /insights/[slug] insights/                    Articles (blog)
/updates, /updates/[slug]  updates/                       Company updates/news
/faq                       faq/index.vue                 Site-wide FAQs
/careers, /careers/[slug]  careers/                       Job postings; JobPosting schema.org; self-hides past closing_at
/privacy, /terms, /terms-of-service   (fixed slugs)       legal_pages table content
/start-a-project           start-a-project.vue            5-step lead-inquiry wizard (§9.2)
```

Locale prefixing: default locale `id` is unprefixed (`/services`), English is prefixed (`/en/services`) — see §8.1. All routes above are shown in their unprefixed (`id`) form.

## 8. Admin routes (`app/pages/admin/`, all client-only, not localized)

```
/admin/login                       Sign-in
/admin                             Dashboard (index.vue)
/admin/projects (+ [id], + new)
/admin/services (+ [id], + new)
/admin/packages (+ [id], + new)
/admin/clients (+ [id], + new)
/admin/testimonials (+ [id], + new)
/admin/portfolio/[discipline] (+ [id], + new)   discipline = design|photography|videography
/admin/articles (+ [id], + new)
/admin/updates (+ [id], + new)
/admin/faqs (+ [id], + new)
/admin/careers (+ [id], + new)
/admin/legal (+ [id])                            edit-only, no create/delete — 3 fixed slugs
/admin/content/home                              Reorder/enable/theme-variant manager for homepage sections
/admin/media                                     Media library (Cloudinary uploads)
/admin/leads (+ [id])                            Lead CRM — status pipeline, notes, activity timeline
```

Every list page follows the same shared pattern via `app/components/admin/AdminListPage.vue` + the `useAdminList` composable (extracted in commit `2e77e50` after the pattern proved out across ~10 entities): search/filter, skeleton loading state, empty state, mobile-card + desktop-table responsive layout. **Reuse this pattern for any new admin list page rather than hand-rolling another one.**

### 8.1 Auth & RBAC (full detail)

`server/utils/require-admin.ts` exports `requireAdmin(event, allowedRoles?)`. Every `/api/admin/**` handler calls it. It:
1. Reads the `Authorization: Bearer <token>` header, 401s if missing.
2. Verifies the token against Supabase Auth (`supabase.auth.getUser(token)`), 401s if invalid.
3. Looks up an `admin_profiles` row for that user; 403s if none exists or `is_active=false`.
4. If `allowedRoles` was passed, 403s unless the profile's `role` is in that list.
5. Fire-and-forget updates `last_seen_at`.

**Roles:** `super_admin` (everything) / `content_editor` (create/edit most content, not admin management) / `sales` (leads/CRM) / `viewer` (read-only).

**Observed per-route pattern (grep-verified against every `server/api/admin/**` handler as of this document):**
- GET routes with **no** `allowedRoles` argument → any active admin, any role, can read.
- POST/PATCH (write) routes → almost universally `['super_admin', 'content_editor']`.
- DELETE routes → almost universally `['super_admin']` only — **exceptions:** `faqs/[id].delete.ts` and `media/[id].delete.ts` also allow `content_editor`.
- Leads (`/api/admin/leads/**`) → `['super_admin', 'sales', 'viewer']` for reads, `['super_admin', 'sales']` for writes (status/notes) — `content_editor` has zero access to leads by design.
- `upload.post.ts` → `['super_admin', 'content_editor']`.

When adding a new admin route, match the nearest existing entity's pattern rather than inventing a new allow-list. If genuinely unsure which roles should have access, ask rather than guess — this table has been the subject of two real security-audit fixes already (Milestones 09 and 11 both found live RBAC gaps from routes that used a since-deleted `requireAdminUser()` "any admin, any role" helper instead of role-scoped `requireAdmin()`; that helper no longer exists, so this class of bug shouldn't reopen, but a new route that simply omits `allowedRoles` when it shouldn't is still possible).

### 8.2 Provisioning a new admin (two steps, both required)

1. Create a Supabase Auth user: `pnpm seed:admin -- <email> <password>` (or the Auth Admin REST API directly — see `docs/content-model.md`/README §9). This alone grants **zero** admin access.
2. Insert a matching `admin_profiles` row (service-role key required, no public insert policy):
   ```sql
   insert into admin_profiles (user_id, display_name, role)
   values ('<auth-user-uuid>', 'Name', 'super_admin');
   ```
   Until this row exists, the account authenticates fine but every `/api/admin/**` call returns 403.

### 8.3 Known existing admin account

`karsaagensi@gmail.com` exists in the production Supabase project as `super_admin`. Its password has been shared in plaintext chat at least once historically and should be treated as rotatable/compromised, not durably secret — don't assume you know it, don't ask the user to paste it into a transcript unless truly necessary, and don't reuse a previously-pasted value. If you need to test an authenticated admin flow, prefer asking the user to do the interactive part, or provision a fresh throwaway admin via §8.2 and delete it after.

### 8.4 i18n

`@nuxtjs/i18n`, locales `en` (`en-US`) and `id` (`id-ID`, **default**, unprefixed — `/services`, `/work`, etc.), strategy `prefix_except_default` so English is prefixed at `/en/**`. This default (`id` unprefixed) was flipped from the original `en`-default in commit `9c20597` (2026-09-11) — a deliberate, already-shipped SEO-affecting change, not something to reconsider casually. `server/middleware/legacy-id-prefix-redirect.ts` 301s old `/id/**` URLs (from before the flip) to their new unprefixed form.

`useLocaleHead()` in `app/app.vue` emits canonical + hreflang + `og:locale` globally — no per-page boilerplate needed for that. The admin panel is intentionally **not** localized.

### 8.5 Theme (light/dark/system)

`@nuxtjs/color-mode` writes `data-theme="light"|"dark"` on `<html>` (default `system`, falls back to `light`), persisted under localStorage key `karsa-color-mode`. `app/assets/css/tokens.css` defines every color token for both modes — there should be no component that hardcodes a light-only or dark-only color. `page_sections.theme_variant` (light/dark/neutral/auto) DOES now affect public homepage section appearance (wired in commit `c50edd7`) — this was previously a known limitation/stored-but-unused column; it is no longer.

## 9. Key composables & server utils reference

| File | Purpose |
|---|---|
| `app/composables/useAdminAuth.ts` | Wraps the Supabase browser client for `/admin`; shares session/profile app-wide via `useState` |
| `app/composables/useAdminList.ts` | Shared list-page logic (search/filter/pagination) — pair with `AdminListPage.vue` |
| `app/composables/useProjectInquiry.ts` | Drives the 5-step `/start-a-project` wizard's state + submission |
| `app/composables/useScrollLock.ts` | Module-level ref-counted scroll lock. **Any new admin overlay/drawer/modal must call `lock()`/`unlock()` from here — never touch `document.body.style.overflow` directly.** The admin layout is an independent-scroll app-shell (sidebar + main scroll separately, see `app/layouts/admin.vue`); locking `body` alone doesn't stop the `main` pane from scrolling behind an open overlay. |
| `app/composables/useKarsaConfig.ts` | Locale-reactive site identity/contact/method-steps, see §6.4 |
| `app/composables/useReducedMotion.ts`, `useDevicePerformance.ts`, `useWebGLSupport.ts` | Gate the 3D hero / GSAP motion by device capability and `prefers-reduced-motion` |
| `app/composables/useConfirm.ts`, `useToast.ts` | Shared admin UI feedback primitives |
| `server/utils/require-admin.ts` | The RBAC gate — see §8.1 |
| `server/utils/supabase.ts` | `getSupabaseClient()` (service-role, singleton, returns `null` if env unset — callers must handle that gracefully, not crash) + the full `Database` type (canonical schema-as-code) |
| `server/utils/render-rich-text.ts` | TipTap JSON → sanitized HTML via `sanitize-html` (see §9.1 — do not swap this dependency without re-reading the ESM/CJS section) |
| `server/utils/rate-limit.ts` | In-memory, per-instance rate limiting on `/api/inquiry` — **not distributed**, best-effort only on serverless (see §12) |
| `server/utils/resend.ts` | `buildInternalNotificationEmail` / `buildConfirmationEmail` — both HTML-escape user input |
| `server/utils/turnstile.ts` | Server-side bot verification — no-ops if `TURNSTILE_SECRET_KEY` unset |
| `server/utils/cloudinary.ts` | Media upload handling for `/admin/media` and inline content-form uploads |

### 9.1 The ESM/CJS Vercel dependency trap — read before touching any server-side dependency

Vercel's Nitro server bundles **every** `server/api/**` + `server/utils/**` route into a single serverless function. If any package in that graph is ESM-only (no `require` condition in its `package.json` `exports` map) and something `require()`s it, the **entire function fails to boot — every route on the whole site goes down**, not just the route that imports the broken package.

This has happened twice in this project's history:
1. `isomorphic-dompurify` → `jsdom@30` → `@exodus/bytes` (ESM-only) crashed 100% of production routes. Fixed by switching to `sanitize-html`.
2. The `sanitize-html` fix itself then broke the same way — `sanitize-html>=2.17.6` depends on `htmlparser2@^12`, which is ESM-only with no `require` export condition at all. Fixed by pinning `sanitize-html` to exact `2.17.4` (last version on `htmlparser2@^10`, which is properly dual-published).

**The trap that makes this hard to catch:** local Node ≥22.12 has unconditional `require(esm)` interop — a broken bundle can boot fine locally (`node -e "import('./index.mjs')"` prints success) while still crashing 100% of Vercel's actual `nodejs22.x` runtime, which does not have that interop. **A local boot test passing is not proof of anything.**

**The reliable check, required before adding/upgrading any server-side dependency:**
1. `NITRO_PRESET=vercel pnpm build` (reproduces Vercel's actual bundling; plain `pnpm build` does NOT).
2. For every CJS package pulled into `.vercel/output/functions/__fallback.func/node_modules/` by the change, open its `package.json` and check the `exports` map for a `require` condition (or confirm it has no `exports` field at all, meaning classic `main`-based requiring still works). If `exports` exists with only `import`/`module`/`default` and no `require` key, that package is unrequireable full stop, regardless of Node version — it WILL crash Vercel if anything in the CJS bundle graph requires it, transitively or directly.
3. `.vercel` and `.output` are both gitignored — build and delete freely for this check.

If a needed package is ESM-only with no CJS build: find an alternative that still ships CJS, pin to an older dual-published version of the same package, or (last resort) dynamically `import()` it instead of `require()`-ing it inside the affected server code path.

### 9.2 Inquiry / Lead CRM flow

```
Browser (5-step ProjectInquiryForm wizard, useProjectInquiry.ts)
  → POST /api/inquiry
  → Zod validation         (server/validation/inquiry.ts)
  → Turnstile verification (server/utils/turnstile.ts — skipped if TURNSTILE_SECRET_KEY unset)
  → Rate limiting          (server/utils/rate-limit.ts — per-instance, best-effort)
  → Supabase insert        (leads row + lead_activities "created" event)
  → Resend emails          (server/utils/resend.ts — skipped if RESEND_API_KEY unset)
  → { success, referenceId } or { success:false, code, message }
```

Wizard steps: service → project → budget → about you → review & submit. Attribution (source page, UTM params, locale) is captured automatically. Client preserves all entered data on failure and surfaces the server's actual error message (reads `error.data` from the `$fetch` rejection) — never a generic error, and no stack traces reach the browser.

Once stored, a lead moves through `/admin/leads`: 8-state pipeline `new → contacted → qualified → discovery → proposal → won/lost → archived`, with assignee, priority, notes (`lead_notes`), and a full activity timeline (`lead_activities`: created/status_changed/note_added/email_sent/follow_up_set/assigned).

## 10. Environment variables

Full list with purpose: `.env.example` (repo root) + README §5. **Never commit real values; never print secret values into a committed file, including this one.** Summary of what unlocks what:

| Variable(s) | Unlocks | Behavior if unset |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, hreflang, OG tags | Falls back to `https://karsa-agency.vercel.app` |
| `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Admin login (client-side Supabase Auth) | Login page can't authenticate |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | **Everything CMS-related** — all public reads, all admin CRUD, RBAC | Public pages render empty-state gracefully; admin routes 500 |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Admin media uploads | Upload endpoint 500s |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Bot verification on inquiry form | Widget doesn't render, server skips verification — **inquiry form has zero bot protection until both are set** |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `KARSA_INQUIRY_EMAIL` | Lead notification/confirmation emails | Emails silently skipped (lead is still stored) |
| `NUXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | `useAnalytics()` no-ops |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional CLI-arg alternative for `pnpm seed:admin` | Not read anywhere else |

**Local `.env` vs. production:** `.env` is gitignored, so any local fix to it (e.g. pointing at the correct Supabase project) is machine-local and does not travel with the repo or to other contributors/agents. Before trusting local `pnpm dev` output against "real" data, verify `SUPABASE_URL` in the local `.env` actually points at the intended project — there is project history of a stale/wrong project ref causing silent empty-database behavior in local dev (see git history around the Milestone 04 session if you need the full story; not repeated here since it's now fixed on the machine where it happened).

## 11. Deployment (Vercel + Supabase)

Deep-dive: `docs/deployment.md` (covers the ESM/CJS trap in full — §9.1 above is the condensed version). `vercel.json` pins `"framework": "nuxtjs"`.

**Standard pre-push verification** (all must be clean before pushing anything non-trivial):
```bash
pnpm lint
pnpm typecheck
pnpm test
NITRO_PRESET=vercel pnpm build
NUXT_IGNORE_LOCK=1 pnpm test:e2e   # if a dev server is already running locally
```

Env var changes on Vercel require an explicit redeploy to take effect (the app only reads them at build/boot). There is no dedicated Vercel MCP tool for managing env vars — use the REST API directly with a user-supplied token:
```bash
# set
curl -X POST "https://api.vercel.com/v10/projects/<project-id>/env?teamId=<team-id>&upsert=true" \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"key":"<KEY>","value":"<value>","type":"plain","target":["production"]}'
# redeploy
curl -X POST "https://api.vercel.com/v13/deployments?teamId=<team-id>" \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"name":"<project-name>","deploymentId":"<existing-deployment-id>","target":"production"}'
```

Similarly, the Supabase MCP toolset never returns the `service_role` key (intentional security boundary) — ask the project owner to paste it directly when a task needs it (e.g. setting Vercel env vars, calling the GoTrue Admin API to create an Auth user).

## 12. Known limitations / accepted inconsistencies (not bugs to silently "fix")

These are documented, deliberate, or at least known-and-accepted states — don't "clean them up" without checking with the project owner first, since several were explicit scope decisions:

- **`projects` uses a legacy `published` boolean** instead of the `status`/`published_at` pattern every later table uses. Functionally equivalent, structurally inconsistent. A future normalization migration is possible but not scheduled.
- **`packages.category`** (solo/combo/signature/maintenance) and **`services.category`** are separate vocabularies, not cross-filtered anywhere.
- **No seed scripts** for most CMS entities beyond `pnpm seed:projects` and the owner-approved pricing import (`pnpm seed:pricing`; `pnpm seed:services` is its service-only compatibility entrypoint) — everything else is populated via `/admin` UI only.
- **Rate limiting is per-instance** (in-memory), not distributed — best-effort abuse guard on `/api/inquiry`, not a hard limit, given Vercel's multi-instance serverless model.
- **OG image is a single global placeholder** (`public/og/default.png`) except where real per-entity `cover_media_id`/`og_media_id` covers exist (services/articles/updates/portfolio) — careers and legal pages have no OG field and always use the global fallback.
- **Brand mark is a placeholder** — an original geometric ring+tick mark, not an official supplied logo. `siteConfig` contact channels (`email`/`whatsapp`/`instagram`/`linkedin`) are empty pending real business input; UI hides each gracefully rather than showing broken links (see §1 anti-fabrication rule).
- **`/about` is intentionally not CMS-driven** — a deliberate scope decision (already a good custom i18n page from the initial rebrand, master prompt didn't require converting it).
- **Admin panel has no dedicated Playwright e2e suite** — e2e coverage is public-site-focused; admin flows are covered by schema/unit tests + structural parity checks, not a live browser walkthrough in CI.
- **As of the last full audit (Milestone 11), `TURNSTILE_SECRET_KEY`/site key and `RESEND_API_KEY` were found unset in Vercel production** — per project memory, this was reportedly resolved by the user in a later session, but **has not been independently re-verified by an agent since**. If a task depends on either being live (bot protection working, inquiry emails sending), spot-check via the Vercel dashboard/API before assuming it's fixed.

## 13. Project history (condensed)

All 13 milestones of the master-prompt rebuild (00-Audit through 12-Production-Handover) are complete, plus every item that was deliberately deferred mid-build (drag-and-drop homepage section reorder, portfolio lightbox, the `AdminListPage`/`useAdminList` generic list primitive, `theme_variant` actually affecting appearance, `/work` aggregating Design/Photography/Videography evidence, the EN→ID default-locale swap, and extra branding polish — logo image wordmark, real favicon). There were two production outages (both the ESM/CJS dependency class described in §9.1) — both fixed same-day, both now guarded against via the exports-map check.

For the full milestone-by-milestone narrative (what shipped in each, what was verified how, and why specific scope calls were made), the most detailed record is **the project's Claude Code memory file `karsa-agency-cms-revamp-progress.md`** (not part of this git repo — it's session memory local to the AI assistant that did the build) — if you're an agent without access to that memory, `git log --oneline` plus the commit bodies is the next-best source; commit subjects are written descriptively enough to reconstruct the sequence (see the milestone commit hashes referenced throughout this file, e.g. `9c20597`, `c50edd7`, `08b564d`, `afc90d5`).

## 14. Working conventions for agents on this repo

These are established patterns/preferences from the project's actual build history — follow them rather than defaulting to generic habits:

1. **One unit of work at a time, verified, then committed, then check in before continuing** — this project's owner has explicitly preferred a step-by-step cadence (implement → run the full verification gate in §11 → commit with a descriptive message → summarize what changed/what was deferred and why → confirm before moving to the next unit) over large unattended multi-step runs. Don't chain multiple substantial changes into one turn without checking in, even if everything is green.
2. **Run the full verification gate** (`pnpm lint && pnpm typecheck && pnpm test && NITRO_PRESET=vercel pnpm build`, plus `pnpm test:e2e` for anything touching a public flow) before considering a change done — not just `pnpm build` (see §9.1, plain build misses real Vercel-breaking bugs).
3. **After any `git add` covering multiple paths, re-run `git status --short` and check the staged column specifically** before committing — a bad pathspec in a multi-path `git add` can silently fail to stage some files while `git status` still lists them, leading to an incomplete commit that looks complete. This happened once in this project's history (Milestone 04) and was caught only by re-checking before the next commit.
4. **RBAC changes are security-sensitive** — match the nearest existing entity's `requireAdmin(event, [...])` allow-list pattern (§8.1) rather than improvising; two real production RBAC gaps were found and fixed by later security-audit passes in this project's history, both from routes that skipped or under-scoped the role check.
5. **The user (repo owner) communicates in Bahasa Indonesia** and expects replies in Bahasa Indonesia when working on this project conversationally. This file itself is in English (technical reference, meant to be read by any agent regardless of its output language) — that's independent of the conversational language convention.
6. **Never fabricate business content** — see §1. This applies to placeholder copy, seed data, contact info, and anything that could read as a real claim about the company.
7. **Don't add abstractions ahead of need.** The `AdminListPage`/`useAdminList` generalization (§8) only happened after ~10 entities had proven out the same hand-rolled pattern — that's the bar for extracting a shared primitive in this codebase, not "this might be reused someday."

## 15. Quick command reference

```bash
pnpm install                          # first-time setup (approve native builds if prompted: pnpm approve-builds)
pnpm dev                              # http://localhost:3000
pnpm lint / pnpm lint:fix
pnpm typecheck
pnpm test                             # Vitest unit
pnpm test:e2e                         # Playwright (spins up its own server on :4123)
pnpm build                            # default Nitro preset — NOT sufficient to catch Vercel-only bugs, see §9.1
NITRO_PRESET=vercel pnpm build        # the check that actually matters before shipping server-dependency changes
pnpm seed:admin -- <email> <password> # provisions/resets a Supabase Auth user — still needs an admin_profiles row (§8.2)
pnpm seed:projects                       # placeholder projects for local exercising
pnpm seed:pricing                        # approved PDF-derived services + packages; idempotent upsert
pnpm seed:services                       # service-only compatibility entrypoint for seed:pricing
```
