import { siteConfig, admissionDates } from '@/config/site';

/**
 * Site-settings registry — the single, typed list of admin-editable settings.
 *
 * Each field has a stable `key` (its row in the `site_settings` table), a label
 * for the form, and a `fallback` used before an admin sets a value (so the site
 * always renders sensible defaults, even before the settings table exists).
 * Keeping the set defined here — rather than a free-form key-value bag — keeps
 * the admin form structured and the data predictable, while staying easy to
 * extend (add a field and it appears in the form + resolver automatically).
 */

/** Result state for the settings form (via useActionState). Lives here — not in
 * actions.ts — because a 'use server' file may only export async functions. */
export interface SettingsFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

export const INITIAL_SETTINGS_STATE: SettingsFormState = { status: 'idle' };

export type SettingType = 'text' | 'url';

export interface SettingField {
  key: string;
  label: string;
  type: SettingType;
  placeholder: string;
  fallback: string;
}

export interface SettingGroup {
  id: string;
  title: string;
  description: string;
  fields: SettingField[];
}

export const SETTING_GROUPS: SettingGroup[] = [
  {
    id: 'admission',
    title: 'Admission dates',
    description: 'Shown in the home page dates bar and the admissions page.',
    fields: [
      { key: 'admission_applications_close', label: 'Applications close', type: 'text', placeholder: '31 Aug 2026', fallback: admissionDates.applicationsClose },
      { key: 'admission_entrance_test', label: 'Entrance test', type: 'text', placeholder: '14 Sep 2026', fallback: admissionDates.entranceTest },
      { key: 'admission_session_begins', label: 'Session begins', type: 'text', placeholder: '01 Oct 2026', fallback: admissionDates.sessionBegins },
    ],
  },
  {
    id: 'contact',
    title: 'Contact details',
    description: 'Shown in the footer and on the contact page.',
    fields: [
      { key: 'contact_email', label: 'Email', type: 'text', placeholder: 'info@nalandacollege.edu.in', fallback: siteConfig.contact.email },
      { key: 'contact_phone', label: 'Phone', type: 'text', placeholder: '+91 98765 43210', fallback: siteConfig.contact.phone },
      { key: 'contact_address', label: 'Address', type: 'text', placeholder: 'College Road, District Centre, State 400001', fallback: siteConfig.contact.address },
    ],
  },
  {
    id: 'social',
    title: 'Social media links',
    description: 'Footer social icons. Leave a field blank to hide that icon.',
    fields: [
      { key: 'social_facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/…', fallback: '' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/…', fallback: '' },
      { key: 'social_twitter', label: 'Twitter / X URL', type: 'url', placeholder: 'https://x.com/…', fallback: '' },
    ],
  },
  {
    id: 'portal',
    title: 'Student portal links',
    description: 'The six university-portal shortcuts on the home page. Paste each real URL.',
    fields: [
      { key: 'portal_admit_card', label: 'Admit Card', type: 'url', placeholder: 'https://…', fallback: '' },
      { key: 'portal_exam_scheme', label: 'Exam Scheme', type: 'url', placeholder: 'https://…', fallback: '' },
      { key: 'portal_results', label: 'Results', type: 'url', placeholder: 'https://…', fallback: '' },
      { key: 'portal_time_table', label: 'Time Table', type: 'url', placeholder: 'https://…', fallback: '' },
      { key: 'portal_syllabus', label: 'Syllabus', type: 'url', placeholder: 'https://…', fallback: '' },
      { key: 'portal_revaluation', label: 'Revaluation', type: 'url', placeholder: 'https://…', fallback: '' },
    ],
  },
];

/** Flat list of every setting field (handy for the resolver + save action). */
export const SETTING_FIELDS: SettingField[] = SETTING_GROUPS.flatMap((g) => g.fields);

/** Default value map (key → fallback), used before/if the DB has no value. */
export const SETTING_DEFAULTS: Record<string, string> = Object.fromEntries(
  SETTING_FIELDS.map((f) => [f.key, f.fallback]),
);
