import type { Faculty } from '@/types/database.types';

/** Static faculty fallback (mirrors supabase/seed.sql). */
export const FACULTY_FALLBACK: Faculty[] = [
  { id: 'f1', name: 'Dr. Anjali Verma', designation: 'Professor & Head', department: 'Arts', qualification: 'Ph.D. English Literature', email: null, photo_url: null, bio: null, sort_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'f2', name: 'Dr. Rahul Mehta', designation: 'Associate Professor', department: 'Arts', qualification: 'Ph.D. History', email: null, photo_url: null, bio: null, sort_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'f3', name: 'Dr. Sunita Rao', designation: 'Professor', department: 'Science', qualification: 'Ph.D. Physics', email: null, photo_url: null, bio: null, sort_order: 3, is_published: true, created_at: '', updated_at: '' },
  { id: 'f4', name: 'Dr. Vikram Singh', designation: 'Assistant Professor', department: 'Science', qualification: 'Ph.D. Chemistry', email: null, photo_url: null, bio: null, sort_order: 4, is_published: true, created_at: '', updated_at: '' },
  { id: 'f5', name: 'Adv. Meera Nair', designation: 'Professor & Head', department: 'Law', qualification: 'LL.M., NET', email: null, photo_url: null, bio: null, sort_order: 5, is_published: true, created_at: '', updated_at: '' },
  { id: 'f6', name: 'Dr. Arjun Patel', designation: 'Associate Professor', department: 'Law', qualification: 'Ph.D. Constitutional Law', email: null, photo_url: null, bio: null, sort_order: 6, is_published: true, created_at: '', updated_at: '' },
  { id: 'f7', name: 'Dr. Kavita Joshi', designation: 'Professor', department: 'Agriculture', qualification: 'Ph.D. Agronomy', email: null, photo_url: null, bio: null, sort_order: 7, is_published: true, created_at: '', updated_at: '' },
  { id: 'f8', name: 'Dr. Sanjay Kumar', designation: 'Assistant Professor', department: 'Agriculture', qualification: 'Ph.D. Horticulture', email: null, photo_url: null, bio: null, sort_order: 8, is_published: true, created_at: '', updated_at: '' },
];

/** Departments used by the faculty directory filter (order matters for the UI). */
export const FACULTY_DEPARTMENTS = ['Arts', 'Science', 'Law', 'Agriculture'] as const;

/** Brand colour used for a department's avatar banner. */
export function departmentColor(department: string): string {
  const map: Record<string, string> = {
    Arts: '#1B3A6B',
    Science: '#1b6e3d',
    Law: '#12294D',
    Agriculture: '#8f6519',
  };
  return map[department] ?? '#1B3A6B';
}

/** Initials from a name, dropping honorifics like "Dr." / "Adv.". */
export function facultyInitials(name: string): string {
  return name
    .replace(/^(Dr\.|Adv\.|Prof\.)\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
