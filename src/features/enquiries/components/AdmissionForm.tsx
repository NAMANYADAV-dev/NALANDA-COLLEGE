'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { submitEnquiry } from '@/features/enquiries/actions';
import { INITIAL_ENQUIRY_STATE } from '@/features/enquiries/schema';
import { Field, Honeypot, SubmitButton, SuccessPanel, fieldClass } from './form-parts';

/**
 * AdmissionForm — admission inquiry form (Admissions page).
 *
 * Same Server Action as ContactForm, but collects phone and a course of
 * interest (posted as `subject`). The course list is passed in from the server
 * so the <select> stays in sync with the live catalogue.
 *
 * The hidden `variant` field tells the action to apply the admission rules:
 * phone and course required, message optional. Every field that the validator
 * can reject binds `error` below — without that, a rejection shows the banner
 * with nothing highlighted and the form looks broken.
 */
export function AdmissionForm({ courses }: { courses: string[] }) {
  const [state, formAction] = useActionState(submitEnquiry, INITIAL_ENQUIRY_STATE);

  if (state.status === 'success') {
    return (
      <SuccessPanel
        title="Thank you — inquiry received"
        message="Our admissions team will reach out within 48 hours. A confirmation has been noted against your details."
        onReset={() => window.location.reload()}
        resetLabel="Submit another"
        extra={
          <Link
            href="/"
            className="rounded-md border-[1.5px] border-navy px-6 py-3 text-[15px] font-semibold text-navy hover:bg-section-alt dark:border-gold-hi dark:text-gold-hi"
          >
            Back to home
          </Link>
        }
      />
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <input type="hidden" name="variant" value="admission" />

      <div>
        <h2 className="font-head text-2xl font-semibold text-navy dark:text-gold-hi">Admission inquiry</h2>
        <p className="mt-1.5 text-[15px] text-muted">
          Fields marked <span className="text-[#b91c1c]">*</span> are required.
        </p>
      </div>

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]"
        >
          {state.message}
        </p>
      )}

      <Field label="Full name" htmlFor="name" required error={state.fieldErrors?.name}>
        <input id="name" name="name" defaultValue={state.values?.name ?? ''} placeholder="e.g. Priya Sharma" className={`${fieldClass} h-[46px]`} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required error={state.fieldErrors?.email}>
          <input id="email" name="email" type="email" defaultValue={state.values?.email ?? ''} placeholder="you@example.com" className={`${fieldClass} h-[46px]`} />
        </Field>
        <Field label="Phone" htmlFor="phone" required error={state.fieldErrors?.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={state.values?.phone ?? ''}
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="10-digit mobile"
            // Keep it digits-only and capped at 10 as the user types (letters
            // and symbols are stripped immediately); server re-checks too.
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
            }}
            className={`${fieldClass} h-[46px]`}
          />
        </Field>
      </div>

      <Field
        label="Course of interest"
        htmlFor="subject"
        required
        error={state.fieldErrors?.subject}
      >
        <select
          id="subject"
          name="subject"
          defaultValue={state.values?.subject ?? ''}
          className={`${fieldClass} h-[46px]`}
        >
          <option value="" disabled>
            Select a course…
          </option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message" optional error={state.fieldErrors?.message}>
        <textarea id="message" name="message" defaultValue={state.values?.message ?? ''} placeholder="Tell us what you'd like to know…" className={`${fieldClass} min-h-[110px] resize-y py-3`} />
      </Field>

      <Honeypot />
      <SubmitButton idleLabel="Submit inquiry" pendingLabel="Submitting…" />
      <p className="text-center text-[13px] text-muted">We&apos;ll get back to you within 48 hours.</p>
    </form>
  );
}
