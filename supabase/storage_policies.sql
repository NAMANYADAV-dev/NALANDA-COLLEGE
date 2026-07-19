-- ============================================================================
-- storage_policies.sql — Supabase Storage access rules for file uploads
-- ============================================================================
-- Run this ONCE in Supabase → SQL Editor after creating the three buckets
-- (gallery, faculty, downloads). It lets a logged-in admin upload / replace /
-- delete files in those buckets; the public can only READ (the buckets are
-- already marked Public, which serves the files over their public URLs).
--
-- Security model:
--   * Public (anon)          → read only (via the buckets' Public flag).
--   * Authenticated (admin)  → insert / update / delete in our three buckets.
--   * No other bucket is affected by these policies.
-- ============================================================================

-- Supabase enables RLS on storage.objects by default; these policies grant the
-- admin the write access the upload UI needs. `bucket_id` restricts each policy
-- to only the buckets this app manages.

create policy "admins upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('gallery', 'faculty', 'downloads'));

create policy "admins update media"
  on storage.objects for update to authenticated
  using (bucket_id in ('gallery', 'faculty', 'downloads'))
  with check (bucket_id in ('gallery', 'faculty', 'downloads'));

create policy "admins delete media"
  on storage.objects for delete to authenticated
  using (bucket_id in ('gallery', 'faculty', 'downloads'));

-- Public read is provided by each bucket's "Public" setting. If you prefer an
-- explicit read policy instead of the Public flag, uncomment this:
--
-- create policy "public reads media"
--   on storage.objects for select to public
--   using (bucket_id in ('gallery', 'faculty', 'downloads'));
