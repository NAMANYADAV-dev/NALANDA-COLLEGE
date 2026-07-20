'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Error boundary for the public site.
 *
 * Catches anything thrown while rendering a public page — most realistically a
 * Supabase query failing — and shows a branded recovery screen instead of the
 * framework's default. It renders *inside* the (public) layout, so the visitor
 * keeps the nav and footer and can navigate away.
 *
 * `reset()` re-renders the segment, which retries the failed fetch — the right
 * first move for a transient database or network blip.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-thrown errors reach the client only as an opaque `digest`; the real
    // message is in the server logs. Log what we have so the two can be matched.
    console.error('[public] render error:', error.digest ?? error.message);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-6 py-20 text-center">
      <span className="inline-block rounded-full border border-border bg-chip-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        Something went wrong
      </span>

      <h1 className="mt-5 font-head text-[32px] font-bold leading-tight text-heading">
        We couldn&apos;t load this page
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        This is usually temporary. Try again in a moment — if it keeps happening, please contact the
        college office and we&apos;ll sort it out.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-xs text-muted">Reference: {error.digest}</p>
      )}
    </section>
  );
}
