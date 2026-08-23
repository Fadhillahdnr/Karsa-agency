-- Hardens set_updated_at() against search_path hijacking, per Supabase
-- linter warning 0011_function_search_path_mutable.
alter function set_updated_at() set search_path = public, pg_temp;
