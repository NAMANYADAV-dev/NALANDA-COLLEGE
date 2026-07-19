/**
 * Download resource validation — shared by the create and edit Server Actions.
 * Framework-agnostic (takes plain string inputs, e.g. from FormData) so it can
 * be unit-tested. `file_url` accepts a pasted link (Supabase Storage or an
 * external host); `file_type` defaults to PDF.
 */

/** Values ready to insert/update (optional fields normalised to null). */
export interface DownloadValues {
  name: string;
  file_url: string;
  file_type: string;
  size_label: string | null;
  category: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface DownloadFormState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof DownloadValues, string>>;
}

export const INITIAL_DOWNLOAD_STATE: DownloadFormState = { status: 'idle' };

/** Raw string inputs as they arrive from the form. */
export interface RawDownload {
  name: string;
  file_url: string;
  file_type: string;
  size_label: string;
  category: string;
  sort_order: string;
  is_published: string | null;
}

/** Trim a value, returning null when it's empty (for nullable columns). */
function nullable(value: string): string | null {
  const v = value?.trim() ?? '';
  return v.length > 0 ? v : null;
}

export function validateDownload(raw: RawDownload): {
  ok: boolean;
  values: DownloadValues;
  fieldErrors: DownloadFormState['fieldErrors'];
} {
  const values: DownloadValues = {
    name: raw.name?.trim() ?? '',
    file_url: raw.file_url?.trim() ?? '',
    file_type: (raw.file_type?.trim() || 'PDF').toUpperCase(),
    size_label: nullable(raw.size_label ?? ''),
    category: nullable(raw.category ?? ''),
    sort_order: Number.parseInt(raw.sort_order, 10) || 0,
    is_published: raw.is_published === 'on' || raw.is_published === 'true',
  };

  const fieldErrors: DownloadFormState['fieldErrors'] = {};
  if (values.name.length < 2) fieldErrors.name = 'Enter a name for the resource.';
  if (!values.file_url || values.file_url === '#')
    fieldErrors.file_url = 'Please upload a PDF file.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
