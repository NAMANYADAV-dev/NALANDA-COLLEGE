import type { CourseLevel } from '@/types/database.types';
import { isValidSlug, slugify } from './slug';

/**
 * Course validation — shared by the create and edit Server Actions.
 * Framework-agnostic (takes plain string inputs, e.g. from FormData) so it can
 * be unit-tested. Parses numbers and the newline/comma lists, and returns a
 * DB-ready value object alongside any per-field errors.
 */

/** Values ready to insert/update (arrays + numbers parsed). */
export interface CourseValues {
  name: string;
  /** URL key: /courses/<slug>. Unique — the DB enforces it. */
  slug: string;
  level: CourseLevel;
  duration: string;
  tagline: string;
  about: string;
  seats: number;
  fee: string;
  subjects: string[];
  eligibility: string;
  careers: string[];
  sort_order: number;
  is_published: boolean;
}

export interface CourseFormState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof CourseValues, string>>;
}

export const INITIAL_COURSE_STATE: CourseFormState = { status: 'idle' };

/** Split a textarea value (one item per line, or comma-separated) into a list. */
export function parseList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Raw string inputs as they arrive from the form. */
export interface RawCourse {
  name: string;
  slug: string;
  level: string;
  duration: string;
  tagline: string;
  about: string;
  seats: string;
  fee: string;
  subjects: string;
  eligibility: string;
  careers: string;
  sort_order: string;
  is_published: string | null;
}

export function validateCourse(raw: RawCourse): {
  ok: boolean;
  values: CourseValues;
  fieldErrors: CourseFormState['fieldErrors'];
} {
  const name = raw.name?.trim() ?? '';

  // An empty slug field means "derive it from the name" — the common case when
  // adding a course. A filled one is respected as typed, so an existing URL can
  // stay put even after the programme is renamed.
  const rawSlug = raw.slug?.trim() ?? '';
  const slug = rawSlug ? rawSlug.toLowerCase() : slugify(name);

  const values: CourseValues = {
    name,
    slug,
    level: raw.level === 'PG' ? 'PG' : 'UG',
    duration: raw.duration?.trim() ?? '',
    tagline: raw.tagline?.trim() ?? '',
    about: raw.about?.trim() ?? '',
    seats: Number.parseInt(raw.seats, 10) || 0,
    fee: raw.fee?.trim() ?? '',
    subjects: parseList(raw.subjects ?? ''),
    eligibility: raw.eligibility?.trim() ?? '',
    careers: parseList(raw.careers ?? ''),
    sort_order: Number.parseInt(raw.sort_order, 10) || 0,
    is_published: raw.is_published === 'on' || raw.is_published === 'true',
  };

  const fieldErrors: CourseFormState['fieldErrors'] = {};
  if (values.name.length < 2) fieldErrors.name = 'Enter a course name.';

  // The slug lands in a public URL, so it has to be checked even though it is
  // usually generated. An empty result means the name had no usable characters.
  if (!values.slug) {
    fieldErrors.slug = 'Could not build a URL from this name — enter one manually.';
  } else if (!isValidSlug(values.slug)) {
    fieldErrors.slug = 'Use lowercase letters, numbers and single hyphens only.';
  }

  if (!values.duration) fieldErrors.duration = 'Enter a duration (e.g. “3 years”).';
  if (!values.tagline) fieldErrors.tagline = 'Add a short tagline.';
  if (!values.about) fieldErrors.about = 'Add a description.';
  if (!values.fee) fieldErrors.fee = 'Enter the annual fee.';
  if (!values.eligibility) fieldErrors.eligibility = 'Add the eligibility criteria.';
  if (values.seats < 0) fieldErrors.seats = 'Seats cannot be negative.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
