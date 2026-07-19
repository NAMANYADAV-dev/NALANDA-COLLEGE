import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth/session';

/** Aggregate counts shown on the dashboard + sidebar badge. */
export interface DashboardMetrics {
  courses: number;
  faculty: number;
  notices: number;
  gallery: number;
  downloads: number;
  enquiriesNew: number;
  enquiriesTotal: number;
}

/** Signed-in admin summary for the sidebar / topbar. */
export interface AdminProfile {
  email: string;
  initials: string;
}

/** Efficient exact row count for a table (optionally filtered by status). */
async function countRows(
  table: 'courses' | 'faculty' | 'notices' | 'gallery_images' | 'downloads' | 'enquiries',
  filter?: { column: string; value: string },
): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) query = query.eq(filter.column, filter.value);
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Fetch all dashboard counts in parallel. */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [courses, faculty, notices, gallery, downloads, enquiriesNew, enquiriesTotal] =
    await Promise.all([
      countRows('courses'),
      countRows('faculty'),
      countRows('notices'),
      countRows('gallery_images'),
      countRows('downloads'),
      countRows('enquiries', { column: 'status', value: 'new' }),
      countRows('enquiries'),
    ]);

  return { courses, faculty, notices, gallery, downloads, enquiriesNew, enquiriesTotal };
}

/** Read the current admin's identity from the session (shares the cached user). */
export async function getAdminProfile(): Promise<AdminProfile> {
  const user = await getAuthenticatedUser();
  const email = user?.email ?? 'admin@nalandacollege.edu.in';
  const initials = email.slice(0, 2).toUpperCase();
  return { email, initials };
}
