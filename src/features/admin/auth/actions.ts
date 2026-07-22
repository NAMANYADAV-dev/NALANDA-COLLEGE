'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Best-effort client IP for login throttling. On Vercel the platform sets
 * `x-forwarded-for`; locally it's usually absent, so we fall back to a constant
 * (throttling still works, just bucketed together). Only the first hop matters.
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/** Result state consumed by the login form (via useActionState). */
export interface LoginState {
  error?: string;
}

/**
 * signIn — authenticate an admin with email + password (Supabase Auth).
 *
 * On success the session cookie is written by the server client and we redirect
 * to the dashboard; on failure we return an error message for the form to show.
 * Admin accounts are provisioned in the Supabase dashboard (or via invite) —
 * this app does not self-register users.
 */
export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  const supabase = await createServerSupabaseClient();
  const ip = await clientIp();

  // Throttle brute-force attempts by source IP. Fails open: if migration 0004
  // hasn't been applied the RPC errors and we simply skip the check.
  const { data: cooldown, error: throttleErr } = await supabase.rpc('login_cooldown_remaining', {
    p_ip: ip,
  });
  if (!throttleErr && typeof cooldown === 'number' && cooldown > 0) {
    return {
      error: `Too many failed attempts from this network. Try again in about ${cooldown} minute${
        cooldown === 1 ? '' : 's'
      }.`,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Count this failure toward the throttle (best-effort).
    await supabase.rpc('record_login_failure', { p_ip: ip });
    return { error: 'Invalid credentials. Please check your email and password.' };
  }

  // Clean slate for this IP on success.
  await supabase.rpc('clear_login_failures', { p_ip: ip });

  // Redirect throws internally — must be called outside any try/catch.
  redirect('/admin/dashboard');
}

/** signOut — end the session and return to the login screen. */
export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/** State for the "forgot password" request form. */
export interface ResetRequestState {
  status: 'idle' | 'sent' | 'error';
  message?: string;
}

/**
 * requestPasswordReset — email a recovery link to the given address.
 *
 * The link points at /auth/callback, which exchanges the recovery code for a
 * short-lived session and forwards to /admin/reset-password. We always return a
 * neutral "sent" result (never revealing whether the email is registered) and
 * log real failures server-side. Emails require SMTP configured in Supabase.
 */
export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { status: 'error', message: 'Enter your email address.' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
  });
  if (error) console.warn('[auth] password reset request failed:', error.message);

  // Neutral response — don't disclose account existence.
  return { status: 'sent' };
}

/** State for the "set a new password" form. */
export interface UpdatePasswordState {
  error?: string;
}

/**
 * updatePassword — set a new password for the recovery session established by
 * the reset link. Requires the temporary session from /auth/callback; if it has
 * expired, Supabase returns an error which we surface to the user.
 */
export async function updatePassword(
  _prev: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirm) return { error: 'The two passwords do not match.' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: 'Could not update your password — the reset link may have expired.' };
  }

  redirect('/admin/dashboard');
}
