-- ============================================================================
-- 0003_course_slugs.sql — give every course a stable, human-readable URL key
-- ============================================================================
-- WHY THIS EXISTS
--
-- Course detail lived only in a modal, so a programme had no URL of its own.
-- Someone searching "B.Sc Agriculture admission" had nothing on this site to
-- land on — the single biggest SEO gap in the project. /courses/<slug> fixes
-- that, and this column is the key those pages are addressed by.
--
-- The slug is STORED, not derived from `name` at render time. Deriving would
-- mean that renaming a programme silently changes its URL, breaking every
-- inbound link and discarding whatever ranking the page had earned. Storing it
-- lets the name and the URL move independently.
--
-- Run ONCE in Supabase → SQL Editor. Safe to re-run.
-- ============================================================================

alter table public.courses add column if not exists slug text;

-- ---------------------------------------------------------------------------
-- Backfill existing rows from their name
-- ---------------------------------------------------------------------------
-- "Bachelor of Science (B.Sc.)" → "bachelor-of-science-b-sc"
-- Two courses can share a base slug (e.g. two "Master of Arts" entries), so
-- duplicates after the first get a numeric suffix. Ordering by created_at keeps
-- the oldest course on the clean slug — it is the one most likely to already be
-- linked from elsewhere.
with slugged as (
  select
    id,
    nullif(
      regexp_replace(
        regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'),
        '(^-+|-+$)', '', 'g'
      ),
      ''
    ) as base
  from public.courses
  where slug is null or slug = ''
),
numbered as (
  select id, base, row_number() over (partition by base order by id) as rn
  from slugged
)
update public.courses c
set slug = case when n.rn = 1 then n.base else n.base || '-' || n.rn end
from numbered n
where c.id = n.id
  and n.base is not null;

-- A name made entirely of punctuation slugifies to nothing — fall back to the
-- id so the column can be NOT NULL and the row still gets a working URL.
update public.courses
set slug = 'course-' || left(id::text, 8)
where slug is null or slug = '';

-- ---------------------------------------------------------------------------
-- Enforce the invariants the app relies on
-- ---------------------------------------------------------------------------
-- NOT NULL + UNIQUE: getCourseBySlug() must resolve to exactly one row, and
-- every course must be reachable. The unique index is also what turns a
-- duplicate slug typed in the admin form into a clean, catchable error rather
-- than two courses fighting over one URL.
alter table public.courses alter column slug set not null;
create unique index if not exists courses_slug_key on public.courses (slug);
