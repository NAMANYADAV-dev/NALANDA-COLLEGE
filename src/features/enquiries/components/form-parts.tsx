'use client';

import { useFormStatus } from 'react-dom';
import { cloneElement, isValidElement, useEffect, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';

/**
 * Move keyboard focus to the first field the server rejected.
 *
 * Native constraint validation (required / type / pattern) already focuses the
 * first invalid field before submit, but rules only the server can check —
 * format edge cases, the rate-limit cooldown — come back in `fieldErrors`.
 * Without this the visitor sees the red banner but has to hunt for which field
 * to fix. `order` lists the field ids top-to-bottom so focus lands on the
 * first one, matching reading order (WCAG 3.3.1 / 2.4.3).
 */
export function useFocusFirstError(
  status: string,
  fieldErrors: Partial<Record<string, string>> | undefined,
  order: readonly string[],
) {
  useEffect(() => {
    if (status !== 'error' || !fieldErrors) return;
    const first = order.find((id) => fieldErrors[id]);
    if (first) document.getElementById(first)?.focus();
  }, [status, fieldErrors, order]);
}

/** Shared input styling for text inputs, selects and textareas. */
export const fieldClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 text-[15px] text-text ' +
  'outline-none transition focus:border-navy focus:ring-4 focus:ring-navy/10 ' +
  'placeholder:text-muted/70';

/**
 * Field — label + required/optional marker + control slot + inline error.
 *
 * Pass `required` for a red asterisk or `optional` for a muted "(optional)"
 * tag. Say one or the other on every field: a field with neither reads as
 * required to some visitors and optional to others, which is how the
 * admissions form ended up rejecting submissions for an empty message that
 * looked optional.
 *
 * The error is wired to the control with `aria-describedby` + `aria-invalid`
 * (via cloneElement) so a screen reader announces it on focus instead of the
 * visitor hearing only a generic "please fix the highlighted fields".
 */
export function Field({
  label,
  htmlFor,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${htmlFor}-error`;

  // The caller always passes exactly one control element; annotate it in place
  // so each form doesn't have to repeat the ARIA wiring on every input.
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })
    : children;

  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-text">
        {label}{' '}
        {required && (
          <span className="text-[#b91c1c]" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {control}
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Honeypot — visually hidden field named "company". Bots fill it; the server
 * action treats any value as spam. Real users never see or tab into it.
 */
export function Honeypot() {
  return (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px]"
    />
  );
}

/**
 * SubmitButton — reads the parent <form>'s pending state via useFormStatus so
 * it can show a spinner and disable itself during submission. Must live inside
 * the <form> it submits.
 */
export function SubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'flex h-[50px] w-full items-center justify-center gap-2.5 rounded-md text-base font-semibold text-white transition-colors',
        pending ? 'cursor-default bg-gold-hover' : 'cursor-pointer bg-gold hover:bg-gold-hover',
      )}
    >
      {pending && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

/** SuccessPanel — confirmation shown after a successful submit. */
export function SuccessPanel({
  title,
  message,
  onReset,
  resetLabel,
  extra,
}: {
  title: string;
  message: string;
  onReset: () => void;
  resetLabel: string;
  extra?: ReactNode;
}) {
  return (
    <div className="px-2 py-6 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(46,139,87,.12)]">
        <Icon name="check" size={32} className="text-[#1b6e3d]" />
      </div>
      <h2 className="mb-2.5 font-head text-2xl font-semibold text-navy dark:text-gold-hi">{title}</h2>
      <p className="mx-auto mb-6 max-w-[44ch] text-base leading-relaxed text-muted">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {extra}
        <button
          onClick={onReset}
          className="rounded-md bg-gold px-6 py-3 text-[15px] font-semibold text-white hover:bg-gold-hover"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
