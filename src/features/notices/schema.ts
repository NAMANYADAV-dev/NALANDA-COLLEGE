import type { NoticeKind } from '@/types/database.types';

/**
 * Notice / event validation — shared by the create and edit Server Actions.
 * Framework-agnostic (takes plain string inputs, e.g. from FormData) so it can
 * be unit-tested. Normalises the kind + optional fields and returns a DB-ready
 * value object plus any per-field errors.
 */

/** Values ready to insert/update (optional fields normalised to null). */
export interface NoticeValues {
  title: string;
  kind: NoticeKind;
  body: string | null;
  location: string | null;
  published_at: string;
  is_pinned: boolean;
  is_published: boolean;
}

export interface NoticeFormState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof NoticeValues, string>>;
}

export const INITIAL_NOTICE_STATE: NoticeFormState = { status: 'idle' };

/** Raw string inputs as they arrive from the form. */
export interface RawNotice {
  title: string;
  kind: string;
  body: string;
  location: string;
  published_at: string;
  is_pinned: string | null;
  is_published: string | null;
}

/** Trim a value, returning null when it's empty (for nullable columns). */
function nullable(value: string): string | null {
  const v = value?.trim() ?? '';
  return v.length > 0 ? v : null;
}

/** Today's date as YYYY-MM-DD, used as the default publish date. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateNotice(raw: RawNotice): {
  ok: boolean;
  values: NoticeValues;
  fieldErrors: NoticeFormState['fieldErrors'];
} {
  const values: NoticeValues = {
    title: raw.title?.trim() ?? '',
    kind: raw.kind === 'event' ? 'event' : 'notice',
    body: nullable(raw.body ?? ''),
    location: nullable(raw.location ?? ''),
    published_at: raw.published_at?.trim() || today(),
    is_pinned: raw.is_pinned === 'on' || raw.is_pinned === 'true',
    is_published: raw.is_published === 'on' || raw.is_published === 'true',
  };

  const fieldErrors: NoticeFormState['fieldErrors'] = {};
  if (values.title.length < 3) fieldErrors.title = 'Enter a title.';
  if (Number.isNaN(new Date(values.published_at).getTime()))
    fieldErrors.published_at = 'Enter a valid date.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
