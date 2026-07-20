'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/features/admin/auth/session';
import { validateCourse, type CourseFormState, type RawCourse } from './schema';

/**
 * Course admin actions (create / update / delete / publish toggle).
 *
 * Every action starts with `requireAdmin()`. Server Actions are publicly
 * reachable HTTP endpoints — being rendered inside the admin panel is NOT a
 * gate — so each one re-checks the session itself rather than trusting the
 * layout. RLS in the database is the second, independent layer.
 *
 * After each change we revalidate the public layout — so the nav Courses
 * mega-menu and the /courses page reflect it — plus the admin list and
 * dashboard count.
 */

/** Re-render everywhere a course appears. */
function revalidateCourses() {
  revalidatePath('/', 'layout'); // public pages + nav mega-menu
  revalidatePath('/admin/courses');
  revalidatePath('/admin/dashboard');
}

/** Read the form into the raw shape the validator expects. */
function readForm(formData: FormData): RawCourse {
  const g = (k: string) => String(formData.get(k) ?? '');
  return {
    name: g('name'),
    level: g('level'),
    duration: g('duration'),
    tagline: g('tagline'),
    about: g('about'),
    seats: g('seats'),
    fee: g('fee'),
    subjects: g('subjects'),
    eligibility: g('eligibility'),
    careers: g('careers'),
    sort_order: g('sort_order'),
    is_published: formData.get('is_published') ? 'on' : null,
  };
}

/** Create a new course, then return to the list. */
export async function createCourse(
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateCourse(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('courses').insert(values);
    if (error) throw error;
  } catch (err) {
    console.error('[courses] create failed:', (err as Error).message);
    return { status: 'error', message: 'Could not save the course. Please try again.' };
  }

  revalidateCourses();
  redirect('/admin/courses');
}

/** Update an existing course (id is bound by the edit page). */
export async function updateCourse(
  id: string,
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  await requireAdmin();

  const { ok, values, fieldErrors } = validateCourse(readForm(formData));
  if (!ok) return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('courses').update(values).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[courses] update failed:', (err as Error).message);
    return { status: 'error', message: 'Could not update the course. Please try again.' };
  }

  revalidateCourses();
  redirect('/admin/courses');
}

/** Delete a course. */
export async function deleteCourse(id: string): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) {
    console.error('[courses] delete failed:', error.message);
    throw new Error('Could not delete the course.');
  }
  revalidateCourses();
}

/** Toggle a course between published and hidden. */
export async function toggleCoursePublished(id: string, next: boolean): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('courses').update({ is_published: next }).eq('id', id);
  if (error) {
    console.error('[courses] publish toggle failed:', error.message);
    throw new Error('Could not update the course.');
  }
  revalidateCourses();
}
