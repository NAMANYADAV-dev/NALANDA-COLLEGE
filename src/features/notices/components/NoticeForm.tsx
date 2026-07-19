'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { INITIAL_NOTICE_STATE, type NoticeFormState } from '@/features/notices/schema';
import type { Notice } from '@/types/database.types';

/**
 * NoticeForm — shared create/edit form for notices & events.
 *
 * Wired to whichever Server Action is passed in (`createNotice` for new,
 * `updateNotice.bind(null, id)` for edit) via useActionState. Prefills from
 * `notice` when editing. The `location` field is only meaningful for events but
 * stays available for both kinds (it's optional).
 */

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

/** Normalise any stored date to the YYYY-MM-DD a <input type="date"> expects. */
function toDateInput(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export function NoticeForm({
  action,
  notice,
  submitLabel,
}: {
  action: (prev: NoticeFormState, formData: FormData) => Promise<NoticeFormState>;
  notice?: Notice;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_NOTICE_STATE);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl">
      {state.status === 'error' && state.message && (
        <p className="mb-5 rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#D64545]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
        <Field label="Title" error={err.title}>
          <input name="title" defaultValue={notice?.title} placeholder="e.g. Semester examination schedule released" className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type">
            <select name="kind" defaultValue={notice?.kind ?? 'notice'} className={inputClass}>
              <option value="notice">Notice</option>
              <option value="event">Event</option>
            </select>
          </Field>
          <Field label="Publish date" error={err.published_at}>
            <input name="published_at" type="date" defaultValue={toDateInput(notice?.published_at)} className={inputClass} />
          </Field>
        </div>

        <Field label="Location" hint="Optional — for events (e.g. “Auditorium”)">
          <input name="location" defaultValue={notice?.location ?? ''} placeholder="Main Ground" className={inputClass} />
        </Field>

        <Field label="Details" hint="Optional">
          <textarea name="body" defaultValue={notice?.body ?? ''} rows={4} placeholder="Full text of the notice or event" className={inputClass} />
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_pinned"
              defaultChecked={notice ? notice.is_pinned : false}
              className="h-4 w-4 accent-navy"
            />
            <span className="text-sm font-medium text-text">
              Pinned <span className="text-muted">— shows first</span>
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={notice ? notice.is_published : true}
              className="h-4 w-4 accent-navy"
            />
            <span className="text-sm font-medium text-text">
              Published <span className="text-muted">— visible on the public site</span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <SubmitButton label={submitLabel} />
        <Link
          href="/admin/notices"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-section-alt"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-text">
        {label}
        {hint && <span className="ml-2 font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-[#D64545]">{error}</p>}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover disabled:opacity-70"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}
