create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year integer not null,
  type text not null check (type in ('Independent Project', 'Internal Concept', 'Experimental Work')),
  category text not null,
  services text[] not null default '{}'::text[],
  description text not null,
  cover text not null,
  featured boolean not null default false,
  challenge text,
  approach text,
  outcome text,
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_order_idx on projects (order_index);
create index if not exists projects_published_idx on projects (published);

alter table projects enable row level security;

-- No public policies: admin CRUD and public reads both go through server
-- API routes using the Supabase service role key, which bypasses RLS. This
-- mirrors the `leads` table (see 0001_create_leads.sql).

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

-- Storage bucket for admin-uploaded project cover images. The bucket is
-- public for read (covers are shown on the public /work pages); writes are
-- restricted to authenticated users so only logged-in admins can upload.
insert into storage.buckets (id, name, public)
values ('project-covers', 'project-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for project covers" on storage.objects;
create policy "Public read access for project covers"
  on storage.objects for select
  using (bucket_id = 'project-covers');

drop policy if exists "Authenticated users can upload project covers" on storage.objects;
create policy "Authenticated users can upload project covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-covers');

drop policy if exists "Authenticated users can update project covers" on storage.objects;
create policy "Authenticated users can update project covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-covers');

drop policy if exists "Authenticated users can delete project covers" on storage.objects;
create policy "Authenticated users can delete project covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-covers');
