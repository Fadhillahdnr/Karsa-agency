# Deployment

Step-by-step production deployment and redeployment procedure for Vercel + Supabase. See `README.md` §11/§18 for the shorter version — this document goes deeper on the *why* behind each step and the failure modes to check for.

## First-time production setup

### 1. Supabase project

1. Create a Supabase project (or reuse an existing one — verify with the team which project ref is the actual production database before running anything; more than one Supabase project has existed for this codebase at different points, so don't assume).
2. Run all 16 migrations in `supabase/migrations/`, **in numeric order**: `0001` through `0016`. Each migration is idempotent (`create table if not exists`, `add column if not exists`) so re-running an already-applied one is safe, but running them out of order is not — several later migrations reference tables created earlier (e.g. `0016` alters `leads`, created in `0001`; `0013` references `clients` and `projects` from `0002`/`0007`).
3. Confirm RLS is enabled with zero public policies on every table (this is set by each migration itself — verify via the Supabase dashboard's Authentication → Policies view showing no rows, or `get_advisors` if working via MCP tooling).
4. Grab the project's URL and keys from Project Settings → API: the `service_role` key (server-only, full bypass of RLS) and the `anon` key (safe to expose, used only for Admin Auth sign-in).

### 2. Vercel project

1. Connect the GitHub repository to a new Vercel project. `vercel.json` already pins the framework to `nuxt`.
2. Set every variable listed in `.env.example` under Vercel → Project Settings → Environment Variables, for **both Production and Preview** — the admin panel and inquiry flow need Supabase/Cloudinary/Resend/Turnstile in both environments, not just Production. Missing a var in Preview means PR previews will silently behave differently from production (e.g. inquiry emails not sending) — a common source of "works on my preview, breaks in prod" confusion in the other direction too.
3. `NUXT_PUBLIC_SITE_URL` must match the actual live domain once one is assigned — it feeds canonical URLs, the sitemap, hreflang alternates, and Open Graph tags. Changing domains later means updating this var and redeploying.

### 3. First deploy

1. Trigger a deploy (push to the connected branch, or manually via Vercel dashboard/CLI).
2. Nuxt's Vercel preset auto-detects from `VERCEL=1` at build time — no manual preset configuration needed in `nuxt.config.ts`.
3. `@nuxt/image` switches to the Vercel image provider automatically in that environment; the local "sharp binaries built for darwin-arm64" build warning does not carry over to the Vercel build.

### 4. First admin user

1. Locally, with `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` set to the **production** project's values: `pnpm seed:admin -- <email> <password>`.
2. Insert the matching `admin_profiles` row (via SQL Editor, using the production project) with `role = 'super_admin'` — see README §9 step 4. Skipping this leaves the account able to log in but unable to do anything (every `/api/admin/**` call 403s).
3. Sign in at `https://<your-domain>/admin/login` and confirm you land on the dashboard, not an error.

### 5. Post-deploy checklist

- [ ] Custom domain attached, HTTPS active
- [ ] `NUXT_PUBLIC_SITE_URL` matches the live domain exactly (scheme + host, no trailing slash)
- [ ] `/sitemap.xml` and `/robots.txt` resolve and return the expected content (check both the default-locale and `/id/` variants)
- [ ] Submit a real test inquiry through `/start-a-project` end-to-end — confirm a `leads` row appears in Supabase and both the internal-notification and confirmation emails arrive (this requires `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` to actually be set — see the Known Limitations note in README §20 if these are still pending)
- [ ] Populate at least minimal content (a service, a project, homepage sections) through `/admin` so the site isn't showing empty states
- [ ] Run Lighthouse against the live URL

## Redeploying (routine changes)

For most changes, pushing to the connected branch is sufficient — Vercel builds and deploys automatically. Before pushing anything that touches server-side dependencies, read the next section first.

### The ESM/CJS dependency trap (read before adding or upgrading any server-side package)

This project hit two separate production outages from the same root cause, both eventually fixed and now documented so a third doesn't happen. The mechanism:

Vercel's Nitro server bundles **every** server route (all of `server/api/**` and `server/utils/**`) into a single serverless function. If any package in that combined dependency graph is ESM-only (no `require` condition in its `package.json` `exports` map) and something tries to `require()` it, **the entire function fails to load — every route goes down, not just the one that imports the broken package.**

The trap: local Node ≥22.12 has unconditional `require(esm)` interop, meaning a broken bundle can `node -e "import(...)"` or boot locally without any error, while still crashing 100% of traffic on Vercel's actual runtime. **A local boot test passing is not proof the deploy will work.**

The reliable check, before adding or upgrading any server-side dependency:

1. Find the package's installed `package.json` (`node_modules/<pkg>/package.json`).
2. Check its `exports` field for a `require` condition (or the absence of an `exports` field entirely, which means it's requireable via the classic `main` field). If `exports` exists but has no `require` key — only `import`/`module`/`default` — that package cannot be `require()`'d, full stop, regardless of Node version.
3. If the package itself is fine but pulls in a transitive dependency that isn't, the same rule applies transitively — check what it depends on too.
4. Run `NITRO_PRESET=vercel pnpm build` locally and inspect the resulting `.vercel/output/functions/*` bundle for build-time errors as a **secondary** check — necessary, not sufficient, since the interop issue above means a broken bundle can still look fine.

If a needed package is ESM-only with no CJS build, either: find an alternative package that still ships CJS, pin to an older version of the same package from before it dropped CJS support, or (last resort) dynamically `import()` it instead of `require()`-ing it inside the server code path that needs it.

### Standard pre-push verification

```bash
pnpm lint
pnpm typecheck
pnpm test
NITRO_PRESET=vercel pnpm build
NUXT_IGNORE_LOCK=1 pnpm test:e2e   # if another dev server is already running locally
```

All five should be clean before pushing. After deploy, re-check the post-deploy checklist items relevant to what changed (e.g. a schema change → re-verify the affected admin CRUD flow; a dependency change → re-verify the ESM/CJS check above; an env var change → re-verify the feature it gates).

## Environment variable changes

Vercel env vars can be managed via the dashboard, or programmatically via the REST API (there is no dedicated MCP tool for this):

```bash
# Set/update a variable
curl -X POST "https://api.vercel.com/v10/projects/<project-id>/env?teamId=<team-id>&upsert=true" \
  -H "Authorization: Bearer <vercel-token>" \
  -H "Content-Type: application/json" \
  -d '{"key":"<KEY>","value":"<value>","type":"plain","target":["production"]}'

# Trigger a redeploy of the current production deployment (env var changes need a redeploy to take effect)
curl -X POST "https://api.vercel.com/v13/deployments?teamId=<team-id>" \
  -H "Authorization: Bearer <vercel-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"<project-name>","deploymentId":"<existing-deployment-id>","target":"production"}'
```

Env var changes alone do not trigger a redeploy automatically — the app only reads them at build/boot time, so a redeploy (or the API call above) is required after any change.

## Known deployment caveats

- **In-memory rate limiting is per-instance.** `server/utils/rate-limit.ts` tracks counters in memory, which on a serverless platform means each concurrent function instance has its own counter — it's a best-effort abuse guard on the inquiry endpoint, not a hard limit. A distributed store (Upstash Redis, Vercel KV) would be needed for a real guarantee; not currently implemented (see README §21 Recommended Phase 2).
- **`sanitize-html` is exact-pinned** (not caret-ranged) in `package.json` as a direct consequence of the ESM/CJS trap above — versions past `2.17.4` pull in `htmlparser2@^12`, which dropped CommonJS entirely. Do not bump this dependency without re-running the exports-map check.
