'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/features/admin/auth/session';
import type { EnquiryStatus } from '@/types/database.types';
import { notifyNewEnquiry } from './notify';
import {
  toEnquiryVariant,
  validateEnquiry,
  type EnquiryFormState,
  type EnquiryInput,
} from './schema';

/**
 * submitEnquiry — Server Action backing the Contact & Admissions forms.
 *
 * Flow: read FormData → honeypot check → validate → insert into `enquiries`
 * (public INSERT is allowed by RLS). Designed for React's `useActionState`:
 * it takes the previous state and the submitted FormData and returns the next
 * state, which the client form renders (success screen or inline errors).
 *
 * The `company` field is a hidden honeypot: real users never fill it, so a
 * non-empty value means a bot — we short-circuit with a fake success.
 */
export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  // Bot trap — pretend everything is fine but store nothing.
  if ((formData.get('company') as string)?.trim()) {
    return { status: 'success' };
  }

  const raw: EnquiryInput = {
    name: (formData.get('name') as string) ?? '',
    email: (formData.get('email') as string) ?? '',
    phone: (formData.get('phone') as string) ?? '',
    subject: (formData.get('subject') as string) ?? '',
    message: (formData.get('message') as string) ?? '',
  };

  // Which form posted this decides which fields are mandatory. The value comes
  // from a hidden input, so it's untrusted — narrow it to a known variant
  // rather than indexing the rules with whatever arrived.
  const variant = toEnquiryVariant(formData.get('variant'));

  const { ok, values, fieldErrors } = validateEnquiry(raw, variant);
  if (!ok) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      fieldErrors,
      values, // echo back so the form refills itself — see EnquiryFormState.values
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    // Rate-limited insert via a DB function (one enquiry per email per 30 min).
    // It checks + inserts atomically and returns { ok, retry_after }.
    const { data, error } = await supabase.rpc('submit_enquiry', {
      p_name: values.name,
      p_email: values.email,
      p_phone: values.phone ?? null,
      p_subject: values.subject ?? null,
      p_message: values.message,
    });
    if (error) throw error;

    if (!data?.ok) {
      // Cooldown active — the DB already computed the exact minutes remaining.
      const mins = data?.wait_minutes ?? 30;
      return {
        status: 'error',
        message: `You've already sent a message from this email. Please wait about ${mins} minute${mins === 1 ? '' : 's'} before sending another.`,
        values,
      };
    }

    // Best-effort admin notification — must never affect the saved enquiry.
    await notifyNewEnquiry(values).catch(() => {});

    return { status: 'success' };
  } catch (err) {
    console.error('[enquiries] submit failed:', (err as Error).message);
    return {
      status: 'error',
      message:
        'Something went wrong sending your message. Please try again, or email us directly.',
      values,
    };
  }
}

/**
 * updateEnquiryStatus — admin action to move a lead through its lifecycle
 * (new → read → resolved). Gated by `requireAdmin()` here and by RLS in the
 * database. Revalidates the admin pages so the list + dashboard reflect it.
 */
export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
  if (error) {
    console.error('[enquiries] status update failed:', error.message);
    throw new Error('Could not update the enquiry.');
  }
  revalidatePath('/admin/enquiries');
  revalidatePath('/admin/dashboard');
}

/**
 * deleteEnquiry — permanently remove a lead. Gated by `requireAdmin()` here and
 * by RLS in the database. Used to clear out handled enquiries so the inbox
 * stays tidy.
 */
export async function deleteEnquiry(id: string): Promise<void> {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) {
    console.error('[enquiries] delete failed:', error.message);
    throw new Error('Could not delete the enquiry.');
  }
  revalidatePath('/admin/enquiries');
  revalidatePath('/admin/dashboard');
}
