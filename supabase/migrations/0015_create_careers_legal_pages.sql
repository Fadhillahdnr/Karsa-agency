-- Careers (§24) and Legal/Information pages (§25). Legal pages are a fixed
-- 3-slug set (privacy/terms/terms-of-service) rather than a free-slug CMS —
-- the routes are fixed by the master prompt, so the admin UI edits existing
-- rows only (no create/delete), matching the constraint below.

create table if not exists careers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  department text,
  employment_type text,
  location text,
  work_mode text,
  application_url text,
  application_email text,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  closing_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists careers_status_idx on careers (status, order_index);

alter table careers enable row level security;

drop trigger if exists careers_set_updated_at on careers;
create trigger careers_set_updated_at
  before update on careers
  for each row
  execute function set_updated_at();

create table if not exists career_translations (
  id uuid primary key default gen_random_uuid(),
  career_id uuid not null references careers (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  summary text,
  responsibilities text[] not null default '{}'::text[],
  requirements text[] not null default '{}'::text[],
  nice_to_have text[] not null default '{}'::text[],
  seo_title text,
  seo_description text,
  unique (career_id, locale)
);

alter table career_translations enable row level security;

create table if not exists legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug in ('privacy', 'terms', 'terms-of-service')),
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table legal_pages enable row level security;

drop trigger if exists legal_pages_set_updated_at on legal_pages;
create trigger legal_pages_set_updated_at
  before update on legal_pages
  for each row
  execute function set_updated_at();

create table if not exists legal_page_translations (
  id uuid primary key default gen_random_uuid(),
  legal_page_id uuid not null references legal_pages (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  seo_description text,
  unique (legal_page_id, locale)
);

alter table legal_page_translations enable row level security;

-- No public policies on any of these tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
