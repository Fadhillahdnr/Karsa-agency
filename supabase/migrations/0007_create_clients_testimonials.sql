-- Clients and testimonials both gate public rendering behind
-- permission_to_show — see master prompt §15/§16. Never render either
-- without explicit permission, regardless of status.

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_media_id uuid references media_assets (id) on delete set null,
  website_url text,
  industry text,
  description text,
  featured boolean not null default false,
  permission_to_show boolean not null default false,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_status_idx on clients (status);
create index if not exists clients_order_idx on clients (order_index);

alter table clients enable row level security;

drop trigger if exists clients_set_updated_at on clients;
create trigger clients_set_updated_at
  before update on clients
  for each row
  execute function set_updated_at();

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  person_name text not null,
  person_role text,
  company text,
  client_id uuid references clients (id) on delete set null,
  project_id uuid references projects (id) on delete set null,
  avatar_media_id uuid references media_assets (id) on delete set null,
  source text,
  source_url text,
  permission_to_show boolean not null default false,
  featured boolean not null default false,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_status_idx on testimonials (status);
create index if not exists testimonials_order_idx on testimonials (order_index);

alter table testimonials enable row level security;

-- No public policies on either table: reads/writes go through server API
-- routes using the service role key, which enforces permission_to_show +
-- status in application code. Mirrors leads/projects.

drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at
  before update on testimonials
  for each row
  execute function set_updated_at();
