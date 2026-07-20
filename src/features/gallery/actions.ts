'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { removeStoredFile, removeReplacedFile } from '@/lib/storage/server';
import { requireAdmin } from '@/features/admin/auth/session';
import { validateGallery, type GalleryFormState, type RawGallery } from './schema';

/**
 * Gallery admin actions (create / update / delete / publish toggle).
 *
 * The image is uploaded to Storage client-side before the form submits, so the
 * incoming `image_url` already points at the new file. These actions keep
 * Storage and the database in sync:
 *   - create: if the DB insert fails, delete the just-uploaded file (rollback).
 *   - update: only after a successful DB write, delete the old file it replaced.
 *   - delete: after the row is removed, delete its file.
 *
 * Every action re-checks the session with `requireAdmin()` — Server Actions are
 * public HTTP endpoints, so the admin layout is not a gate. RLS is the second
 * layer.
 */

/** Re-render everywhere gallery images appear. */
function revalidateGallery() {
  revalidatePath('/', 'layout'); // public pages
  revalidatePath('/admin/gallery');
  revalidatePath('/admin/dashboard');
}

/** Read the form into the raw shape the validator expects. */
function readForm(formData: FormData): RawGallery {
  const g = (k: string) => String(formData.get(k) ?? '');
  return {
    title: g('title'),
    image_url: g('image_url'),
    category: g('category'),
    sort_order: g('sort_order'),
    is_published: formData.get('is_published') ? 'on' : null,
  };
}

/** Fetch just the stored image URL for a row (for cleanup on update/delete). */
async function currentImageUrl(id: string): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('gallery_images').select('image_url').eq('id', id).single();
    return data?.image_url ?? null;
  } catch {
    return null;
  }
}

/** Create a new gallery image, then return to the list. */
export async function createGalleryImage(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateGallery(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('gallery_images').insert(values);
    if (error) throw error;
  } catch (err) {
    console.error('[gallery] create failed:', (err as Error).message);
    // Rollback: the file was already uploaded — don't leave it orphaned.
    await removeStoredFile(values.image_url);
    return { status: 'error', message: 'Could not save. Please try again.' };
  }

  revalidateGallery();
  redirect('/admin/gallery');
}

/** Update an existing gallery image (id is bound by the edit page). */
export async function updateGalleryImage(
  id: string,
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateGallery(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  const oldUrl = await currentImageUrl(id);

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('gallery_images').update(values).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[gallery] update failed:', (err as Error).message);
    // Rollback: delete the newly uploaded file, but never the untouched original.
    if (values.image_url !== oldUrl) await removeStoredFile(values.image_url);
    return { status: 'error', message: 'Could not update. Please try again.' };
  }

  // DB committed — safe to remove the replaced file.
  await removeReplacedFile(oldUrl, values.image_url);

  revalidateGallery();
  redirect('/admin/gallery');
}

/** Delete a gallery image and its file. */
export async function deleteGalleryImage(id: string): Promise<void> {
  await requireAdmin();

  const oldUrl = await currentImageUrl(id);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) {
    console.error('[gallery] delete failed:', error.message);
    throw new Error('Could not delete.');
  }

  await removeStoredFile(oldUrl); // remove the orphaned file after the row is gone
  revalidateGallery();
}

/** Toggle a gallery image between published and hidden. */
export async function toggleGalleryPublished(id: string, next: boolean): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('gallery_images').update({ is_published: next }).eq('id', id);
  if (error) {
    console.error('[gallery] publish toggle failed:', error.message);
    throw new Error('Could not update.');
  }
  revalidateGallery();
}
