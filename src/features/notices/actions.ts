'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/features/admin/auth/session';
import { validateNotice, type NoticeFormState, type RawNotice } from './schema';

/**
 * Notice / event admin actions (create / update / delete / publish toggle).
 *
 * Every action re-checks the session with `requireAdmin()` — Server Actions are
 * public HTTP endpoints, so the admin layout is not a gate. RLS is the second
 * layer. After each change we
 * revalidate the public layout — so the Home notices strip and the /notices
 * page reflect it — plus the admin list and dashboard count.
 */

/** Re-render everywhere a notice appears. */
function revalidateNotices() {
  revalidatePath('/', 'layout'); // home strip + public pages
  revalidatePath('/admin/notices');
  revalidatePath('/admin/dashboard');
}

/** Read the form into the raw shape the validator expects. */
function readForm(formData: FormData): RawNotice {
  const g = (k: string) => String(formData.get(k) ?? '');
  return {
    title: g('title'),
    kind: g('kind'),
    body: g('body'),
    location: g('location'),
    published_at: g('published_at'),
    is_pinned: formData.get('is_pinned') ? 'on' : null,
    is_published: formData.get('is_published') ? 'on' : null,
  };
}

/** Create a new notice/event, then return to the list. */
export async function createNotice(
  _prev: NoticeFormState,
  formData: FormData,
): Promise<NoticeFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateNotice(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('notices').insert(values);
    if (error) throw error;
  } catch (err) {
    console.error('[notices] create failed:', (err as Error).message);
    return { status: 'error', message: 'Could not save. Please try again.' };
  }

  revalidateNotices();
  redirect('/admin/notices');
}

/** Update an existing notice (id is bound by the edit page). */
export async function updateNotice(
  id: string,
  _prev: NoticeFormState,
  formData: FormData,
): Promise<NoticeFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateNotice(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('notices').update(values).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[notices] update failed:', (err as Error).message);
    return { status: 'error', message: 'Could not update. Please try again.' };
  }

  revalidateNotices();
  redirect('/admin/notices');
}

/** Delete a notice/event. */
export async function deleteNotice(id: string): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) {
    console.error('[notices] delete failed:', error.message);
    throw new Error('Could not delete.');
  }
  revalidateNotices();
}

/** Toggle a notice between published and hidden. */
export async function toggleNoticePublished(id: string, next: boolean): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('notices').update({ is_published: next }).eq('id', id);
  if (error) {
    console.error('[notices] publish toggle failed:', error.message);
    throw new Error('Could not update.');
  }
  revalidateNotices();
}
