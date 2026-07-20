/**
 * Public loading UI — shown instantly by Next.js while a page's data resolves.
 *
 * Without this the previous page just sits there until the new one is ready,
 * which reads as "nothing happened… then the page snapped in". A lightweight
 * skeleton gives immediate feedback so navigation feels responsive.
 */
export default function PublicLoading() {
  return (
    <div className="animate-fade-in">
      {/* Page-header stand-in */}
      <div className="border-b border-border bg-section-alt px-5 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="h-3.5 w-28 animate-pulse rounded bg-border" />
          <div className="mt-4 h-9 w-2/3 max-w-md animate-pulse rounded bg-border" />
          <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-border" />
        </div>
      </div>

      {/* Content grid stand-in */}
      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
              <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-border" />
              <div className="mt-3 h-3.5 w-full animate-pulse rounded bg-border" />
              <div className="mt-2 h-3.5 w-5/6 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
