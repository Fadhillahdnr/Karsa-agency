# Karsa Studio — Website

**Digital Product & Software Studio.** _Dari Karsa Menjadi Karya._

## 1. Overview

The official marketing and lead-generation website for Karsa Studio: a minimal, editorial Nuxt 4 site with a Karsa-mark 3D hero, a Karsa Method process narrative, honestly-labeled work and services, and a project-inquiry pipeline (Zod validation → Turnstile → Supabase → Resend).

Built against `Karsa_Studio_Website_AI_Agent_Blueprint_v1.0.md`. Where the blueprint required business information that doesn't exist yet (contact channels, additional case studies), the site hides those elements gracefully instead of fabricating them — see [§20 Known Limitations](#20-known-limitations).

## 2. Stack

- **Core:** Nuxt 4, Vue 3, TypeScript, pnpm
- **Styling:** Tailwind CSS v4, CSS custom-property design tokens
- **Motion:** GSAP + ScrollTrigger, Lenis
- **3D:** TresJS (Three.js), procedural geometry (no GLB dependency)
- **Content:** Nuxt Content v3 (work + services collections)
- **Backend:** Nuxt Server API (Nitro), Zod, Supabase, Resend, Cloudflare Turnstile
- **SEO:** `@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-schema-org`
- **Testing:** Vitest (unit), Playwright (e2e)
- **Deployment:** Vercel (primary)

## 3. Prerequisites

- Node.js (version pinned in `.nvmrc`)
- pnpm (`corepack enable` or `npm i -g pnpm`)

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
| `NUXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG tags | Defaults to `https://karsastudio.com` if unset |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Bot verification widget | Widget is skipped entirely if unset (see §15) |
| `NUXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | `useAnalytics()` no-ops if unset |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Lead storage | Inquiry API skips storage (still emails) if unset |
| `TURNSTILE_SECRET_KEY` | Server-side bot verification | Verification is skipped if unset |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `KARSA_INQUIRY_EMAIL` | Lead notification/confirmation emails | Emails are skipped if unset |

The site **runs and the inquiry form still returns a reference ID** with all of the above unset — every integration degrades gracefully rather than crashing the request. Server-only keys are never exposed to the client.

## 6. Development

```bash
pnpm dev
```

Runs on `http://localhost:3000` (or the next free port).

## 7. Build

```bash
pnpm build
pnpm preview   # serve the production build locally
```

## 8. Tests

```bash
pnpm lint          # ESLint
pnpm typecheck     # nuxt typecheck (vue-tsc)
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright e2e (spins up its own dev server)
```

