'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { INITIAL_DOWNLOAD_STATE, type DownloadFormState } from '@/features/downloads/schema';
import { FileUploadField } from '@/components/admin/FileUploadField';
import type { Download } from '@/types/database.types';

/**
 * DownloadForm — shared create/edit form for downloadable resources.
 *
 * Wired to whichever Server Action is passed in (`createDownload` for new,
 * `updateDownload.bind(null, id)` for edit) via useActionState. Files are
 * referenced by URL — leaving it blank stores a placeholder until a real link
 * is added.
 */

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

export function DownloadForm({
  action,
  download,
  submitLabel,
}: {
  action: (prev: DownloadFormState, formData: FormData) => Promise<DownloadFormState>;
  download?: Download;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_DOWNLOAD_STATE);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl">
      {state.status === 'error' && state.message && (
        <p className="mb-5 rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#b91c1c]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
        <Field label="Resource name" error={err.name}>
          <input name="name" defaultValue={download?.name} placeholder="e.g. Prospectus 2026–27" className={inputClass} />
        </Field>

        <div>
          <FileUploadField
            module="downloads"
            name="file_url"
            label="PDF file"
            defaultUrl={download?.file_url}
            required
          />
          {err.file_url && <p className="mt-1.5 text-[13px] text-[#b91c1c]">{err.file_url}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="File type" hint="e.g. PDF">
            <input name="file_type" defaultValue={download?.file_type ?? 'PDF'} placeholder="PDF" className={inputClass} />
          </Field>
          <Field label="Size label" hint="Optional">
            <input name="size_label" defaultValue={download?.size_label ?? ''} placeholder="4.2 MB" className={inputClass} />
          </Field>
          <Field label="Sort order" hint="Lower first">
            <input name="sort_order" type="number" defaultValue={download?.sort_order ?? 0} className={inputClass} />
          </Field>
        </div>

        <Field label="Category" hint="Optional">
          <input name="category" defaultValue={download?.category ?? ''} placeholder="Admissions" className={inputClass} />
        </Field>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={download ? download.is_published : true}
            className="h-4 w-4 accent-navy"
          />
          <span className="text-sm font-medium text-text">
            Published <span className="text-muted">— visible on the Downloads page</span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <SubmitButton label={submitLabel} />
        <Link
          href="/admin/downloads"
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
