# Content Model

The authoritative reference for every database table in the CMS: what it stores, how it relates to other tables, and where it surfaces on the public site or in `/admin`. Source of truth is always `supabase/migrations/*.sql` — this document summarizes it for convenience but the migrations win on any discrepancy.

## Conventions used throughout

- **RLS:** every table has row-level security enabled with **zero public policies** — all reads/writes go through server API routes using the Supabase service role key, which bypasses RLS. No table is ever queried directly from the browser.
- **Base + translation pattern:** bilingual content splits non-translatable fields (slug, media, ordering, pricing, status) onto a base table, and translatable copy onto a `*_translations` table keyed by `(entity_id, locale)` with `locale in ('id', 'en')`. This keeps small per-locale text changes cheap and avoids duplicating structural data per language.
- **Publishing status:** most content tables use `status text check (status in ('draft', 'scheduled', 'published', 'archived'))` + `published_at timestamptz`; public API routes filter `status = 'published' AND published_at <= now()`. A few simpler entity types (`faqs`, `careers`, `legal_pages`, `clients`, `testimonials`) use a three-state version without `scheduled`. `projects` is the one outlier with a plain `published boolean` (predates the pattern, see README §20).
- **`order_index`:** manual display ordering, ascending, set from the admin UI's reorder controls where present.
- **`permission_to_show`:** an explicit consent flag (used on `clients`, `testimonials`, `portfolio_collections`) — distinct from `status`, meant to record that the featured party has actually granted permission to publish, not just that the content is ready.

## Tables

### `leads` — 0001, expanded 0016 (Lead CRM)

The project-inquiry pipeline's storage. One row per "Start a Project" submission.

Core fields: `reference_id` (shown to the submitter), `name`, `company`, `email`, `phone`, `service`, `budget_range`, `timeline`, `project_description`, `referral_source`, `status`, `source`, `metadata` (jsonb).

CRM expansion (0016): `selected_package_id` (→ `packages`), `preferred_contact`, `source_page`, UTM fields (`utm_source/medium/campaign/content/term`), `locale`, `consent_privacy`, `assigned_to` (→ `auth.users`), `last_contacted_at`, `next_follow_up_at`, `priority` (low/normal/high). `status` was widened from a free-text default to a checked enum: `new / contacted / qualified / discovery / proposal / won / lost / archived`.

Related tables: `lead_notes` (private internal notes, `note`, `author_id`), `lead_activities` (append-only timeline: `type` in `created/status_changed/note_added/email_sent/follow_up_set/assigned`, `metadata` jsonb).

Public surface: none directly — written to via `POST /api/inquiry`, never read publicly. Admin: `/admin/leads`, `/admin/leads/[id]`.

### `projects` — 0002, links added 0004

Work case studies managed via the admin panel (distinct from the file-based `content/work/*.md` collection — both render through the same `/work` templates).

Fields: `slug`, `title`, `year`, `type` (Independent Project / Internal Concept / Experimental Work), `category`, `services` (`text[]`), `description`, `cover`, `featured`, `challenge`/`approach`/`outcome`, `order_index`, `published` (boolean — see note above), plus (0004) live/GitHub links.

Public: `/work`, `/work/[slug]`. Admin: `/admin/projects`.

### `admin_profiles` — 0005

The RBAC layer on top of Supabase Auth. `user_id` (PK, → `auth.users`), `display_name`, `role` (`super_admin/content_editor/sales/viewer`), `avatar_url`, `is_active`, `last_seen_at`. No row here means no admin access, regardless of a valid Supabase Auth session — see README §13 and §9.

### `media_assets` — 0006

The media library backing every `*_media_id` foreign key across the schema. `provider` (cloudinary/external), `public_id`, `resource_type` (image/video/document/external_video), `url`/`secure_url`/`thumbnail_url`, `alt_text`, `caption`, `width`/`height`/`duration`, `format`, `folder`, plus rights-tracking fields (`rights_status`, `credit`, `source`) so usage rights on client-supplied media can be recorded, not just the file itself.

Public: served via whatever entity references it. Admin: `/admin/media`.

### `clients` / `testimonials` — 0007

`clients`: `name`, `slug`, `logo_media_id`, `website_url`, `industry`, `description`, `featured`, `permission_to_show`, `order_index`, `status`.

`testimonials`: `quote`, `person_name`, `person_role`, `company`, optional links to `client_id` and `project_id`, `avatar_media_id`, `source`/`source_url`, `permission_to_show`, `featured`, `order_index`, `status`.

Public: shown across the site (homepage, work pages). Admin: `/admin/clients`, `/admin/testimonials`.

### `services` / `service_translations` / `service_faqs` — 0008

`services`: `slug`, `parent_id` (self-referential, for sub-services), `category` (web/design/photo/film/integrated), `cover_media_id`, `featured`, pricing (`show_price`, `price_type`, `starting_price`, `currency`), `order_index`, `status`/`published_at`, `created_by`/`updated_by`.

`service_translations`: per-locale `title`, `short_title`, `eyebrow`, `summary`, `intro`, `who_its_for`, `problems`, `deliverables`, `included`, `excluded`, `process`, `cta_label`, `seo_title`/`seo_description`.

`service_faqs`: per-service, per-locale FAQ pairs (distinct from the site-wide `faqs` table).

Public: `/services`, `/services/[slug]`. Admin: `/admin/services`.

### `packages` / `package_translations` / `package_items` / `package_service_links` — 0009

`packages`: `slug`, `category` (solo/combo/signature/maintenance — **a separate vocabulary from `services.category`**, see README §20), pricing (`price_type`, `price`, `currency`), `badge`, `featured`, `order_index`, `status`/`published_at`.

