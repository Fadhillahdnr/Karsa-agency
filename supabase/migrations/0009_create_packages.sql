-- Packages (§13/§41): Solo/Combo/Signature/Maintenance pricing tiers.
-- Prices always come from here, never hard-coded in Vue — see §13's
-- "Karsa Launch Pricing" wording rule (do not say "cheap because new").

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('solo', 'combo', 'signature', 'maintenance')),
  price_type text not null check (price_type in ('fixed', 'starting_from', 'custom', 'monthly')),
  price numeric,
  currency text not null default 'IDR',
  badge text,
  featured boolean not null default false,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists packages_category_idx on packages (category);
create index if not exists packages_status_idx on packages (status);
create index if not exists packages_order_idx on packages (order_index);

alter table packages enable row level security;

drop trigger if exists packages_set_updated_at on packages;
create trigger packages_set_updated_at
  before update on packages
  for each row
  execute function set_updated_at();

create table if not exists package_translations (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  summary text,
  price_note text,
  recommended_for text,
  duration_note text,
  revision_note text,
  cta_label text,
  seo_title text,
  seo_description text,
  unique (package_id, locale)
);

alter table package_translations enable row level security;

create table if not exists package_items (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages (id) on delete cascade,
  label text not null,
  description text,
  is_highlight boolean not null default false,
  order_index integer not null default 0
);

create index if not exists package_items_package_idx on package_items (package_id, order_index);

alter table package_items enable row level security;

create table if not exists package_service_links (
  package_id uuid not null references packages (id) on delete cascade,
  service_id uuid not null references services (id) on delete cascade,
  primary key (package_id, service_id)
);

alter table package_service_links enable row level security;

-- No public policies on any of the four tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
