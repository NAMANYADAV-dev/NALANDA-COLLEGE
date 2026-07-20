'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { INITIAL_FACULTY_STATE, type FacultyFormState } from '@/features/faculty/schema';
import { FACULTY_DEPARTMENTS } from '@/features/faculty/data';
import { FileUploadField } from '@/components/admin/FileUploadField';
import type { Faculty } from '@/types/database.types';

/**
 * FacultyForm — shared create/edit form.
 *
 * Presentational + wired to whichever Server Action is passed in (`createFaculty`
 * for new, `updateFaculty.bind(null, id)` for edit) via useActionState. Prefills
 * from `faculty` when editing. Validation/persistence live in the action; this
 * component only collects input and renders returned field errors.
 */

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

export function FacultyForm({
  action,
  faculty,
  submitLabel,
}: {
  action: (prev: FacultyFormState, formData: FormData) => Promise<FacultyFormState>;
  faculty?: Faculty;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_FACULTY_STATE);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl">
      {state.status === 'error' && state.message && (
        <p className="mb-5 rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
        <Field label="Full name" error={err.name}>
          <input name="name" defaultValue={faculty?.name} placeholder="e.g. Dr. Anjali Verma" className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Designation" error={err.designation}>
            <input name="designation" defaultValue={faculty?.designation} placeholder="Professor & Head" className={inputClass} />
          </Field>
          <Field label="Department" error={err.department}>
            <input
              name="department"
              defaultValue={faculty?.department}
              placeholder="Science"
              list="faculty-departments"
              className={inputClass}
            />
            <datalist id="faculty-departments">
              {FACULTY_DEPARTMENTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Qualification" hint="Optional">
            <input name="qualification" defaultValue={faculty?.qualification ?? ''} placeholder="Ph.D. English Literature" className={inputClass} />
          </Field>
          <Field label="Email" hint="Optional" error={err.email}>
            <input name="email" type="email" defaultValue={faculty?.email ?? ''} placeholder="name@nalandacollege.edu.in" className={inputClass} />
          </Field>
        </div>

        <FileUploadField
          module="faculty"
          name="photo_url"
          label="Photo"
          hint="Optional"
          defaultUrl={faculty?.photo_url}
        />

        <Field label="Bio" hint="Optional">
          <textarea name="bio" defaultValue={faculty?.bio ?? ''} rows={3} placeholder="Short profile / areas of expertise" className={inputClass} />
        </Field>

        <Field label="Sort order" hint="Lower shows first">
          <input name="sort_order" type="number" defaultValue={faculty?.sort_order ?? 0} className={`${inputClass} max-w-[160px]`} />
        </Field>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={faculty ? faculty.is_published : true}
            className="h-4 w-4 accent-navy"
          />
          <span className="text-sm font-medium text-text">
            Published <span className="text-muted">— visible on the public site</span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <SubmitButton label={submitLabel} />
        <Link
          href="/admin/faculty"
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
      {error && <p className="mt-1.5 text-[13px] text-[#b91c1c]">{error}</p>}
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
