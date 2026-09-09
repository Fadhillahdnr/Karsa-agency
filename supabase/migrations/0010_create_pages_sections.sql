-- Structured section-based CMS for the homepage and other section-driven
-- pages (§33). component_type is a closed enum by design — admins choose
-- content and an approved variant, never arbitrary markup/scripts.

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  show_in_navigation boolean not null default false,
  indexable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table pages enable row level security;

drop trigger if exists pages_set_updated_at on pages;
create trigger pages_set_updated_at
  before update on pages
  for each row
  execute function set_updated_at();

create table if not exists page_translations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  seo_title text,
  seo_description text,
  unique (page_id, locale)
);

alter table page_translations enable row level security;

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages (id) on delete cascade,
  section_key text not null,
  component_type text not null check (component_type in (
    'hero', 'client_logos', 'brand_statement', 'service_grid', 'featured_work',
    'integrated_package', 'why_karsa', 'process', 'testimonials', 'insights',
    'updates', 'faq', 'cta'
  )),
  enabled boolean not null default true,
  order_index integer not null default 0,
  theme_variant text check (theme_variant in ('light', 'dark', 'neutral', 'auto')),
  content jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_sections_page_idx on page_sections (page_id, order_index);
create unique index if not exists page_sections_page_key_idx on page_sections (page_id, section_key);

alter table page_sections enable row level security;

drop trigger if exists page_sections_set_updated_at on page_sections;
create trigger page_sections_set_updated_at
  before update on page_sections
  for each row
  execute function set_updated_at();

-- No public policies on any of the three tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
