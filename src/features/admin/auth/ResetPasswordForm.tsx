'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { updatePassword, type UpdatePasswordState } from './actions';

/**
 * ResetPasswordForm — set a new password using the recovery session created by
 * the emailed link (exchanged in /auth/callback). `linkError` is passed from the
 * page when the callback reported an invalid/expired code.
 */
export function ResetPasswordForm({ linkError = false }: { linkError?: boolean }) {
  const [state, formAction] = useActionState<UpdatePasswordState, FormData>(updatePassword, {});
  const [show, setShow] = useState(false);

  const error = state.error ?? (linkError ? 'This reset link is invalid or has expired. Request a new one.' : undefined);

  return (
    <form action={formAction} className="w-full max-w-[410px]">
      <h2 className="font-head text-[28px] font-bold text-navy dark:text-gold-hi">Set a new password</h2>
      <p className="mb-7 mt-2 text-[15px] text-muted">Choose a strong password you don&apos;t use elsewhere.</p>

      {error && (
        <div className="mb-[18px] flex items-center gap-2.5 rounded-lg border border-[#f3c2c2] bg-[#fdecec] px-3.5 py-2.5 text-[13.5px] font-medium text-[#a3282a]">
          <Icon name="close" size={16} className="flex-none" />
          {error}
        </div>
      )}

      {/* New password */}
      <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-text">
        New password
      </label>
      <div className="relative mb-4">
        <Icon name="lock" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="password"
          name="password"
          type={show ? 'text' : 'password'}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="h-12 w-full rounded-[9px] border-[1.5px] border-border bg-surface px-3.5 pl-[42px] pr-11 text-[15px] text-text outline-none focus:border-navy"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          title="Show / hide password"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted hover:text-navy dark:hover:text-gold-hi"
        >
          <Icon name={show ? 'eye' : 'eye-off'} size={18} />
        </button>
      </div>

      {/* Confirm */}
      <label htmlFor="confirm" className="mb-1.5 block text-[13px] font-semibold text-text">
        Confirm password
      </label>
      <div className="relative mb-5">
        <Icon name="lock" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="confirm"
          name="confirm"
          type={show ? 'text' : 'password'}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="h-12 w-full rounded-[9px] border-[1.5px] border-border bg-surface px-3.5 pl-[42px] text-[15px] text-text outline-none focus:border-navy"
        />
      </div>

      <SubmitButton />
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
      {pending ? 'Updating…' : 'Update password'}
    </button>
  );
}
