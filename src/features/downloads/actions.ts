'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { removeStoredFile, removeReplacedFile } from '@/lib/storage/server';
import { validateDownload, type DownloadFormState, type RawDownload } from './schema';

/**
 * Downloads admin actions (create / update / delete / publish toggle).
 *
 * The PDF is uploaded to Storage client-side before submit, so `file_url`
 * already points at the new file. These actions keep Storage and the database
 * in sync: rollback a new file if the DB write fails, delete the replaced file
 * only after a successful update, and delete the file when the row is removed.
 */

/** Re-render everywhere downloads appear. */
function revalidateDownloads() {
  revalidatePath('/', 'layout'); // public pages
  revalidatePath('/admin/downloads');
  revalidatePath('/admin/dashboard');
}

/** Read the form into the raw shape the validator expects. */
function readForm(formData: FormData): RawDownload {
  const g = (k: string) => String(formData.get(k) ?? '');
  return {
    name: g('name'),
    file_url: g('file_url'),
    file_type: g('file_type'),
    size_label: g('size_label'),
    category: g('category'),
    sort_order: g('sort_order'),
    is_published: formData.get('is_published') ? 'on' : null,
  };
}

/** Fetch just the stored file URL for a row (for cleanup on update/delete). */
async function currentFileUrl(id: string): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('downloads').select('file_url').eq('id', id).single();
    return data?.file_url ?? null;
  } catch {
    return null;
  }
}

/** Create a new download, then return to the list. */
export async function createDownload(
  _prev: DownloadFormState,
  formData: FormData,
): Promise<DownloadFormState> {
  const { ok, values, fieldErrors } = validateDownload(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('downloads').insert(values);
    if (error) throw error;
  } catch (err) {
    console.error('[downloads] create failed:', (err as Error).message);
    await removeStoredFile(values.file_url); // rollback the uploaded file
    return { status: 'error', message: 'Could not save. Please try again.' };
  }

  revalidateDownloads();
  redirect('/admin/downloads');
}

/** Update an existing download (id is bound by the edit page). */
export async function updateDownload(
  id: string,
  _prev: DownloadFormState,
  formData: FormData,
): Promise<DownloadFormState> {
  const { ok, values, fieldErrors } = validateDownload(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  const oldUrl = await currentFileUrl(id);

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('downloads').update(values).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[downloads] update failed:', (err as Error).message);
    if (values.file_url !== oldUrl) await removeStoredFile(values.file_url);
    return { status: 'error', message: 'Could not update. Please try again.' };
  }

  await removeReplacedFile(oldUrl, values.file_url);

  revalidateDownloads();
  redirect('/admin/downloads');
}

/** Delete a download and its file. */
export async function deleteDownload(id: string): Promise<void> {
  const oldUrl = await currentFileUrl(id);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('downloads').delete().eq('id', id);
  if (error) {
    console.error('[downloads] delete failed:', error.message);
    throw new Error('Could not delete.');
  }

  await removeStoredFile(oldUrl);
  revalidateDownloads();
}

/** Toggle a download between published and hidden. */
export async function toggleDownloadPublished(id: string, next: boolean): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('downloads').update({ is_published: next }).eq('id', id);
  if (error) {
    console.error('[downloads] publish toggle failed:', error.message);
    throw new Error('Could not update.');
  }
  revalidateDownloads();
}
