import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Download } from '@/types/database.types';
import { DOWNLOADS_FALLBACK } from './data';

/** Downloads data-access layer. */

/**
 * All published downloadable resources, in display order. Seed samples only
 * when Supabase isn't configured; otherwise the database exactly.
 */
export async function getDownloads(): Promise<Download[]> {
  if (!isSupabaseConfigured()) return DOWNLOADS_FALLBACK;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[downloads] read failed:', (err as Error).message);
    return [];
  }
}

/**
 * All resources including unpublished — for the admin list. No seed fallback:
 * the admin must see the true database state.
 */
export async function getAllDownloads(): Promise<Download[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[downloads] admin read failed:', (err as Error).message);
    return [];
  }
}

/** A single download by id — used by the admin edit page. */
export async function getDownloadById(id: string): Promise<Download | null> {
  if (!isSupabaseConfigured()) return DOWNLOADS_FALLBACK.find((d) => d.id === id) ?? null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('downloads').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
