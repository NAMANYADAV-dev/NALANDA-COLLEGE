-- ============================================================================
-- grants.sql — table privileges for the Supabase API roles
-- ============================================================================
-- FIXES: "permission denied for table ..." on both reads (public site) and
-- writes (admin add/edit/delete).
--
-- Why this is needed: RLS policies decide WHICH ROWS each role may touch, but a
-- role must first have baseline GRANT access to the table at all. Creating the
-- tables via raw SQL didn't grant the API roles (anon / authenticated), so every
-- query failed with "permission denied for table". These GRANTs fix that while
-- the existing RLS policies keep the data properly restricted.
--
-- Run ONCE in Supabase → SQL Editor → New query → paste → Run. Safe to re-run.
-- ============================================================================

grant usage on schema public to anon, authenticated;

-- Read: anon + authenticated may SELECT.
-- (RLS still limits anon to rows where is_published = true.)
grant select on all tables in schema public to anon, authenticated;

-- Public contact / admission form: anon may INSERT enquiries only.
grant insert on table enquiries to anon;

-- Admin (any signed-in user): full write on every table.
-- (RLS policy "admins manage ..." already permits this for authenticated.)
grant insert, update, delete on all tables in schema public to authenticated;

-- Sequences — harmless even though our primary keys are UUIDs.
grant usage, select on all sequences in schema public to anon, authenticated;

-- Make any tables you add in future inherit the same access automatically.
alter default privileges in schema public
  grant select on tables to anon, authenticated;
alter default privileges in schema public
  grant insert, update, delete on tables to authenticated;
