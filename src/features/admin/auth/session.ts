import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Server-side authentication Data Access Layer (DAL).
 *
 * This is the AUTHORITATIVE auth check for the admin area. Middleware provides a
 * fast redirect at the edge, but per Next.js security guidance auth must also be
 * verified close to the data/render — middleware alone is not a sufficient gate.
 * Enforcing it here means a protected Server Component never renders its markup
 * for an unauthenticated visitor, even if middleware is bypassed or misconfigured.
 */

/**
 * The current signed-in user, or null. Uses `getUser()` (not `getSession()`) so
 * the token is revalidated with Supabase — a stale/forged cookie won't pass.
 * Wrapped in React `cache()` so the layout, page and any helpers that call it in
 * the same render share a single network round-trip.
 */
export const getAuthenticatedUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    // Misconfigured env / network error → treat as unauthenticated (fail closed).
    return null;
  }
});

/**
 * Is the signed-in user actually on the admin allow-list?
 *
 * Being authenticated is NOT the same as being an admin — the `admins` table
 * (migration 0002) decides. This calls the same `is_admin()` function the RLS
 * policies use, so the UI and the database can never disagree about who is
 * allowed in.
 *
 * Fails closed: if the function is missing (migration not run yet) or the call
 * errors, we return false and the visitor lands on /admin/no-access, which
 * explains how to fix it. Locked out beats wide open.
 */
export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc('is_admin');
    if (error) throw error;
    return data === true;
  } catch (err) {
    console.warn('[auth] is_admin() check failed:', (err as Error).message);
    return false;
  }
});

/**
 * requireAdmin — gate a Server Component or Server Action behind a valid admin
 * session. Two distinct failures, two distinct destinations:
 *   - no session at all      → /admin/login
 *   - signed in, not an admin → /admin/no-access
 *
 * The second must NOT redirect to /admin/login: middleware bounces any
 * authenticated visitor off the login page to the dashboard, so that would be
 * an infinite loop. /admin/no-access is listed as a public admin route for
 * exactly this reason.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');
  if (!(await isCurrentUserAdmin())) redirect('/admin/no-access');
  return user;
}
