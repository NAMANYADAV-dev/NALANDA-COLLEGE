'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { requestPasswordReset, type ResetRequestState } from './actions';

const INITIAL: ResetRequestState = { status: 'idle' };

/**
 * ForgotPasswordForm — request a password-reset email. On submit we always show
 * a neutral confirmation (whether or not the address is registered) to avoid
 * leaking which emails have accounts.
 */
export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, INITIAL);

  if (state.status === 'sent') {
    return (
      <div className="w-full max-w-[410px] text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(46,139,87,.12)]">
          <Icon name="mail" size={30} className="text-[#2E8B57]" />
        </div>
        <h2 className="font-head text-[24px] font-bold text-navy dark:text-gold-hi">Check your email</h2>
        <p className="mx-auto mb-6 mt-2 max-w-[38ch] text-[15px] leading-relaxed text-muted">
          If an account exists for that address, we&apos;ve sent a link to reset your password. It
          expires in 60 minutes.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold dark:text-gold-hi"
        >
          <Icon name="chevron-left" size={16} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-[410px]">
      <h2 className="font-head text-[28px] font-bold text-navy dark:text-gold-hi">Forgot password?</h2>
      <p className="mb-7 mt-2 text-[15px] text-muted">
        Enter your admin email and we&apos;ll send you a reset link.
      </p>

      {state.status === 'error' && state.message && (
        <div className="mb-[18px] flex items-center gap-2.5 rounded-lg border border-[#f3c2c2] bg-[#fdecec] px-3.5 py-2.5 text-[13.5px] font-medium text-[#a3282a]">
          <Icon name="close" size={16} className="flex-none" />
          {state.message}
        </div>
      )}

      <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-text">
        Email address
      </label>
      <div className="relative mb-5">
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

      <SubmitButton />

      <Link
        href="/admin/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-muted hover:text-navy dark:hover:text-gold-hi"
      >
        <Icon name="chevron-left" size={16} /> Back to sign in
      </Link>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[50px] w-full rounded-[9px] bg-gold font-head text-base font-semibold text-white shadow-[0_8px_20px_rgba(184,134,43,.28)] hover:bg-gold-hover disabled:opacity-70"
    >
      {pending ? 'Sending…' : 'Send reset link'}
    </button>
  );
}
