-- Audit trail for sensitive admin writes (§53) and slug-change redirects
-- (§52/§81). before/after are jsonb snapshots — application code must never
-- write secrets (tokens, service keys) into either column.

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor uuid references auth.users (id) on delete set null,
  action text not null check (action in (
    'create', 'update', 'publish', 'unpublish', 'archive', 'delete', 'role_change'
  )),
  entity_type text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on audit_logs (entity_type, entity_id);
create index if not exists audit_logs_created_at_idx on audit_logs (created_at desc);

alter table audit_logs enable row level security;

create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text unique not null,
  destination_path text not null,
  status_code integer not null default 301 check (status_code in (301, 302, 307, 308)),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists redirects_source_active_idx on redirects (source_path) where active;

alter table redirects enable row level security;

-- No public policies on either table: reads/writes go through server API
-- routes / Nitro route-rule resolution using the service role key. Mirrors
-- leads/projects.
