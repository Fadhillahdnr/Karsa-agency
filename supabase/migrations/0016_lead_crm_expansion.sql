-- Lead CRM expansion (§45/§46). Existing lead data is preserved — every
-- new column is nullable or has a safe default, and the new status CHECK
-- constraint was verified against live data (only 'new' rows exist) before
-- being added.

alter table leads
  add column if not exists selected_package_id uuid references packages (id) on delete set null,
  add column if not exists preferred_contact text,
  add column if not exists source_page text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists locale text,
  add column if not exists consent_privacy boolean not null default false,
  add column if not exists assigned_to uuid references auth.users (id) on delete set null,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists priority text not null default 'normal' check (priority in ('low', 'normal', 'high'));

alter table leads drop constraint if exists leads_status_check;
alter table leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'qualified', 'discovery', 'proposal', 'won', 'lost', 'archived'));

create index if not exists leads_assigned_to_idx on leads (assigned_to);
create index if not exists leads_priority_idx on leads (priority);
create index if not exists leads_next_follow_up_idx on leads (next_follow_up_at);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_idx on lead_notes (lead_id, created_at desc);

alter table lead_notes enable row level security;

create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  type text not null check (type in ('created', 'status_changed', 'note_added', 'email_sent', 'follow_up_set', 'assigned')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_activities_lead_idx on lead_activities (lead_id, created_at desc);

alter table lead_activities enable row level security;

-- No public policies on lead_notes/lead_activities: reads/writes go through
-- server API routes using the service role key, matching leads itself.
