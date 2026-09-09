-- Site-wide settings (§49) as a singleton row — the `id boolean primary key
-- default true check (id)` trick allows exactly one row, ever, so the admin
-- settings page always has exactly one record to read/update. Navigation
-- (§48) and social links are separate tables since they're ordered lists,
-- not scalar settings.

create table if not exists site_settings (
  id boolean primary key default true check (id),
  agency_name text,
  tagline text,
  descriptor text,
  default_seo_title text,
  default_seo_description text,
  contact_email text,
  whatsapp text,
  phone text,
  instagram text,
  linkedin text,
  tiktok text,
  youtube text,
  address text,
  google_maps_url text,
  business_hours text,
  site_notice text,
  default_og_media_id uuid references media_assets (id) on delete set null,
  logo_light_media_id uuid references media_assets (id) on delete set null,
  logo_dark_media_id uuid references media_assets (id) on delete set null,
  favicon_media_id uuid references media_assets (id) on delete set null,
  default_theme text not null default 'system' check (default_theme in ('light', 'dark', 'system')),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
  before update on site_settings
  for each row
  execute function set_updated_at();

create table if not exists navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  parent_id uuid references navigation_items (id) on delete cascade,
  type text not null default 'link' check (type in ('link', 'page', 'service', 'package')),
  locale text not null check (locale in ('id', 'en')),
  order_index integer not null default 0,
  visible boolean not null default true,
  opens_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists navigation_items_locale_idx on navigation_items (locale, order_index);

alter table navigation_items enable row level security;

drop trigger if exists navigation_items_set_updated_at on navigation_items;
create trigger navigation_items_set_updated_at
  before update on navigation_items
  for each row
  execute function set_updated_at();

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  order_index integer not null default 0,
  visible boolean not null default true
);

alter table social_links enable row level security;

-- No public policies on any of the three tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
