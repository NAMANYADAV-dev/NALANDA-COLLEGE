'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { signIn, type LoginState } from './actions';

/**
 * LoginForm — email/password sign-in wired to the `signIn` Server Action via
 * useActionState. On success the action redirects to the dashboard; on failure
 * it returns an error message shown in the banner. Password visibility toggle
 * is local UI state.
 */
export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {});
  const [showPw, setShowPw] = useState(false);

  return (
    <form action={formAction} className="w-full max-w-[410px]">
      <h2 className="font-head text-[28px] font-bold text-navy dark:text-gold-hi">Welcome back</h2>
      <p className="mb-7 mt-2 text-[15px] text-muted">Sign in to the admin console to continue.</p>

      {state.error && (
        <div className="mb-[18px] flex items-center gap-2.5 rounded-lg border border-[#f3c2c2] bg-[#fdecec] px-3.5 py-2.5 text-[13.5px] font-medium text-[#a3282a]">
          <Icon name="close" size={16} className="flex-none" />
          {state.error}
        </div>
      )}

      {/* Email */}
      <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-text">
        Email address
      </label>
      <div className="relative mb-4">
        <Icon name="mail" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@nalandacollege.edu.in"
          className="h-12 w-full rounded-[9px] border-[1.5px] border-border bg-surface px-3.5 pl-[42px] text-[15px] text-text outline-none focus:border-navy"
        />
      </div>

      {/* Password */}
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor="password" className="text-[13px] font-semibold text-text">
          Password
        </label>
        <Link href="/admin/forgot-password" className="text-[12.5px] font-semibold text-gold hover:underline">
          Forgot password?
        </Link>
      </div>
      <div className="relative mb-5">
        <Icon name="lock" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="password"
          name="password"
          type={showPw ? 'text' : 'password'}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-12 w-full rounded-[9px] border-[1.5px] border-border bg-surface px-3.5 pl-[42px] pr-11 text-[15px] text-text outline-none focus:border-navy"
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          title="Show / hide password"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted hover:text-navy dark:hover:text-gold-hi"
        >
          <Icon name={showPw ? 'eye' : 'eye-off'} size={18} />
        </button>
      </div>

      <SubmitButton />

      <p className="mt-6 text-center text-[13px] text-muted">
        Admin accounts are managed in Supabase. Trouble signing in? Contact IT support.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[9px] bg-gold font-head text-base font-semibold text-white shadow-[0_8px_20px_rgba(184,134,43,.28)] hover:bg-gold-hover disabled:opacity-70"
    >
      {pending ? 'Signing in…' : 'Sign in'}
      {!pending && <Icon name="arrow-right" size={17} />}
    </button>
  );
}