All four are green as of this handover — see [§10 Testing Executed](#10-testing-executed-and-results).

## 9. Content Management

Content lives in `content/work/*.md` and `content/services/*.md`, validated against the schemas in `content.config.ts`. Nuxt Content hot-reloads new/edited files in dev.

### Adding a case study

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

### Adding a service

Create `content/services/<slug>.md` matching the schema in `content.config.ts` (`pillar`, `summary`, `whoItsFor`, `problems`, `deliverables`, `faq`, plus a markdown body for "What Karsa Can Build" / "Process"). The route is derived from the filename: `content/services/api-integration.md` → `/services/api-integration`.

## 10. Testing Executed (and Results)

Run against this codebase at handover time:

| Check | Result |
|---|---|
| `pnpm lint` | 0 errors, 0 warnings |
| `pnpm typecheck` | 0 errors |
| `pnpm test` (Vitest) | 8/8 passed — `inquirySchema` validation coverage |
| `pnpm test:e2e` (Playwright, chromium + mobile-chrome) | 22/22 passed — home, work, services, inquiry (validation/success/server-failure), mobile menu, reduced motion |
| `pnpm build` | Succeeds; client + server bundles built, 4 routes prerendered |
| Production smoke test | All routes 200, unknown routes 404 via `error.vue`, `/api/inquiry` end-to-end (validation → success), `/sitemap.xml` and `/robots.txt` served |

The e2e suite caught and led to a real fix: `backdrop-blur-md` on `<header>` was establishing a CSS containing block for its `position: fixed` mobile-menu child, collapsing the menu to zero height. Fixed by teleporting the menu overlay to `<body>` (`app/components/navigation/SiteMenu.vue`).

## 11. Supabase Setup

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/0001_create_leads.sql` (via the SQL editor or `supabase db push`).
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (service role, **never** the anon key — this is used server-only in `server/utils/supabase.ts`).
4. RLS is enabled on `leads` with zero policies, which denies all anon/authenticated access by design; the server bypasses RLS via the service role key.

## 12. Resend Setup

1. Create a Resend account and verify a sending domain.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (must be on the verified domain).
3. Set `KARSA_INQUIRY_EMAIL` to the inbox that should receive new-inquiry notifications.
4. Email templates live in `server/utils/resend.ts` (`buildInternalNotificationEmail`, `buildConfirmationEmail`); both HTML-escape user input.

## 13. Turnstile Setup

1. Create a Turnstile widget in the Cloudflare dashboard.
2. Set `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (client) and `TURNSTILE_SECRET_KEY` (server).
3. Until both are set, the widget doesn't render and the server skips verification — this keeps local development unblocked but means **bot protection is inactive until configured**. Configure both before taking real public traffic.

## 14. Inquiry Flow

```
Browser (ProjectInquiryForm.vue)
  → POST /api/inquiry
  → Zod validation        (server/validation/inquiry.ts)
  → Turnstile verification (server/utils/turnstile.ts)
  → Rate limiting          (server/utils/rate-limit.ts)
  → Supabase insert        (server/utils/supabase.ts)
  → Resend emails          (server/utils/resend.ts)
  → { success, referenceId } or { success: false, code, message }
```

The client (`useProjectInquiry.ts`) preserves all entered form data on failure and surfaces the server's actual error message (not a generic one) by reading `error.data` from the thrown `$fetch` rejection. No stack traces reach the browser.

## 15. Deployment (Vercel)

1. Connect the repository to Vercel.
2. Set all variables from `.env.example` in the Vercel project's Environment Variables.
3. Deploy — Nuxt's Vercel preset is auto-detected.
4. Post-deploy checklist:
   - [ ] Custom domain + HTTPS
   - [ ] `NUXT_PUBLIC_SITE_URL` matches the live domain (affects sitemap/OG/canonical)
   - [ ] `/sitemap.xml` and `/robots.txt` resolve
   - [ ] Submit a real test inquiry end-to-end (Supabase row + both emails arrive)
   - [ ] Run Lighthouse against the live URL

**Known deployment caveat:** the in-memory rate limiter (`server/utils/rate-limit.ts`) is per-instance. On serverless platforms with multiple concurrent function instances, each instance tracks its own counters — it's a best-effort abuse guard, not a hard limit. A distributed store (Upstash Redis, Vercel KV) would be needed for a hard guarantee.

## 16. 3D Optimization

- Procedural geometry only (two tori + cylinder + sphere) — no GLB asset, so there's no model-loading cost. Documented limitation: the brand mark is a placeholder geometric symbol (ring + tick, echoing the `KARSA°` wordmark), not an official 3D logo — swap `KarsaLogoModel.vue`'s geometry for a proper extruded/GLB mark once one exists.
- DPR capped per tier: `1.75` (high) / `1.1` (medium+low), see `KarsaLogoScene.vue`.
- Geometry segment count scales down on non-`high` tiers.
- `useDevicePerformance()` classifies HIGH/MEDIUM/LOW from `deviceMemory`, `hardwareConcurrency`, viewport width, DPR, WebGL support, and reduced-motion — LOW and no-WebGL both fall back to a static `karsa-mark.svg` image (`KarsaCanvas.client.vue`), never a blank screen.
- Pointer-parallax is gated to `tier === 'high'` **and** `(hover: hover) and (pointer: fine)` — no expensive pointer physics on touch devices.
- Geometry/material disposal on unmount (`KarsaLogoModel.vue`'s `onUnmounted`).
- Canvas render loop is `render-mode="always"` intentionally (not `manual`) — see the comment in `KarsaLogoScene.vue` for why `manual` mode silently produces a blank canvas here.

## 17. Performance Rules Applied

- `.client.vue` suffix + `Lazy` prefix on the 3D canvas — it never blocks SSR or the initial paint of the (HTML, not canvas) hero text.
- Single Lenis instance, created once in a plugin (`plugins/lenis.client.ts`), not per-component.
- All GSAP animations scoped via `useGsapContext()` (wraps `gsap.context`), reverted on unmount — prevents duplicate timelines on route revisit.
- `@nuxt/image` for `format: ['webp', 'avif']`.
- Two font families only (Space Grotesk display, Inter body), loaded via a single Google Fonts request.
- `prefers-reduced-motion` collapses all transition/animation durations to ~0 globally (`main.css`) in addition to component-level gating.

Not yet measured against a deployed target: **Lighthouse scores** (see §20 — requires a live/production-like URL, not run in this environment).

## 18. Accessibility

- Semantic landmarks (`header`, `main`, `nav[aria-label]`, `footer`), skip-to-content link.
- Mobile menu: focus moves in on open, focus-trapped via `Tab`/`Shift+Tab`, closes on `Escape`, restores body scroll lock, `role="dialog"` + `aria-modal`.
- All form inputs have associated `<label>`; errors are linked via `aria-describedby` and `aria-invalid`, announced inline (not just at the top of the form).
- Decorative 3D canvas and its static fallback image are `aria-hidden`; the marquee's duplicated (looping) copy is `aria-hidden` while the first copy stays in the accessibility tree.
- Focus-visible outline on all interactive elements (`main.css`).
- No content is hover-only; the desktop nav's mobile equivalent (burger menu) carries the same links.
- Verified via Playwright: keyboard focus order in the mobile menu, and full content visibility under `prefers-reduced-motion: reduce`.

Not yet run: a full axe/Lighthouse accessibility audit against a deployed build.

## 19. Environment Variables Reference

See `.env.example` for the authoritative list and §5 above for what each unlocks.

## 20. Known Limitations

- **Brand mark is a placeholder.** No official Karsa vector logo was supplied. The 3D hero symbol and favicon are an original geometric mark (ring + tick), not a redesign of anything existing — swap for the real mark once available (see §16).
- **Only one real case study.** `content/work/aanaya.md` is the one project with a factual basis available at build time (the Aanaya e-commerce project, from the blueprint's own content example). No other client/project work was fabricated to pad the portfolio — add more `content/work/*.md` files as real projects become available.
- **Contact channels are empty.** `email`, `whatsapp`, `instagram`, `linkedin` in `app/utils/site-config.ts` are blank pending business input; the UI hides each one gracefully rather than showing a broken link. Fill them in once official channels are confirmed.
- **Turnstile/Supabase/Resend are unconfigured by default.** The app runs and the inquiry flow still works end-to-end (returns a reference ID) without them, but bot protection, lead storage, and email notifications are inactive until real credentials are supplied.
- **Rate limiting is per-instance**, not distributed (see §15).
- **Lighthouse/axe audits were not run** — this environment has no way to serve a public/production URL to test against. Run them post-deploy per the §15 checklist.
- **No response-time SLA is promised anywhere in the copy**, intentionally — the blueprint prohibits promising one that isn't officially set.

## Recommended Phase 2

Per the blueprint's own Phase 2 list (§59): CMS for non-technical content editing, an `/insights` blog once there's material worth publishing, multilingual ID/EN, and a real GLB-based 3D brand mark once official brand assets exist. None of these block this v1 launch.
