import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Course } from '@/types/database.types';
import { COURSES_FALLBACK } from './data';
import { slugify } from './slug';

/**
 * Guarantee a usable slug even if migration 0003 hasn't been applied yet.
 *
 * Without this, every course link renders as /courses/undefined between
 * deploying the code and running the SQL. The derived value matches what the
 * migration's backfill produces, so URLs don't move once it is applied — this
 * is a bridge, not a second source of truth.
 */
function ensureSlug(course: Course): Course {
  if (course.slug) return course;
  return { ...course, slug: slugify(course.name) || `course-${course.id.slice(0, 8)}` };
}

/**
 * Course data-access layer.
 *
 * `server-only` guarantees these never bundle into client code. All Supabase
 * reads for courses funnel through here, so UI components stay free of query
 * logic (separation of concerns). Each function degrades gracefully to seed
 * data if the database is unreachable or empty, so the site renders before the
 * backend is provisioned.
 */

/**
 * All published courses, ordered for display. Returns seed samples only when
 * Supabase isn't configured; once it is, returns the database exactly (an empty
 * table yields an empty list, never the samples).
 */
export async function getPublishedCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return COURSES_FALLBACK;
  try {
    const supabase = createPublicSupabaseClient(); // no cookies → page stays cacheable
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(ensureSlug);
  } catch (err) {
    console.warn('[courses] read failed:', (err as Error).message);
    return [];
  }
}

/**
 * All courses including unpublished — for the admin list. No seed fallback:
 * the admin must see the true database state (empty until Supabase is seeded).
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[courses] admin read failed:', (err as Error).message);
    return [];
  }
}

/** A single course by id — used by the admin edit form. */
export async function getCourseById(id: string): Promise<Course | null> {
  if (!isSupabaseConfigured()) return COURSES_FALLBACK.find((c) => c.id === id) ?? null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

/**
 * A single PUBLISHED course by slug — backs the public /courses/[slug] page.
 *
 * Uses the cookie-free client so the page stays statically renderable, and
 * filters on is_published so an unpublished course 404s for visitors instead of
 * leaking a draft to anyone who guesses the URL.
 *
 * `maybeSingle()` (not `single()`) because "no such course" is an ordinary
 * outcome here — a stale link or a typo — not a database error worth logging.
 */
export async function getPublishedCourseBySlug(slug: string): Promise<Course | null> {
  if (!isSupabaseConfigured()) {
    return COURSES_FALLBACK.find((c) => c.slug === slug) ?? null;
  }
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data ? ensureSlug(data) : null;
  } catch (err) {
    // Most likely cause: migration 0003 hasn't run, so there is no slug column
    // to filter on and Postgres rejects the query outright. Fall back to
    // matching against the derived slugs so course pages still resolve.
    console.warn('[courses] slug read failed, falling back to scan:', (err as Error).message);
    const all = await getPublishedCourses();
    return all.find((c) => c.slug === slug) ?? null;
  }
}

/**
 * Slugs of every published course — feeds generateStaticParams() so each course
 * page is prerendered at build time, and the sitemap.
 */
export async function getPublishedCourseSlugs(): Promise<string[]> {
  const courses = await getPublishedCourses();
  return courses.map((c) => c.slug).filter(Boolean);
}
