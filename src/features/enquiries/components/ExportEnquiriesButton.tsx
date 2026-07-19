'use client';

import { Icon } from '@/components/ui/Icon';
import type { Enquiry } from '@/types/database.types';

/**
 * ExportEnquiriesButton — download the current enquiry list as a CSV file.
 *
 * Runs entirely in the browser from data the page already has (no server call,
 * no storage) — it builds a CSV string and triggers a download. Exports exactly
 * what's shown (respects the active status filter), so switching to "All" first
 * gives a full backup. A UTF-8 BOM is prepended so Excel opens it correctly.
 */
export function ExportEnquiriesButton({ enquiries }: { enquiries: Enquiry[] }) {
  function download() {
    const headers = ['Name', 'Email', 'Phone', 'Interested in', 'Message', 'Status', 'Received'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const rows = enquiries.map((e) =>
      [
        e.name,
        e.email,
        e.phone ?? '',
        e.subject ?? '',
        e.message,
        e.status,
        new Date(e.created_at).toLocaleString('en-GB'),
      ]
        .map(esc)
        .join(','),
    );

    const csv = [headers.map(esc).join(','), ...rows].join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      disabled={enquiries.length === 0}
      title={enquiries.length === 0 ? 'Nothing to export' : 'Download as CSV'}
      className="flex h-10 items-center gap-1.5 rounded-[9px] border border-border bg-surface px-4 font-head text-sm font-semibold text-navy hover:bg-section-alt disabled:opacity-50 dark:text-gold-hi"
    >
      <Icon name="file-down" size={16} /> Export CSV
    </button>
  );
}
