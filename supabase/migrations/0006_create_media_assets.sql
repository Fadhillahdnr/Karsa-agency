-- Central media library backing the reusable MediaPicker admin component
-- (Milestone 03+). Cloudinary is the storage provider for images/video;
-- 'external' covers YouTube/Vimeo URLs stored as external_video items.

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'cloudinary' check (provider in ('cloudinary', 'external')),
  public_id text,
  resource_type text not null check (resource_type in ('image', 'video', 'document', 'external_video')),
  url text not null,
  secure_url text,
  thumbnail_url text,
  alt_text text,
  caption text,
  width integer,
  height integer,
  duration numeric,
  format text,
  bytes bigint,
  folder text,
  rights_status text,
  credit text,
  source text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists media_assets_resource_type_idx on media_assets (resource_type);
create index if not exists media_assets_folder_idx on media_assets (folder);
create index if not exists media_assets_created_at_idx on media_assets (created_at desc);

alter table media_assets enable row level security;

-- No public policies: reads/writes go through server API routes using the
-- service role key. Mirrors leads/projects (see 0001_create_leads.sql).
