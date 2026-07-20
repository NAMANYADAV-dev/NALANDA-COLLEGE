'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { SETTING_GROUPS, INITIAL_SETTINGS_STATE } from '@/features/settings/config';
import { updateSiteSettings } from '@/features/settings/actions';

/**
 * SettingsForm — grouped, editable form for the site-wide settings.
 *
 * Renders every field from the settings registry, prefilled with the current
 * resolved values. Submits to the `updateSiteSettings` action, which saves all
 * keys and revalidates the site. Presentation only — validation/persistence
 * live in the action.
 */
const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction] = useActionState(updateSiteSettings, INITIAL_SETTINGS_STATE);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state.status === 'success' && state.message && (
        <p className="rounded-lg bg-[rgba(46,139,87,.1)] px-4 py-3 text-sm font-medium text-[#1b6e3d]">
          {state.message}
        </p>
      )}
      {state.status === 'error' && state.message && (
        <p className="rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]">
          {state.message}
        </p>
      )}

      {SETTING_GROUPS.map((group) => (
        <section key={group.id} className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-head text-[15px] font-semibold text-text">{group.title}</h2>
          <p className="mb-4 mt-0.5 text-[13px] text-muted">{group.description}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="mb-1.5 block text-sm font-semibold text-text">
                  {field.label}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type === 'url' ? 'url' : 'text'}
                  inputMode={field.type === 'url' ? 'url' : undefined}
                  defaultValue={values[field.key] ?? ''}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <SaveButton />
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover disabled:opacity-70"
    >
      {pending ? 'Saving…' : 'Save settings'}
    </button>
  );
}
