import type { GalleryImage } from '@/types/database.types';

/**
 * Static gallery fallback (mirrors supabase/seed.sql).
 *
 * Until real photos are uploaded to Supabase Storage, `image_url` is a '#'
 * placeholder and the UI renders a captioned gradient tile instead. When a row
 * has a real URL, the component shows the actual image.
 */
export const GALLERY_FALLBACK: GalleryImage[] = [
  { id: 'g1', title: 'Convocation 2025', image_url: '#', category: 'Events', sort_order: 1, is_published: true, created_at: '' },
  { id: 'g2', title: 'Central library', image_url: '#', category: 'Campus', sort_order: 2, is_published: true, created_at: '' },
  { id: 'g3', title: 'Science laboratory', image_url: '#', category: 'Academics', sort_order: 3, is_published: true, created_at: '' },
  { id: 'g4', title: 'Annual sports meet', image_url: '#', category: 'Events', sort_order: 4, is_published: true, created_at: '' },
  { id: 'g5', title: 'Cultural fest — Spandan', image_url: '#', category: 'Events', sort_order: 5, is_published: true, created_at: '' },
  { id: 'g6', title: 'Campus green', image_url: '#', category: 'Campus', sort_order: 6, is_published: true, created_at: '' },
  { id: 'g7', title: 'Moot court session', image_url: '#', category: 'Academics', sort_order: 7, is_published: true, created_at: '' },
  { id: 'g8', title: 'Agriculture field visit', image_url: '#', category: 'Academics', sort_order: 8, is_published: true, created_at: '' },
  { id: 'g9', title: 'Guest lecture series', image_url: '#', category: 'Academics', sort_order: 9, is_published: true, created_at: '' },
];

/**
 * Deterministic gradient + tile height for a placeholder image, derived from
 * its index so the masonry layout looks varied but stays stable between renders.
 */
const GRADIENTS = [
  'linear-gradient(135deg,#1B3A6B,#2f5a97)',
  'linear-gradient(135deg,#12294D,#1B3A6B)',
  'linear-gradient(135deg,#2E8B57,#1f6b41)',
  'linear-gradient(135deg,#B8862B,#8f6620)',
  'linear-gradient(135deg,#1B3A6B,#12294D)',
  'linear-gradient(135deg,#2f5a97,#1B3A6B)',
];
const HEIGHTS = [240, 190, 270, 200, 250, 180, 230, 260, 200];

export function tileGradient(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}
export function tileHeight(index: number): number {
  return HEIGHTS[index % HEIGHTS.length];
}
/** True when the row has a real uploaded image rather than a placeholder. */
export function hasRealImage(url: string): boolean {
  return !!url && url !== '#';
}
