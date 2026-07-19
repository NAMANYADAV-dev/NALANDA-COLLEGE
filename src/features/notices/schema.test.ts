import { describe, it, expect } from 'vitest';
import { validateNotice, type RawNotice } from './schema';

const base: RawNotice = {
  title: 'Semester exam schedule released',
  kind: 'notice',
  body: 'Datesheet is now available.',
  location: '',
  published_at: '2026-07-18',
  is_pinned: null,
  is_published: 'on',
};

describe('validateNotice', () => {
  it('accepts a valid notice', () => {
    expect(validateNotice(base).ok).toBe(true);
  });

  it('requires a title of a few characters', () => {
    expect(validateNotice({ ...base, title: 'Hi' }).fieldErrors?.title).toBeDefined();
  });

  it('coerces kind to event only when exactly "event"', () => {
    expect(validateNotice({ ...base, kind: 'event' }).values.kind).toBe('event');
    expect(validateNotice({ ...base, kind: 'other' }).values.kind).toBe('notice');
  });

  it('rejects an invalid publish date', () => {
    expect(validateNotice({ ...base, published_at: 'not-a-date' }).fieldErrors?.published_at).toBeDefined();
  });

  it('defaults an empty date to today (valid)', () => {
    const { ok, values } = validateNotice({ ...base, published_at: '' });
    expect(ok).toBe(true);
    expect(values.published_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('reads pinned/published checkbox values', () => {
    const { values } = validateNotice({ ...base, is_pinned: 'on', is_published: null });
    expect(values.is_pinned).toBe(true);
    expect(values.is_published).toBe(false);
  });
});
