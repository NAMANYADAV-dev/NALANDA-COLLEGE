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

/** Result state returned by the submit action and consumed by the form UI. */
export interface EnquiryFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Per-field messages keyed by field name, for inline errors. */
  fieldErrors?: Partial<Record<keyof EnquiryInput, string>>;
}

export const INITIAL_ENQUIRY_STATE: EnquiryFormState = { status: 'idle' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * validateEnquiry — checks required fields and formats, trims strings.
 * Returns the cleaned values plus any field errors.
 */
export function validateEnquiry(raw: EnquiryInput): {
  ok: boolean;
  values: EnquiryInput;
  fieldErrors: EnquiryFormState['fieldErrors'];
} {
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
  // Phone is optional, but if given it must be exactly 10 digits (Indian mobile).
  if (values.phone && !/^\d{10}$/.test(values.phone)) {
    fieldErrors.phone = 'Enter a valid 10-digit mobile number.';
  }
  if (values.message.length < 5) fieldErrors.message = 'Please add a short message.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}

/** New enquiries always start in the 'new' triage state. */
export const DEFAULT_ENQUIRY_STATUS: EnquiryStatus = 'new';
