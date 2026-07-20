import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Faculty } from '@/types/database.types';
import { FACULTY_FALLBACK } from './data';

/** Faculty data-access layer. */

/**
 * All published faculty members, in display order. Seed samples only when
 * Supabase isn't configured; otherwise the database exactly.
 */
export async function getPublishedFaculty(): Promise<Faculty[]> {
  if (!isSupabaseConfigured()) return FACULTY_FALLBACK;
  try {
    const supabase = createPublicSupabaseClient(); // no cookies → page stays cacheable
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[faculty] read failed:', (err as Error).message);
    return [];
  }
}

/**
 * All faculty including unpublished — for the admin list. No seed fallback:
 * the admin must see the true database state (empty until Supabase is seeded).
 */
export async function getAllFaculty(): Promise<Faculty[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[faculty] admin read failed:', (err as Error).message);
    return [];
  }
}

/** A single faculty member by id — used by the admin edit page. */
export async function getFacultyById(id: string): Promise<Faculty | null> {
  if (!isSupabaseConfigured()) return FACULTY_FALLBACK.find((f) => f.id === id) ?? null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('faculty').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
