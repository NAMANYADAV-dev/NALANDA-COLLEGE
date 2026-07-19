/**
 * Faculty validation — shared by the create and edit Server Actions.
 * Framework-agnostic (takes plain string inputs, e.g. from FormData) so it can
 * be unit-tested. Parses the sort order and normalises optional fields to
 * `null`, returning a DB-ready value object plus any per-field errors.
 */

/** Values ready to insert/update (optional fields normalised to null). */
export interface FacultyValues {
  name: string;
  designation: string;
  department: string;
  qualification: string | null;
  email: string | null;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface FacultyFormState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof FacultyValues, string>>;
}

export const INITIAL_FACULTY_STATE: FacultyFormState = { status: 'idle' };

/** Raw string inputs as they arrive from the form. */
export interface RawFaculty {
  name: string;
  designation: string;
  department: string;
  qualification: string;
  email: string;
  photo_url: string;
  bio: string;
  sort_order: string;
  is_published: string | null;
}

/** Trim a value, returning null when it's empty (for nullable columns). */
function nullable(value: string): string | null {
  const v = value?.trim() ?? '';
  return v.length > 0 ? v : null;
}

export function validateFaculty(raw: RawFaculty): {
  ok: boolean;
  values: FacultyValues;
  fieldErrors: FacultyFormState['fieldErrors'];
} {
  const values: FacultyValues = {
    name: raw.name?.trim() ?? '',
    designation: raw.designation?.trim() ?? '',
    department: raw.department?.trim() ?? '',
    qualification: nullable(raw.qualification ?? ''),
    email: nullable(raw.email ?? ''),
    photo_url: nullable(raw.photo_url ?? ''),
    bio: nullable(raw.bio ?? ''),
    sort_order: Number.parseInt(raw.sort_order, 10) || 0,
    is_published: raw.is_published === 'on' || raw.is_published === 'true',
  };

  const fieldErrors: FacultyFormState['fieldErrors'] = {};
  if (values.name.length < 2) fieldErrors.name = 'Enter the member’s name.';
  if (!values.designation) fieldErrors.designation = 'Enter a designation (e.g. “Professor”).';
  if (!values.department) fieldErrors.department = 'Enter a department.';
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    fieldErrors.email = 'Enter a valid email address.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
