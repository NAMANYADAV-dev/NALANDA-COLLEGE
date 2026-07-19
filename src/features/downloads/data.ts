import type { Download } from '@/types/database.types';

/** Static downloads fallback (mirrors supabase/seed.sql). */
export const DOWNLOADS_FALLBACK: Download[] = [
  { id: 'd1', name: 'Prospectus 2026–27', file_url: '#', file_type: 'PDF', size_label: '4.2 MB', category: null, sort_order: 1, is_published: true, created_at: '' },
  { id: 'd2', name: 'Fee structure', file_url: '#', file_type: 'PDF', size_label: '320 KB', category: null, sort_order: 2, is_published: true, created_at: '' },
  { id: 'd3', name: 'Syllabus (all courses)', file_url: '#', file_type: 'PDF', size_label: '2.1 MB', category: null, sort_order: 3, is_published: true, created_at: '' },
  { id: 'd4', name: 'Academic calendar', file_url: '#', file_type: 'PDF', size_label: '180 KB', category: null, sort_order: 4, is_published: true, created_at: '' },
];
