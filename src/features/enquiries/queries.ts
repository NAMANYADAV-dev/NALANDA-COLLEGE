import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Enquiry, EnquiryStatus } from '@/types/database.types';

/**
 * Enquiries data-access (admin side).
 *
 * These read the leads submitted through the public forms. RLS only lets
 * authenticated admins select from `enquiries`, so an unauthenticated call
 * returns nothing — the UI shows an empty state rather than erroring.
 */

/** All enquiries, newest first, optionally filtered by status. */
export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn('[enquiries] read failed:', (err as Error).message);
    return [];
  }
}

/** The most recent N enquiries — used by the dashboard. */
export async function getRecentEnquiries(limit = 5): Promise<Enquiry[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}
