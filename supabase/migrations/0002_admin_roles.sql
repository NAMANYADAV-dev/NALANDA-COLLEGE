-- ============================================================================
-- 0002_admin_roles.sql — replace "any logged-in user is an admin" with a real
-- allow-list, and close the un-rate-limited enquiry insert path.
-- ============================================================================
-- WHY THIS EXISTS
--
-- 0001_init.sql granted every table to `authenticated` with `using (true)`:
--
--     create policy "admins manage courses" on courses
--       for all to authenticated using (true) with check (true);
--
-- That trusts *being signed in* as proof of being an admin. Supabase projects
-- ship with email sign-up ENABLED by default, so anyone could self-register and
-- then read, edit and delete the whole site. Authentication is not authorisation.
--
-- This migration introduces an explicit `admins` allow-list. A session only
-- counts as an admin if its user id is a row in that table.
--
-- ---------------------------------------------------------------------------
-- RUN ORDER (Supabase → SQL Editor):
--   1. Paste and run this whole file.
--   2. Run the "SEED THE FIRST ADMIN" block at the bottom with your own email.
--   3. Dashboard → Authentication → Providers → Email → turn OFF "Enable signup".
--      (Step 3 is defence in depth: even with signups on, a new account now has
--      no admin rights — but there is no reason to let strangers create them.)
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. The allow-list
-- ---------------------------------------------------------------------------
-- One row per staff member who may use the admin portal. Deleting the row
-- revokes access immediately — no need to delete the auth user.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  note       text,                    -- e.g. "Principal", "Office clerk"
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;


-- ---------------------------------------------------------------------------
-- 2. is_admin() — the single source of truth used by every policy
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so the check itself can read `admins` without the caller
-- needing SELECT on it (that would be circular). `stable` lets Postgres call it
-- once per statement instead of once per row. The pinned search_path stops a
-- malicious schema on the caller's path from shadowing `admins`.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Admins may see the allow-list (so the portal can show "who has access").
-- Nobody can modify it over the API — membership changes happen here in SQL or
-- with the service role key, which means a compromised admin session cannot
-- promote new admins or lock the others out.
drop policy if exists "admins read the allow-list" on public.admins;
create policy "admins read the allow-list"
  on public.admins for select to authenticated
  using (public.is_admin());

grant select on table public.admins to authenticated;


-- ---------------------------------------------------------------------------
-- 3. Swap every "any authenticated user" policy for an is_admin() check
-- ---------------------------------------------------------------------------
-- Public SELECT policies from 0001 are deliberately left untouched: anonymous
-- visitors still read rows where is_published = true.
drop policy if exists "admins manage courses"   on public.courses;
drop policy if exists "admins manage faculty"   on public.faculty;
drop policy if exists "admins manage notices"   on public.notices;
drop policy if exists "admins manage gallery"   on public.gallery_images;
drop policy if exists "admins manage downloads" on public.downloads;
drop policy if exists "admins manage enquiries" on public.enquiries;

create policy "admins manage courses"   on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage faculty"   on public.faculty
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage notices"   on public.notices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage gallery"   on public.gallery_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage downloads" on public.downloads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage enquiries" on public.enquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings ships in its own file (site_settings.sql) and may not exist yet.
do $$
begin
  if to_regclass('public.site_settings') is not null then
    execute 'drop policy if exists "admins manage settings" on public.site_settings';
    execute 'drop policy if exists "admins manage site_settings" on public.site_settings';
    execute 'create policy "admins manage site_settings" on public.site_settings
               for all to authenticated
               using (public.is_admin()) with check (public.is_admin())';
  end if;
end
$$;


-- ---------------------------------------------------------------------------
-- 4. Force every public enquiry through the rate-limited function
-- ---------------------------------------------------------------------------
-- 0001 let anon INSERT into `enquiries` directly. enquiry_cooldown.sql then
-- added submit_enquiry() to enforce one message per email per 30 minutes — but
-- the direct INSERT policy stayed, so a script could skip the function and spam
-- the table unthrottled. The app only ever calls the RPC, and that function is
-- SECURITY DEFINER (it writes with its owner's rights, so it does not need this
-- policy). Removing the direct path costs nothing and closes the bypass.
drop policy if exists "public submits enquiries" on public.enquiries;
revoke insert on table public.enquiries from anon;


-- ---------------------------------------------------------------------------
-- 5. Storage — same allow-list, not "any logged-in user"
-- ---------------------------------------------------------------------------
drop policy if exists "admins upload media" on storage.objects;
drop policy if exists "admins update media" on storage.objects;
drop policy if exists "admins delete media" on storage.objects;

create policy "admins upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('gallery', 'faculty', 'downloads') and public.is_admin());

create policy "admins update media"
  on storage.objects for update to authenticated
  using      (bucket_id in ('gallery', 'faculty', 'downloads') and public.is_admin())
  with check (bucket_id in ('gallery', 'faculty', 'downloads') and public.is_admin());

create policy "admins delete media"
  on storage.objects for delete to authenticated
  using (bucket_id in ('gallery', 'faculty', 'downloads') and public.is_admin());


-- ============================================================================
-- SEED THE FIRST ADMIN — run this separately, with your own email
-- ============================================================================
-- The account must already exist (Dashboard → Authentication → Users → Add user).
-- Until at least one row exists here, the portal will let you log in but every
-- write will be denied — that is the policy working, not a bug.
--
--   insert into public.admins (user_id, email, note)
--   select id, email, 'Principal'
--   from auth.users
--   where email = 'you@yourcollege.edu.in'
--   on conflict (user_id) do nothing;
--
-- Check who currently has access:
--   select email, note, created_at from public.admins order by created_at;
--
-- Revoke someone:
--   delete from public.admins where email = 'former.staff@yourcollege.edu.in';
-- ============================================================================
