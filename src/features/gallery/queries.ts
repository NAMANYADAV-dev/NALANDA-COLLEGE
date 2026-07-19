import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { GalleryImage } from '@/types/database.types';
import { GALLERY_FALLBACK } from './data';

/** Gallery data-access layer. */

/**
 * All published gallery images, in display order. Seed samples only when
 * Supabase isn't configured; otherwise the database exactly.
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return GALLERY_FALLBACK;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[gallery] read failed:', (err as Error).message);
    return [];
  }
}

/**
 * All images including unpublished — for the admin list. No seed fallback:
 * the admin must see the true database state.
 */
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[gallery] admin read failed:', (err as Error).message);
    return [];
  }
}

/** A single image by id — used by the admin edit page. */
export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  if (!isSupabaseConfigured()) return GALLERY_FALLBACK.find((g) => g.id === id) ?? null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('gallery_images').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
