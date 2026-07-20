import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Public (anonymous) Supabase client — for PUBLIC page reads only.
 *
 * Deliberately does NOT touch cookies. The cookie-based server client opts a
 * route into dynamic rendering (it reads the request), which meant every public
 * page was server-rendered on each navigation — the cause of the "wait, then
 * the page snaps in" feel. Public content needs no session (RLS lets `anon`
 * read published rows), so reading it through this client lets Next.js
 * pre-render and cache those pages, making navigation near-instant.
 *
 * Freshness is preserved by the admin actions, which already call
 * `revalidatePath('/', 'layout')` after every change.
 *
 * NOTE: admin queries must keep using `createServerSupabaseClient()` — they
 * need the signed-in session to read unpublished rows and to write.
 */
export function createPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
