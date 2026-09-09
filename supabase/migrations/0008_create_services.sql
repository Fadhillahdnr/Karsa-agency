-- Services move from Nuxt Content markdown to the database here (base +
-- translation + FAQ pattern per master prompt §39/§40). Nuxt Content
-- (content/services/*.md) keeps working until the public read path is
-- switched over in Milestone 04 — see §59 migration strategy. Both sources
-- must not be treated as equally authoritative once that switch happens.

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  parent_id uuid references services (id) on delete set null,
  category text not null check (category in ('web', 'design', 'photo', 'film', 'integrated')),
  cover_media_id uuid references media_assets (id) on delete set null,
  featured boolean not null default false,
  show_price boolean not null default false,
  price_type text check (price_type in ('fixed', 'starting_from', 'custom', 'monthly')),
  starting_price numeric,
  currency text not null default 'IDR',
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_category_idx on services (category);
create index if not exists services_status_idx on services (status);
create index if not exists services_order_idx on services (order_index);

alter table services enable row level security;

drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at
  before update on services
  for each row
  execute function set_updated_at();

create table if not exists service_translations (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  short_title text,
  eyebrow text,
  summary text,
  intro text,
  who_its_for text,
  problems text,
  deliverables text,
  included text,
  excluded text,
  process text,
  cta_label text,
  seo_title text,
  seo_description text,
  unique (service_id, locale)
);

alter table service_translations enable row level security;

create table if not exists service_faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  question text not null,
  answer text not null,
  order_index integer not null default 0
);

create index if not exists service_faqs_service_idx on service_faqs (service_id, order_index);

alter table service_faqs enable row level security;

-- No public policies on any of the three tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
