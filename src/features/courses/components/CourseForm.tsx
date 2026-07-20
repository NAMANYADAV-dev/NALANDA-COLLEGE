'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { INITIAL_COURSE_STATE, type CourseFormState, type CourseValues } from '@/features/courses/schema';
import type { Course } from '@/types/database.types';

/**
 * CourseForm — shared create/edit form.
 *
 * Presentational + wired to whichever Server Action is passed in (`createCourse`
 * for new, `updateCourse.bind(null, id)` for edit) via useActionState. Prefills
 * from `course` when editing. Validation/persistence live in the action; this
 * component only collects input and renders returned field errors.
 */

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

export function CourseForm({
  action,
  course,
  submitLabel,
}: {
  action: (prev: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  course?: Course;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_COURSE_STATE);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl">
      {state.status === 'error' && state.message && (
        <p className="mb-5 rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
        <Field label="Course name" error={err.name}>
          <input name="name" defaultValue={course?.name} placeholder="e.g. Bachelor of Science" className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Level">
            <select name="level" defaultValue={course?.level ?? 'UG'} className={inputClass}>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
            </select>
          </Field>
          <Field label="Duration" error={err.duration}>
            <input name="duration" defaultValue={course?.duration} placeholder="3 years" className={inputClass} />
          </Field>
          <Field label="Annual fee" error={err.fee}>
            <input name="fee" defaultValue={course?.fee} placeholder="₹16,000" className={inputClass} />
          </Field>
        </div>

        <Field label="Tagline" error={err.tagline}>
          <input name="tagline" defaultValue={course?.tagline} placeholder="Short one-line summary" className={inputClass} />
        </Field>

        <Field label="About" error={err.about}>
          <textarea name="about" defaultValue={course?.about} rows={3} placeholder="Full description of the programme" className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Seats" error={err.seats}>
            <input name="seats" type="number" min={0} defaultValue={course?.seats ?? 0} className={inputClass} />
          </Field>
          <Field label="Sort order" hint="Lower shows first">
            <input name="sort_order" type="number" defaultValue={course?.sort_order ?? 0} className={inputClass} />
          </Field>
        </div>

        <Field label="Core subjects" hint="One per line, or comma-separated">
          <textarea name="subjects" defaultValue={course?.subjects?.join('\n')} rows={4} placeholder={'Physics\nChemistry\nMathematics'} className={inputClass} />
        </Field>

        <Field label="Eligibility" error={err.eligibility}>
          <textarea name="eligibility" defaultValue={course?.eligibility} rows={2} placeholder="e.g. 10+2 with Science, minimum 50%" className={inputClass} />
        </Field>

        <Field label="Career paths" hint="One per line, or comma-separated">
          <textarea name="careers" defaultValue={course?.careers?.join('\n')} rows={3} placeholder={'Research\nHealthcare\nData & Analytics'} className={inputClass} />
        </Field>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={course ? course.is_published : true}
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
          href="/admin/courses"
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
