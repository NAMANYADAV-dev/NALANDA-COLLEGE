'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { updateEnquiryStatus, deleteEnquiry } from '@/features/enquiries/actions';
import type { EnquiryStatus } from '@/types/database.types';

/**
 * StatusActions — change a lead's status (new → read → resolved).
 *
 * Wraps the `updateEnquiryStatus` Server Action in a transition so the row
 * shows a pending state while the DB updates and the page revalidates.
 * `compact` renders the dashboard's single "Mark as done" affordance; the full
 * variant renders a three-state segmented control for the enquiries table.
 */
export function StatusActions({
  id,
  status,
  compact = false,
}: {
  id: string;
  status: EnquiryStatus;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const set = (next: EnquiryStatus) => startTransition(() => updateEnquiryStatus(id, next));
  const remove = () => startTransition(() => deleteEnquiry(id).catch(() => {}));

  if (compact) {
    return status === 'resolved' ? (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8f5ee] px-3 py-1.5 text-[12.5px] font-semibold text-[#2E8B57]">
        <Icon name="check" size={14} /> Done
      </span>
    ) : (
      <button
        onClick={() => set('resolved')}
        disabled={pending}
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-navy hover:bg-section-alt disabled:opacity-60 dark:text-gold-hi"
      >
        {pending ? 'Saving…' : 'Mark as done'}
      </button>
    );
  }

  const options: { value: EnquiryStatus; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="inline-flex items-center justify-end gap-2">
      <div className={cn('inline-flex rounded-lg bg-section-alt p-0.5', pending && 'opacity-60')}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => set(o.value)}
            disabled={pending}
            className={cn(
              'rounded-md px-2.5 py-1 text-[12.5px] font-semibold transition-colors',
              status === o.value ? 'bg-surface text-navy shadow-card dark:text-gold-hi' : 'text-muted hover:text-navy dark:hover:text-gold-hi',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Delete (two-step inline confirm — no accidental data loss) */}
      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            onClick={remove}
            disabled={pending}
            className="rounded-md bg-[#D64545] px-2.5 py-1.5 text-[12px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
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
          title="Delete enquiry"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-[#D64545] hover:bg-[rgba(214,69,69,.08)]"
        >
          <Icon name="trash" size={15} />
        </button>
      )}
    </div>
  );
}
