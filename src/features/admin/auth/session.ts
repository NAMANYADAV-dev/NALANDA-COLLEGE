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
 * requireAdmin — gate a Server Component or Server Action behind a valid admin
 * session. Redirects to the login page when there is none (so nothing protected
 * renders or runs), and returns the user for authorised callers.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');
  return user;
}
