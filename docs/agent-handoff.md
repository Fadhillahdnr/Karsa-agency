# Karsa Project Agent Handoff

Last updated: 2026-09-16 (Asia/Jakarta)

Read this file together with the repository-root `AGENTS.md` whenever the owner says **"kembali ke project Karsa"** or asks to continue prior Karsa work. This is a compact continuity note, not a replacement for `AGENTS.md`, the code, migrations, or current Git history.

## Owner preferences

- Communicate in Indonesian unless requested otherwise.
- The project is normally run through Docker Compose; restore the web container after local test runs that require stopping it.
- Prefer implementing and verifying changes directly instead of stopping for avoidable clarification.
- Never store or repeat passwords, Supabase service-role keys, or other secrets in repository notes.

## Work completed in the latest session

### Admin and form scrolling

- Commit: `906bd2f fix: restore native scrolling in admin and textareas`
- Restored independent scrolling in the admin application shell, including the sidebar and main pane.
- Restored native textarea scrolling and covered it with browser tests.
- Continue using `useScrollLock()` for overlays; do not manipulate `document.body.style.overflow` directly.

### Services and launch pricing

- Source document (kept untracked): `docs/Karsa_Agency_Creative_Services_Launch_Pricing.pdf`
- Commit: `59f2571 feat: sync launch services and pricing`
- Added canonical pricing data in `scripts/pricing-data.mjs` and the idempotent `pnpm seed:pricing` importer in `scripts/seed-pricing.mjs`.
- `pnpm seed:services` remains a service-only compatibility entrypoint.
- The configured Supabase database was populated and read back successfully:
  - 4 published service pillars: Website, Design, Photography, and Videography + Editing.
  - 26 published packages: 16 standalone, 7 combo, and 3 ongoing-care packages.
  - 52 package translations, 104 package items, and 40 package-service links.
  - 6 legacy service slugs were archived rather than deleted.
- No SQL schema migration was added because migrations `0008` and `0009` already support all imported service/package content. This was a data migration through an idempotent seeder.
- `/packages` now groups packages by category and shows the PDF-derived add-ons and commercial terms. Service detail pages show included and excluded scope.
- UI hierarchy was checked in desktop light mode and mobile dark mode; no horizontal overflow was found.

### Contact details

- Commit after the pricing work: `0b22925 Menambahkan No Whatsapp dan Email`
- `siteConfig` now contains the owner-provided email and WhatsApp number. Do not revert these to empty placeholders unless explicitly requested.

## Verification state

Last successful checks after the pricing import:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`: 52/52 tests passed
- `pnpm test:e2e`: 28/28 tests passed across Chromium desktop and mobile projects
- `node scripts/seed-pricing.mjs --dry-run`
- Supabase post-seed count and sample-price verification

`NITRO_PRESET=vercel pnpm build` compiles the client and server bundles but currently exits during prerender because `/privacy` returns a CMS 404. This predates and is unrelated to the service/pricing changes. Fix or seed the legal-page content before treating the production build gate as fully green.

## Current repository notes

- Docker web service was restored and available on port `3000` at the end of the work.
- The following client documents are intentionally untracked and must not be staged or deleted without the owner's instruction:
  - `docs/Karsa_Agency_Creative_Services_Launch_Pricing.pdf`
  - `docs/Karsa_Agency_Creative_Services_Launch_Pricing.ORIGINAL_CANVA_BACKUP.pdf`
- Re-check `git status`, `git log --oneline`, Docker state, environment availability, and live database rows before continuing because external state may have changed.

