/**
 * Gallery image validation — shared by the create and edit Server Actions.
 * Framework-agnostic (takes plain string inputs, e.g. from FormData) so it can
 * be unit-tested. `image_url` accepts a pasted link (Supabase Storage or an
 * external host); until one is provided the public grid shows a captioned tile.
 */

/** Values ready to insert/update (optional fields normalised to null). */
export interface GalleryValues {
  title: string;
  image_url: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface GalleryFormState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof GalleryValues, string>>;
}

export const INITIAL_GALLERY_STATE: GalleryFormState = { status: 'idle' };

/** Raw string inputs as they arrive from the form. */
export interface RawGallery {
  title: string;
  image_url: string;
  category: string;
  sort_order: string;
  is_published: string | null;
}

/** Trim a value, returning null when it's empty (for nullable columns). */
function nullable(value: string): string | null {
  const v = value?.trim() ?? '';
  return v.length > 0 ? v : null;
}

export function validateGallery(raw: RawGallery): {
  ok: boolean;
  values: GalleryValues;
  fieldErrors: GalleryFormState['fieldErrors'];
} {
  const values: GalleryValues = {
    title: raw.title?.trim() ?? '',
    image_url: raw.image_url?.trim() ?? '',
    category: nullable(raw.category ?? ''),
    sort_order: Number.parseInt(raw.sort_order, 10) || 0,
    is_published: raw.is_published === 'on' || raw.is_published === 'true',
  };

  const fieldErrors: GalleryFormState['fieldErrors'] = {};
  if (values.title.length < 2) fieldErrors.title = 'Enter a caption / title.';
  if (!values.image_url || values.image_url === '#')
    fieldErrors.image_url = 'Please upload an image.';

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
