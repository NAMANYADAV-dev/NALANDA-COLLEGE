'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

/**
 * Browser Supabase client (Client Components only).
 *
 * Uses the public anon key — all access is constrained by Row Level Security.
 * Prefer Server Components + `createServerSupabaseClient` for reads; reach for
 * this only when you genuinely need client-side data (realtime, optimistic UI,
 * interactive filters). It is safe to call on every render: @supabase/ssr
 * returns a memoized singleton per browser context.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
