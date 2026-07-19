import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

/**
 * Server Supabase client (Server Components, Route Handlers, Server Actions).
 *
 * Reads/writes the auth session from the request cookies so RLS policies see
 * the logged-in admin. This is the DEFAULT client for the app — data fetching
 * happens on the server, close to the database, and never ships the query to
 * the browser.
 *
 * Note: in a pure Server Component render, cookie writes are not allowed, so we
 * swallow the write error (session refresh is handled in middleware instead).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — safe to ignore because
            // middleware.ts refreshes the session cookie on every request.
          }
        },
      },
    },
  );
}
