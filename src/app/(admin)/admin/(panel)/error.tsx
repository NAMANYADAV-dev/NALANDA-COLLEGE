'use client';

import { useEffect } from 'react';

/**
 * Error boundary for the admin panel.
 *
 * Separate from the public one on purpose: an admin is a known, signed-in staff
 * member, so this screen can be blunt about what failed and point at the likely
 * cause (a missing migration is by far the most common one during setup) rather
 * than showing a reassuring marketing message.
 *
 * It renders inside the (panel) layout, so the sidebar stays put and the admin
 * can move to another section instead of being stranded.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin] render error:', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <div className="w-full max-w-[480px] rounded-[12px] border border-border bg-surface p-7 shadow-sm">
        <h1 className="font-head text-[22px] font-bold text-heading">This section didn&apos;t load</h1>

        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          The page couldn&apos;t fetch its data. Retry first — most failures here are a dropped
          connection to Supabase.
        </p>

        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          If it fails every time, check that all the SQL files in{' '}
          <code className="font-mono text-[13px]">supabase/</code> have been run — a table or policy
          added after the initial setup is the usual culprit.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="flex h-10 items-center rounded-[9px] bg-navy px-5 font-head text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            Try again
          </button>
          <a
            href="/admin/dashboard"
            className="flex h-10 items-center rounded-[9px] border border-border bg-surface px-5 font-head text-sm font-semibold text-navy transition-colors hover:bg-section-alt dark:text-gold-hi"
          >
            Back to dashboard
          </a>
        </div>

        {error.digest && (
          <p className="mt-6 font-mono text-xs text-muted">Reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
