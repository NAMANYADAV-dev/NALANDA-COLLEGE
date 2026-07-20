import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Course } from '@/types/database.types';
import { COURSES_FALLBACK } from './data';

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
    return data ?? [];
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

/** A single course by id — used by the course detail page/modal. */
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
