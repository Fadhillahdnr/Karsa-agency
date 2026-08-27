alter table projects
  add column if not exists live_url text,
  add column if not exists github_url text;
