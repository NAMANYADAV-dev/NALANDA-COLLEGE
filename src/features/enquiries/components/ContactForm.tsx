'use client';

import { useActionState } from 'react';
import { submitEnquiry } from '@/features/enquiries/actions';
import { INITIAL_ENQUIRY_STATE } from '@/features/enquiries/schema';
import { Field, Honeypot, SubmitButton, SuccessPanel, fieldClass, useFocusFirstError } from './form-parts';

/** Field ids top-to-bottom — drives focus-first-error on a server rejection. */
const FIELD_ORDER = ['name', 'email', 'subject', 'message'] as const;

/**
 * ContactForm — general "Send us a message" form (Contact page).
 *
 * Client Component wired to the `submitEnquiry` Server Action through
 * `useActionState`: the browser posts FormData to the server, the action
 * validates + inserts into Supabase, and the returned state drives either the
 * success panel or inline field errors — with no client-side fetch code.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, INITIAL_ENQUIRY_STATE);
  useFocusFirstError(state.status, state.fieldErrors, FIELD_ORDER);

  if (state.status === 'success') {
    return (
      <SuccessPanel
        title="Message sent"
        message="Thanks for reaching out — we'll reply within 48 hours."
        onReset={() => window.location.reload()}
        resetLabel="Send another"
      />
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      {/* Applies the contact rules server-side: message required, phone and
          subject optional. See EnquiryVariant in ../schema.ts. */}
      <input type="hidden" name="variant" value="contact" />

      <h2 className="font-head text-[22px] font-semibold text-navy dark:text-gold-hi">
        Send us a message
      </h2>

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]"
        >
          {state.message}
        </p>
      )}

      <Field label="Name" htmlFor="name" required error={state.fieldErrors?.name}>
        <input id="name" name="name" required defaultValue={state.values?.name ?? ''} placeholder="Your name" className={`${fieldClass} h-[46px]`} />
      </Field>

      <Field label="Email" htmlFor="email" required error={state.fieldErrors?.email}>
        <input id="email" name="email" type="email" required defaultValue={state.values?.email ?? ''} placeholder="you@example.com" className={`${fieldClass} h-[46px]`} />
      </Field>

      <Field label="Subject" htmlFor="subject" optional error={state.fieldErrors?.subject}>
        <input id="subject" name="subject" defaultValue={state.values?.subject ?? ''} placeholder="What is this about?" className={`${fieldClass} h-[46px]`} />
      </Field>

      <Field label="Message" htmlFor="message" required error={state.fieldErrors?.message}>
        <textarea id="message" name="message" required defaultValue={state.values?.message ?? ''} placeholder="How can we help?" className={`${fieldClass} min-h-[120px] resize-y py-3`} />
      </Field>

      <Honeypot />
      <SubmitButton idleLabel="Send message" pendingLabel="Sending…" />
    </form>
  );
}
