import { describe, it, expect } from 'vitest';
import { toEnquiryVariant, validateEnquiry, type EnquiryInput } from './schema';

/** A valid baseline enquiry; individual tests override single fields. */
const base: EnquiryInput = {
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '9876543210',
  subject: 'B.Sc',
  message: 'I would like details about admissions.',
};

describe('validateEnquiry', () => {
  it('accepts a complete, valid enquiry', () => {
    const { ok, fieldErrors } = validateEnquiry(base);
    expect(ok).toBe(true);
    expect(fieldErrors).toEqual({});
  });

  it('rejects a missing/short name', () => {
    const { ok, fieldErrors } = validateEnquiry({ ...base, name: 'A' });
    expect(ok).toBe(false);
    expect(fieldErrors?.name).toBeDefined();
  });

  it('rejects an invalid email', () => {
    const { ok, fieldErrors } = validateEnquiry({ ...base, email: 'not-an-email' });
    expect(ok).toBe(false);
    expect(fieldErrors?.email).toBeDefined();
  });

  it('accepts any valid email provider (not only gmail)', () => {
    for (const email of ['a@yahoo.com', 'b@outlook.com', 'c@college.edu.in']) {
      expect(validateEnquiry({ ...base, email }).ok).toBe(true);
    }
  });

  it('rejects a phone that is not exactly 10 digits', () => {
    expect(validateEnquiry({ ...base, phone: '12345' }).fieldErrors?.phone).toBeDefined();
    expect(validateEnquiry({ ...base, phone: '12345678901' }).fieldErrors?.phone).toBeDefined();
    expect(validateEnquiry({ ...base, phone: 'abcdefghij' }).fieldErrors?.phone).toBeDefined();
  });

  it('accepts a valid 10-digit phone', () => {
    expect(validateEnquiry({ ...base, phone: '9876543210' }).ok).toBe(true);
  });

  it('treats phone as optional (empty is allowed)', () => {
    const { ok, values } = validateEnquiry({ ...base, phone: '' });
    expect(ok).toBe(true);
    expect(values.phone).toBeUndefined();
  });

  it('requires a message of a few characters', () => {
    expect(validateEnquiry({ ...base, message: 'hi' }).fieldErrors?.message).toBeDefined();
  });

  it('trims whitespace on saved values', () => {
    const { values } = validateEnquiry({ ...base, name: '  Priya  ' });
    expect(values.name).toBe('Priya');
  });
});

describe('validateEnquiry — admission variant', () => {
  /**
   * The bug this guards against: the admissions form shows Message as optional,
   * but the validator demanded it. A student filled in every visible field,
   * left the message blank, and got "please fix the highlighted fields" with
   * nothing highlighted — over and over.
   */
  it('accepts an admission enquiry with no message', () => {
    const { ok, fieldErrors } = validateEnquiry({ ...base, message: '' }, 'admission');
    expect(ok).toBe(true);
    expect(fieldErrors).toEqual({});
  });

  it('still requires a message on the contact form', () => {
    const { ok, fieldErrors } = validateEnquiry({ ...base, message: '' }, 'contact');
    expect(ok).toBe(false);
    expect(fieldErrors?.message).toBeDefined();
  });

  it('requires phone and course on an admission enquiry', () => {
    const { ok, fieldErrors } = validateEnquiry(
      { ...base, phone: '', subject: '', message: '' },
      'admission',
    );
    expect(ok).toBe(false);
    expect(fieldErrors?.phone).toBeDefined();
    expect(fieldErrors?.subject).toBeDefined();
  });

  it('leaves phone and course optional on the contact form', () => {
    const { ok } = validateEnquiry({ ...base, phone: '', subject: '' }, 'contact');
    expect(ok).toBe(true);
  });

  it('rejects a too-short optional message rather than saving noise', () => {
    const { ok, fieldErrors } = validateEnquiry({ ...base, message: 'ok' }, 'admission');
    expect(ok).toBe(false);
    expect(fieldErrors?.message).toBeDefined();
  });

  it('defaults to the contact rules when no variant is given', () => {
    expect(validateEnquiry({ ...base, message: '' }).ok).toBe(false);
  });
});

describe('toEnquiryVariant', () => {
  it('accepts the admission variant', () => {
    expect(toEnquiryVariant('admission')).toBe('admission');
  });

  it('falls back to contact for anything unexpected', () => {
    // The value arrives from a hidden form field, so it must never be trusted
    // to index the rules table directly.
    for (const v of ['', 'ADMISSION', 'nonsense', null, undefined, 42, {}]) {
      expect(toEnquiryVariant(v)).toBe('contact');
    }
  });
});
