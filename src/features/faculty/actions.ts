'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { removeStoredFile, removeReplacedFile } from '@/lib/storage/server';
import { requireAdmin } from '@/features/admin/auth/session';
import { validateFaculty, type FacultyFormState, type RawFaculty } from './schema';

/**
 * Faculty admin actions (create / update / delete / publish toggle).
 *
 * Every action re-checks the session with `requireAdmin()` — Server Actions are
 * public HTTP endpoints, so the admin layout is not a gate. RLS is the second
 * layer.
 *
 * The optional profile photo is uploaded to Storage client-side before submit,
 * so `photo_url` already points at the new file (or is empty). These actions
 * keep Storage and the database in sync: rollback a new photo if the DB write
 * fails, delete the replaced photo only after a successful update, and delete
 * the photo when the member is removed.
 */

/** Re-render everywhere a faculty member appears. */
function revalidateFaculty() {
  revalidatePath('/', 'layout'); // public pages
  revalidatePath('/admin/faculty');
  revalidatePath('/admin/dashboard');
}

/** Read the form into the raw shape the validator expects. */
function readForm(formData: FormData): RawFaculty {
  const g = (k: string) => String(formData.get(k) ?? '');
  return {
    name: g('name'),
    designation: g('designation'),
    department: g('department'),
    qualification: g('qualification'),
    email: g('email'),
    photo_url: g('photo_url'),
    bio: g('bio'),
    sort_order: g('sort_order'),
    is_published: formData.get('is_published') ? 'on' : null,
  };
}

/** Fetch just the stored photo URL for a row (for cleanup on update/delete). */
async function currentPhotoUrl(id: string): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('faculty').select('photo_url').eq('id', id).single();
    return data?.photo_url ?? null;
  } catch {
    return null;
  }
}

/** Create a new faculty member, then return to the list. */
export async function createFaculty(
  _prev: FacultyFormState,
  formData: FormData,
): Promise<FacultyFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateFaculty(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('faculty').insert(values);
    if (error) throw error;
  } catch (err) {
    console.error('[faculty] create failed:', (err as Error).message);
    await removeStoredFile(values.photo_url); // rollback the uploaded photo, if any
    return { status: 'error', message: 'Could not save the profile. Please try again.' };
  }

  revalidateFaculty();
  redirect('/admin/faculty');
}

/** Update an existing faculty member (id is bound by the edit page). */
export async function updateFaculty(
  id: string,
  _prev: FacultyFormState,
  formData: FormData,
): Promise<FacultyFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateFaculty(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  const oldUrl = await currentPhotoUrl(id);

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('faculty').update(values).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[faculty] update failed:', (err as Error).message);
    if (values.photo_url && values.photo_url !== oldUrl) await removeStoredFile(values.photo_url);
    return { status: 'error', message: 'Could not update the profile. Please try again.' };
  }

  // DB committed — remove the replaced (or cleared) photo.
  await removeReplacedFile(oldUrl, values.photo_url);

  revalidateFaculty();
  redirect('/admin/faculty');
}

/** Delete a faculty member and their photo. */
export async function deleteFaculty(id: string): Promise<void> {
  await requireAdmin();

  const oldUrl = await currentPhotoUrl(id);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('faculty').delete().eq('id', id);
  if (error) {
    console.error('[faculty] delete failed:', error.message);
    throw new Error('Could not delete the profile.');
  }

  await removeStoredFile(oldUrl);
  revalidateFaculty();
}

/** Toggle a faculty member between published and hidden. */
export async function toggleFacultyPublished(id: string, next: boolean): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('faculty').update({ is_published: next }).eq('id', id);
  if (error) {
    console.error('[faculty] publish toggle failed:', error.message);
    throw new Error('Could not update the profile.');
  }
  revalidateFaculty();
}
