create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  reference_id text unique not null,
  name text not null,
  company text,
  email text not null,
  phone text,
  service text not null,
  budget_range text,
  timeline text,
  project_description text not null,
  referral_source text,
  status text not null default 'new',
  source text not null default 'website',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

alter table leads enable row level security;

-- No public policies are defined: this table is only ever written to and
-- read from the server using the Supabase service role key, which bypasses
-- RLS. Enabling RLS with zero policies denies all anon/authenticated access
-- by default, which is the desired behavior here.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
  before update on leads
  for each row
  execute function set_updated_at();
