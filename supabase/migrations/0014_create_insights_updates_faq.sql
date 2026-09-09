-- Insights (articles), Company Updates, and FAQ (§17/§18/§19). Categories
-- and tags are kept as plain text/array columns rather than separate lookup
-- tables (article_categories, article_tags, faq_categories in the master
-- prompt's illustrative §38 list) — same simplification already used for
-- service/package/portfolio categories in this build: small, low-churn
-- value sets don't earn a table of their own yet.

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cover_media_id uuid references media_assets (id) on delete set null,
  author text,
  category text check (category in ('Website', 'Design', 'Photography', 'Video', 'Branding', 'Business', 'Creative Process')),
  tags text[] not null default '{}'::text[],
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  reading_time integer,
  canonical_url text,
  og_media_id uuid references media_assets (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on articles (status, published_at desc);
create index if not exists articles_category_idx on articles (category);

alter table articles enable row level security;

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
  before update on articles
  for each row
  execute function set_updated_at();

create table if not exists article_translations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  unique (article_id, locale)
);

alter table article_translations enable row level security;

create table if not exists company_updates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cover_media_id uuid references media_assets (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_updates_status_idx on company_updates (status, published_at desc);

alter table company_updates enable row level security;

drop trigger if exists company_updates_set_updated_at on company_updates;
create trigger company_updates_set_updated_at
  before update on company_updates
  for each row
  execute function set_updated_at();

create table if not exists company_update_translations (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null references company_updates (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  unique (update_id, locale)
);

alter table company_update_translations enable row level security;

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  category text,
  related_service uuid references services (id) on delete set null,
  order_index integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_status_idx on faqs (status, order_index);

alter table faqs enable row level security;

drop trigger if exists faqs_set_updated_at on faqs;
create trigger faqs_set_updated_at
  before update on faqs
  for each row
  execute function set_updated_at();

create table if not exists faq_translations (
  id uuid primary key default gen_random_uuid(),
  faq_id uuid not null references faqs (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  question text not null,
  answer text not null,
  unique (faq_id, locale)
);

alter table faq_translations enable row level security;

-- No public policies on any of these tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
