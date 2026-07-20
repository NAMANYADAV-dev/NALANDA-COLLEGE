import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Notice } from '@/types/database.types';
import { NOTICES_FALLBACK } from './data';

/** Notices & events data-access layer. */

/**
 * Latest published notices, pinned first then newest.
 * @param limit how many to return (home preview uses 4).
 */
export async function getLatestNotices(limit = 4): Promise<Notice[]> {
  if (!isSupabaseConfigured()) return NOTICES_FALLBACK.slice(0, limit);
  try {
    const supabase = createPublicSupabaseClient(); // no cookies → page stays cacheable
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[notices] read failed:', (err as Error).message);
    return [];
  }
}

/**
 * All notices including unpublished — for the admin list. No seed fallback:
 * the admin must see the true database state. Pinned first, then newest.
 */
export async function getAllNoticesAdmin(): Promise<Notice[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[notices] admin read failed:', (err as Error).message);
    return [];
  }
}

/** A single notice by id — used by the admin edit page. */
export async function getNoticeById(id: string): Promise<Notice | null> {
  if (!isSupabaseConfigured()) return NOTICES_FALLBACK.find((n) => n.id === id) ?? null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

/** All published notices & events, newest first — powers the Notices page. */
export async function getAllNotices(): Promise<Notice[]> {
  if (!isSupabaseConfigured()) return NOTICES_FALLBACK;
  try {
    const supabase = createPublicSupabaseClient(); // no cookies → page stays cacheable
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[notices] read failed:', (err as Error).message);
    return [];
  }
}
