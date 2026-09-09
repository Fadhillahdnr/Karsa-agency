-- Dedicated creative evidence system for Design/Photography/Videography
-- (master prompt §13A). A portfolio_collection can optionally link to a
-- `clients` row and/or a `projects` row via direct nullable FKs — the same
-- project can be linked from multiple collections (one per discipline),
-- which is enough to satisfy §13A.4's "one integrated project, several
-- discipline pages" example without a separate join table.

create table if not exists portfolio_collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  discipline text not null check (discipline in ('design', 'photography', 'videography')),
  category text,
  client_id uuid references clients (id) on delete set null,
  project_id uuid references projects (id) on delete set null,
  cover_media_id uuid references media_assets (id) on delete set null,
  featured boolean not null default false,
  permission_to_show boolean not null default false,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_collections_discipline_idx on portfolio_collections (discipline, status);
create index if not exists portfolio_collections_order_idx on portfolio_collections (order_index);

alter table portfolio_collections enable row level security;

drop trigger if exists portfolio_collections_set_updated_at on portfolio_collections;
create trigger portfolio_collections_set_updated_at
  before update on portfolio_collections
  for each row
  execute function set_updated_at();

create table if not exists portfolio_collection_translations (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references portfolio_collections (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  summary text,
  description text,
  credits text,
  seo_title text,
  seo_description text,
  unique (collection_id, locale)
);

alter table portfolio_collection_translations enable row level security;

-- Publication visibility everywhere this is queried publicly requires
-- permission_to_show = true AND status = published AND published_at <= now
-- (§13A.5) — enforced in application code, not RLS, matching every other
-- table here (reads/writes go through the service role).

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references portfolio_collections (id) on delete cascade,
  media_id uuid references media_assets (id) on delete set null,
  item_type text not null check (item_type in ('image', 'mockup', 'video', 'external_video', 'before', 'after', 'document')),
  external_url text,
  poster_media_id uuid references media_assets (id) on delete set null,
  caption text,
  alt_text text,
  duration numeric,
  aspect_ratio text,
  featured boolean not null default false,
  order_index integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_items_collection_idx on portfolio_items (collection_id, order_index);

alter table portfolio_items enable row level security;

-- No public policies on any of the three tables: reads/writes go through
-- server API routes using the service role key. Mirrors leads/projects.
