-- ============================================================================
-- site_settings.sql — admin-editable global site settings (key-value)
-- ============================================================================
-- Powers the admin "Site settings" form: admission dates, contact details,
-- social links and the student-portal URLs. One row per setting key. Public may
-- READ (these values are all shown on the public site); only admins may write.
--
-- Until this runs, the app falls back to the hardcoded defaults in code, so the
-- site keeps working. Run once in Supabase → SQL Editor. Safe to re-run.
-- ============================================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Public read (dates, contact, links are all public info).
drop policy if exists "public reads settings" on public.site_settings;
create policy "public reads settings"
  on public.site_settings for select using (true);

-- Admins (any signed-in user) manage settings.
drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings"
  on public.site_settings for all to authenticated using (true) with check (true);

-- Table privileges for the API roles (RLS still governs access above).
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