`package_translations`: per-locale `title`, `summary`, `price_note`, `recommended_for`, `duration_note`, `revision_note`, `cta_label`, SEO fields.

`package_items`: line items within a package (`label`, `description`, `is_highlight`, `order_index`).

`package_service_links`: many-to-many join between `packages` and `services`.

Public: `/packages`. Admin: `/admin/packages`.

### `pages` / `page_translations` / `page_sections` — 0010

A generic page-builder layer, currently used for the homepage. `pages`: `slug`, `status`/`published_at`, `show_in_navigation`, `indexable`. `page_translations`: per-locale `title`, SEO fields. `page_sections`: ordered blocks (`section_key`, `component_type`, `enabled`, `order_index`, `theme_variant` — **stored but not yet consumed by any public component**, see README §20, `content` jsonb, `settings` jsonb).

Public: homepage section content. Admin: `/admin/content/home`.

### `site_settings` / `navigation_items` / `social_links` — 0011

`site_settings` is a singleton (`id boolean primary key default true check (id)` — a deliberate one-row-only constraint): agency name/tagline/descriptor, default SEO title/description, contact fields (email/whatsapp/phone/instagram/linkedin/tiktok/youtube/address/maps URL/business hours), `site_notice`, default OG media, light/dark logo + favicon media, `default_theme`.

`navigation_items`: per-locale nav entries, self-referential `parent_id` for sub-menus, `type` (link/page/service/package), `visible`, `opens_new_tab`.

`social_links`: platform + URL pairs.

### `audit_logs` / `redirects` — 0012

`audit_logs`: append-only record of admin actions (`actor`, `action`, `entity_type`, `entity_id`, `before`/`after` jsonb snapshots) — not currently surfaced in a dedicated admin UI page, but the data is captured.

`redirects`: `source_path` → `destination_path`, `status_code` (301/302/307/308), `active`.

### `portfolio_collections` / `portfolio_collection_translations` / `portfolio_items` — 0013

Design/photography/videography case-study evidence, distinct from `projects`. `portfolio_collections`: `slug`, `discipline` (design/photography/videography), `category`, optional `client_id`/`project_id` links, `cover_media_id`, `featured`, `permission_to_show`, `order_index`, `status`/`published_at`.

`portfolio_collection_translations`: per-locale `title`, `summary`, `description`, `credits`, SEO fields.

`portfolio_items`: individual media pieces within a collection — `item_type` (image/mockup/video/external_video/before/after/document), `media_id`, `external_url`, `poster_media_id`, `caption`, `alt_text`, `duration`, `aspect_ratio`, `featured`, `order_index`.

Public: `/design`, `/photography`, `/videography` (index + `[slug]`). Admin: `/admin/portfolio/[discipline]`.

### `articles` / `article_translations` / `company_updates` / `company_update_translations` / `faqs` / `faq_translations` — 0014

`articles` (Insights blog): `slug`, `cover_media_id`, `author`, `category` (Website/Design/Photography/Video/Branding/Business/Creative Process), `tags` (`text[]`), `featured`, `status`/`published_at`, `reading_time`, `canonical_url`, `og_media_id`. `article_translations`: per-locale `title`, `excerpt`, `content` (jsonb — TipTap document), SEO fields.

`company_updates`: `slug`, `cover_media_id`, `status`/`published_at`. `company_update_translations`: per-locale title/content (structure mirrors articles).

`faqs` (site-wide, distinct from `service_faqs`): `category`, `related_service` (→ `services`), `order_index`, `featured`, `status` (no `scheduled` state). `faq_translations`: per-locale `question`/`answer`.

Public: `/insights`, `/insights/[slug]`, `/updates`, `/updates/[slug]`, `/faq`. Admin: `/admin/articles`, `/admin/updates`, `/admin/faqs`.

### `careers` / `career_translations` / `legal_pages` / `legal_page_translations` — 0015

`careers`: `slug`, `department`, `employment_type`, `location`, `work_mode`, `application_url`/`application_email`, `order_index`, `status` (no `scheduled`), `published_at`, `closing_at`. `career_translations`: per-locale `title`, `summary`, `responsibilities`/`requirements`/`nice_to_have` (each `text[]`), SEO fields.

`legal_pages`: `slug` constrained to `('privacy', 'terms', 'terms-of-service')` — a fixed, small set by design, not an open content type. `legal_page_translations`: per-locale `title`, `content` (jsonb).

Public: `/careers`, `/careers/[slug]`, `/privacy`, `/terms`, `/terms-of-service`. Admin: `/admin/careers`, `/admin/legal`.

## Entity relationship summary

```
auth.users ──┬── admin_profiles (role-based access)
             └── created_by / updated_by / actor / assigned_to (audit trail across most tables)

media_assets ── referenced by: services, articles, company_updates, portfolio_collections/items,
                 clients, testimonials, site_settings, packages (via package covers where applicable)

clients ── testimonials, portfolio_collections (optional link)
projects ── testimonials, portfolio_collections (optional link)
services ── service_translations, service_faqs, faqs.related_service, package_service_links
packages ── package_translations, package_items, package_service_links, leads.selected_package_id
pages ── page_translations, page_sections
leads ── lead_notes, lead_activities
portfolio_collections ── portfolio_collection_translations, portfolio_items
```

## Where content publishing rules are enforced

Every public `server/api/**` GET route (not under `/admin`) is the single enforcement point for "is this visible" — it applies the `status = 'published' AND published_at <= now()` filter (or `published = true` for `projects`) at query time. There is no separate caching or build-time gate; a status change in `/admin` takes effect on the next request, no redeploy required.
