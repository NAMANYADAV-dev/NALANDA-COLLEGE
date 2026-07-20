'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { deleteCourse, toggleCoursePublished } from '@/features/courses/actions';

/**
 * CourseRowActions — per-row admin controls for a course.
 *
 * Publish toggle and delete both wrap their Server Action in a transition for a
 * pending state. Delete uses a two-step inline confirm (no native dialog), so a
 * misclick can't destroy data.
 */
export function CourseRowActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const togglePublish = () =>
    startTransition(() => toggleCoursePublished(id, !isPublished).catch(() => {}));
  const remove = () => startTransition(() => deleteCourse(id).catch(() => {}));

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Publish toggle */}
      <button
        onClick={togglePublish}
        disabled={pending}
        title={isPublished ? 'Published — click to hide' : 'Hidden — click to publish'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors disabled:opacity-60',
          isPublished ? 'bg-[#e8f5ee] text-[#1b6e3d]' : 'bg-section-alt text-muted',
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', isPublished ? 'bg-[#1b6e3d]' : 'bg-muted')} />
        {isPublished ? 'Published' : 'Hidden'}
      </button>

      {/* Edit */}
      <Link
        href={`/admin/courses/${id}/edit`}
        title="Edit"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-navy hover:bg-section-alt dark:text-gold-hi"
      >
        <Icon name="pencil" size={15} />
      </Link>

      {/* Delete (two-step) */}
      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            onClick={remove}
            disabled={pending}
            className="rounded-md bg-[#b91c1c] px-2.5 py-1.5 text-[12px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            {pending ? '…' : 'Delete'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded-md border border-border px-2.5 py-1.5 text-[12px] font-semibold text-text hover:bg-section-alt"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          title="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-[#b91c1c] hover:bg-[rgba(214,69,69,.08)]"
        >
          <Icon name="trash" size={15} />
        </button>
      )}
    </div>
  );
}
