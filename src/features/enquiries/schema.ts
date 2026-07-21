import type { EnquiryStatus } from '@/types/database.types';

/**
 * Enquiry validation — framework-agnostic so it can be unit-tested and reused
 * by both the Contact and Admissions forms. Kept dependency-free (no zod) to
 * stay lightweight; swap in a schema library here if the form grows.
 */

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Which form is submitting. The two collect the same row but have genuinely
 * different requirements, so they can't share one rule set:
 *
 *   contact   — someone has a question; the MESSAGE is the whole point, while
 *               phone and subject are nice-to-have.
 *   admission — someone wants to be called back; the admissions team needs a
 *               PHONE and a COURSE, and the message is optional (many students
 *               have nothing to add beyond "please contact me").
 *
 * Getting this wrong is what made the admissions form unusable: the UI marked
 * message optional while the validator demanded it, so a fully-filled form was
 * rejected with no visible reason.
 */
export type EnquiryVariant = 'contact' | 'admission';

/** Which optional fields become mandatory, per form. */
const RULES: Record<EnquiryVariant, { phone: boolean; subject: boolean; message: boolean }> = {
  contact: { phone: false, subject: false, message: true },
  admission: { phone: true, subject: true, message: false },
};

/** Narrow untrusted form input to a known variant (defaults to contact). */
export function toEnquiryVariant(value: unknown): EnquiryVariant {
  return value === 'admission' ? 'admission' : 'contact';
}

/** Result state returned by the submit action and consumed by the form UI. */
export interface EnquiryFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Per-field messages keyed by field name, for inline errors. */
  fieldErrors?: Partial<Record<keyof EnquiryInput, string>>;
  /**
   * What the visitor typed, echoed back on failure so the form can refill
   * itself via `defaultValue`.
   *
   * React 19 resets an uncontrolled form once its action resolves. Without this
   * echo, a single bad field wipes everything the visitor entered — they retype
   * it, trip a different rule, lose it again, and the form feels broken. Never
   * populated on success (the success panel replaces the form anyway).
   */
  values?: Partial<EnquiryInput>;
}

export const INITIAL_ENQUIRY_STATE: EnquiryFormState = { status: 'idle' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * validateEnquiry — checks required fields and formats, trims strings.
 * Returns the cleaned values plus any field errors.
 *
 * `variant` decides which of phone/subject/message are mandatory (see RULES).
 * It defaults to 'contact' so any caller that predates variants keeps its old
 * behaviour.
 *
 * Every error here must have a matching `error={state.fieldErrors?.x}` on the
 * form, or the submit fails with a banner and nothing highlighted.
 */
export function validateEnquiry(
  raw: EnquiryInput,
  variant: EnquiryVariant = 'contact',
): {
  ok: boolean;
  values: EnquiryInput;
  fieldErrors: EnquiryFormState['fieldErrors'];
} {
  const required = RULES[variant];

  const values: EnquiryInput = {
    name: raw.name?.trim() ?? '',
    email: raw.email?.trim() ?? '',
    phone: raw.phone?.trim() || undefined,
    subject: raw.subject?.trim() || undefined,
    message: raw.message?.trim() ?? '',
  };

  const fieldErrors: EnquiryFormState['fieldErrors'] = {};

  if (values.name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = 'Please enter a valid email.';

  // Phone: mandatory only on the admissions form, but whenever it IS given it
  // must be a valid 10-digit Indian mobile.
  if (!values.phone) {
    if (required.phone) fieldErrors.phone = 'Please enter your mobile number.';
  } else if (!/^\d{10}$/.test(values.phone)) {
    fieldErrors.phone = 'Enter a valid 10-digit mobile number.';
  }

  if (required.subject && !values.subject) {
    fieldErrors.subject = 'Please select a course.';
  }

  if (required.message) {
    if (values.message.length < 5) fieldErrors.message = 'Please add a short message.';
  } else if (values.message && values.message.length < 5) {
    // Optional, but a stray "ok" is worse than nothing — ask for real text or none.
    fieldErrors.message = 'Please write a little more, or leave this empty.';
  }

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}

/** New enquiries always start in the 'new' triage state. */
export const DEFAULT_ENQUIRY_STATUS: EnquiryStatus = 'new';
