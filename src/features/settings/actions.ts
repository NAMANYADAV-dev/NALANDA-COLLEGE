'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SETTING_FIELDS, type SettingsFormState } from './config';

/**
 * updateSiteSettings — save the admin "Site settings" form.
 *
 * Upserts one row per known key (only the defined fields, so nothing arbitrary
 * is written) and then revalidates the whole site, so the new dates / contact /
 * links appear everywhere they're used on the next request. RLS restricts this
 * to authenticated admins.
 */
export async function updateSiteSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const rows = SETTING_FIELDS.map((f) => ({
    key: f.key,
    value: String(formData.get(f.key) ?? '').trim(),
    updated_at: new Date().toISOString(),
  }));

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) throw error;
  } catch (err) {
    console.error('[settings] save failed:', (err as Error).message);
    return {
      status: 'error',
      message:
        'Could not save settings. If this persists, run supabase/site_settings.sql in Supabase.',
    };
  }

  revalidatePath('/', 'layout'); // dates bar, footer, portal — everywhere
  revalidatePath('/admin/settings');
  return { status: 'success', message: 'Settings saved. Changes are now live across the site.' };
}
