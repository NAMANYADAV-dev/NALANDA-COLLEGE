import 'server-only';
import { cache } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SETTING_DEFAULTS } from './config';

/**
 * Site-settings data access.
 *
 * Reads the key-value `site_settings` table and merges it over the code
 * defaults, so callers always get a complete value for every known key. If the
 * table doesn't exist yet or the read fails, it degrades to the defaults — the
 * public site keeps working before the settings migration is run. Wrapped in
 * React `cache()` so multiple consumers in one render share a single query.
 */

/** Raw key → value map, defaults merged with any admin-saved overrides. */
export const getSettingsMap = cache(async (): Promise<Record<string, string>> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) throw error;

    const overrides: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.value != null && row.value !== '') overrides[row.key] = row.value;
    }
    return { ...SETTING_DEFAULTS, ...overrides };
  } catch {
    return { ...SETTING_DEFAULTS };
  }
});

/** Structured, ready-to-use settings for the public components. */
export interface SiteSettings {
  admission: { applicationsClose: string; entranceTest: string; sessionBegins: string };
  contact: { email: string; phone: string; address: string };
  social: { facebook: string; instagram: string; twitter: string };
  /** Student-portal URLs keyed by PortalItem.key (admit_card, results, …). */
  portal: Record<string, string>;
}

/** Resolve the flat settings map into the shape the public UI consumes. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await getSettingsMap();
  return {
    admission: {
      applicationsClose: s.admission_applications_close,
      entranceTest: s.admission_entrance_test,
      sessionBegins: s.admission_session_begins,
    },
    contact: {
      email: s.contact_email,
      phone: s.contact_phone,
      address: s.contact_address,
    },
    social: {
      facebook: s.social_facebook,
      instagram: s.social_instagram,
      twitter: s.social_twitter,
    },
    portal: {
      admit_card: s.portal_admit_card,
      exam_scheme: s.portal_exam_scheme,
      results: s.portal_results,
      time_table: s.portal_time_table,
      syllabus: s.portal_syllabus,
      revaluation: s.portal_revaluation,
    },
  };
}
