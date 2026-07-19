import type { Notice } from '@/types/database.types';

/** Static notices fallback (mirrors supabase/seed.sql). */
export const NOTICES_FALLBACK: Notice[] = [
  { id: 'n1', title: 'Semester examination schedule released', kind: 'notice', body: 'The datesheet for end-semester examinations is now available. Check your student portal for hall tickets.', location: null, published_at: '2026-07-18', is_pinned: true, is_published: true, created_at: '', updated_at: '' },
  { id: 'e1', title: 'Annual Sports Meet 2026 — registrations open', kind: 'event', body: 'Track, field and team events across departments. Register with your class coordinator.', location: 'Main Ground', published_at: '2026-07-15', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
  { id: 'n2', title: 'Admissions open for the 2026–27 session', kind: 'notice', body: 'Applications for all UG and PG programmes are now open. Submit an inquiry to begin.', location: null, published_at: '2026-07-10', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
  { id: 'e2', title: 'Guest lecture: Careers in Agri-tech', kind: 'event', body: 'An industry expert discusses emerging careers in agricultural technology.', location: 'Seminar Hall B', published_at: '2026-07-02', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
  { id: 'n3', title: 'Library timings extended during exams', kind: 'notice', body: 'The central library will remain open until 10 PM through the examination period.', location: null, published_at: '2026-06-28', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
  { id: 'e3', title: 'Cultural fest — Spandan 2026', kind: 'event', body: 'Two days of music, drama and art. All students welcome.', location: 'Auditorium', published_at: '2026-06-25', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
  { id: 'n4', title: 'Scholarship applications invited', kind: 'notice', body: 'Merit and means-based scholarship forms are available at the accounts office until month-end.', location: null, published_at: '2026-06-20', is_pinned: false, is_published: true, created_at: '', updated_at: '' },
];

/** Split an ISO/date string into a compact { day, month } for the date chip. */
export function formatNoticeDate(published_at: string): { day: string; month: string } {
  const d = new Date(published_at);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  };
}
