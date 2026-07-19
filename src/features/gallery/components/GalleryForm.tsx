'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { INITIAL_GALLERY_STATE, type GalleryFormState } from '@/features/gallery/schema';
import { FileUploadField } from '@/components/admin/FileUploadField';
import type { GalleryImage } from '@/types/database.types';

/**
 * GalleryForm — shared create/edit form for gallery images.
 *
 * Wired to whichever Server Action is passed in (`createGalleryImage` for new,
 * `updateGalleryImage.bind(null, id)` for edit) via useActionState. Images are
 * referenced by URL — leaving it blank stores a placeholder tile until a real
 * image link is added.
 */

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none focus:border-navy placeholder:text-muted/70';

export function GalleryForm({
  action,
  image,
  submitLabel,
}: {
  action: (prev: GalleryFormState, formData: FormData) => Promise<GalleryFormState>;
  image?: GalleryImage;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_GALLERY_STATE);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl">
      {state.status === 'error' && state.message && (
        <p className="mb-5 rounded-lg bg-[rgba(214,69,69,.08)] px-4 py-3 text-sm text-[#D64545]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-6">
        <Field label="Title / caption" error={err.title}>
          <input name="title" defaultValue={image?.title} placeholder="e.g. Convocation 2025" className={inputClass} />
        </Field>

        <div>
          <FileUploadField
            module="gallery"
            name="image_url"
            label="Image"
            defaultUrl={image?.image_url}
            required
          />
          {err.image_url && <p className="mt-1.5 text-[13px] text-[#D64545]">{err.image_url}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" hint="Optional (e.g. Events, Campus)">
            <input name="category" defaultValue={image?.category ?? ''} placeholder="Events" className={inputClass} />
          </Field>
          <Field label="Sort order" hint="Lower shows first">
            <input name="sort_order" type="number" defaultValue={image?.sort_order ?? 0} className={inputClass} />
          </Field>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={image ? image.is_published : true}
            className="h-4 w-4 accent-navy"
          />
          <span className="text-sm font-medium text-text">
            Published <span className="text-muted">— visible in the public gallery</span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <SubmitButton label={submitLabel} />
        <Link
          href="/admin/gallery"
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
