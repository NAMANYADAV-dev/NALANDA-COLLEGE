/**
 * Admin loading UI — instant feedback while an admin page's data resolves.
 * Admin routes stay dynamic (they read the session), so this is where the
 * skeleton matters most.
 */
export default function AdminLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header stand-in */}
      <div className="flex h-[72px] items-center justify-between border-b border-border bg-surface px-7">
        <div>
          <div className="h-5 w-40 animate-pulse rounded bg-border" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-border" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-[9px] bg-border" />
      </div>

      {/* Table stand-in */}
      <div className="p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="h-11 border-b border-border bg-[#fafbfd] dark:bg-white/[0.03]" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-0">
              <div className="h-4 w-1/4 animate-pulse rounded bg-border" />
              <div className="h-4 w-1/6 animate-pulse rounded bg-border" />
              <div className="h-4 w-1/5 animate-pulse rounded bg-border" />
              <div className="ml-auto h-8 w-28 animate-pulse rounded-md bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
