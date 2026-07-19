import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /auth/callback — completes Supabase email flows (password recovery,
 * magic links, invites).
 *
 * The emailed link arrives here with a `?code=…`; we exchange it for a session
 * (cookies set by the server client) and then forward to `next` — for password
 * recovery that's /admin/reset-password, where the user sets a new password.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Invalid/expired code — send them to reset with a hint.
      return NextResponse.redirect(`${origin}/admin/reset-password?error=link`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
