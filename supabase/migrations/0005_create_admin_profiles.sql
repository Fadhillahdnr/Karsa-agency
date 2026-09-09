-- Admin profiles: adds role-based access on top of Supabase Auth. Until
-- server/utils/require-admin.ts is updated (Milestone 03 — Admin Shell) to
-- check this table, any authenticated Supabase user still counts as a full
-- admin, exactly as before this migration. This table only starts being
-- enforced once that server code changes.
--
-- IMPORTANT (manual follow-up before Milestone 03 ships): the existing
-- admin login (karsaagensi@gmail.com, see memory) has no row here yet.
-- Insert one with role='super_admin' before switching require-admin.ts
-- over to role checks, or that account will lose access.

create table if not exists admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('super_admin', 'content_editor', 'sales', 'viewer')),
  avatar_url text,
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_role_idx on admin_profiles (role);

alter table admin_profiles enable row level security;

-- No public policies: reads/writes go through server API routes using the
-- service role key, which bypasses RLS. Mirrors leads/projects (see
-- 0001_create_leads.sql).

drop trigger if exists admin_profiles_set_updated_at on admin_profiles;
create trigger admin_profiles_set_updated_at
  before update on admin_profiles
  for each row
  execute function set_updated_at();
