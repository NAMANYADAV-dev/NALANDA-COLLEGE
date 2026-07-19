-- ============================================================================
-- 0001_init.sql — Nalanda College initial schema
-- ============================================================================
-- Content model behind the public site + admin portal.
--
-- Security model (Row Level Security):
--   * Public (anon) can READ only rows flagged is_published = true.
--   * Public (anon) can INSERT into `enquiries` (the contact form) — nothing else.
--   * Authenticated staff (admins) get full read/write on everything.
-- Every table has RLS enabled; policies are defined at the bottom.
-- ============================================================================

-- Enable UUID generation.
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type course_level as enum ('UG', 'PG');
create type notice_kind as enum ('notice', 'event');
create type enquiry_status as enum ('new', 'read', 'resolved');

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at current on every UPDATE.
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- courses  (academic programmes / "streams" on the home page)
-- ---------------------------------------------------------------------------
create table courses (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  level        course_level not null,
  duration     text not null,
  tagline      text not null,
  about        text not null,
  seats        integer not null default 0,
  fee          text not null,
  subjects     text[] not null default '{}',
  eligibility  text not null,
  careers      text[] not null default '{}',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index courses_published_idx on courses (is_published, sort_order);
create trigger courses_set_updated_at before update on courses
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- faculty
-- ---------------------------------------------------------------------------
create table faculty (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  designation   text not null,
  department    text not null,
  qualification text,
  email         text,
  photo_url     text,
  bio           text,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index faculty_published_idx on faculty (is_published, sort_order);
create trigger faculty_set_updated_at before update on faculty
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- notices  (notices & events feed)
-- ---------------------------------------------------------------------------
create table notices (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  kind         notice_kind not null default 'notice',
  body         text,
  location     text,               -- for events (e.g. "Main Ground"); null for notices
  published_at timestamptz not null default now(),
  is_pinned    boolean not null default false,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index notices_feed_idx on notices (is_published, is_pinned desc, published_at desc);
create trigger notices_set_updated_at before update on notices
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------------
create table gallery_images (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  image_url    text not null,
  category     text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);
create index gallery_published_idx on gallery_images (is_published, sort_order);

-- ---------------------------------------------------------------------------
-- downloads  (prospectus, fee structure, syllabus, ...)
-- ---------------------------------------------------------------------------
create table downloads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  file_url     text not null,
  file_type    text not null default 'PDF',
  size_label   text,
  category     text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);
create index downloads_published_idx on downloads (is_published, sort_order);

-- ---------------------------------------------------------------------------
-- enquiries  (contact-form submissions — write-only for the public)
-- ---------------------------------------------------------------------------
create table enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  status     enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);
create index enquiries_status_idx on enquiries (status, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table courses        enable row level security;
alter table faculty        enable row level security;
alter table notices        enable row level security;
alter table gallery_images enable row level security;
alter table downloads      enable row level security;
alter table enquiries      enable row level security;

-- Public read of published content ------------------------------------------
create policy "public reads published courses"
  on courses for select using (is_published = true);
create policy "public reads published faculty"
  on faculty for select using (is_published = true);
create policy "public reads published notices"
  on notices for select using (is_published = true);
create policy "public reads published gallery"
  on gallery_images for select using (is_published = true);
create policy "public reads published downloads"
  on downloads for select using (is_published = true);

-- Public may submit an enquiry (insert only, no read) ------------------------
create policy "public submits enquiries"
  on enquiries for insert with check (true);

-- Authenticated admins: full access on every table --------------------------
-- (Tighten to a role/claim check if you add non-admin authenticated users.)
create policy "admins manage courses"        on courses        for all to authenticated using (true) with check (true);
create policy "admins manage faculty"        on faculty        for all to authenticated using (true) with check (true);
create policy "admins manage notices"        on notices        for all to authenticated using (true) with check (true);
create policy "admins manage gallery"        on gallery_images for all to authenticated using (true) with check (true);
create policy "admins manage downloads"      on downloads      for all to authenticated using (true) with check (true);
create policy "admins manage enquiries"      on enquiries      for all to authenticated using (true) with check (true);
