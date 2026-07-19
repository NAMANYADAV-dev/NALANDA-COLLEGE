'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from '@/components/ui/Icon';
import { searchItems, splitHighlight } from '@/features/search/filter';
import type { SearchItem, SearchType } from '@/features/search/types';

/**
 * SiteSearch — the site-wide instant search surface (lives inside the nav's
 * expanding bar). Fetches the search index once, then filters it on the client
 * for zero-latency results as the user types. Supports full keyboard control
 * (↑/↓ to move, Enter to open, Esc to close) and deep-links to the exact item.
 */

/** Module-level cache so re-opening search never re-fetches the index. */
let indexCache: SearchItem[] | null = null;

/** Icon + label shown per result type. */
const TYPE_META: Record<SearchType, { label: string; icon: IconName }> = {
  page: { label: 'Page', icon: 'arrow-right' },
  course: { label: 'Course', icon: 'cap' },
  faculty: { label: 'Faculty', icon: 'users' },
  notice: { label: 'Notice', icon: 'calendar' },
  event: { label: 'Event', icon: 'calendar' },
  gallery: { label: 'Gallery', icon: 'eye' },
  download: { label: 'Download', icon: 'file-down' },
};

/** Quick links shown before the user types anything. */
const POPULAR: { label: string; href: string }[] = [
  { label: 'B.Sc Agriculture', href: '/courses' },
  { label: 'Admission dates', href: '/admissions' },
  { label: 'Notices', href: '/notices' },
  { label: 'Fee structure', href: '/contact' },
];

export function SiteSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>(indexCache ?? []);
  const [loading, setLoading] = useState(!indexCache);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input, and refetch the index every time search opens so newly
  // added content (a new course/faculty/etc.) shows up without a page reload.
  // Cached results render instantly meanwhile; the fresh copy swaps in silently.
  useEffect(() => {
    inputRef.current?.focus();
    let alive = true;
    setLoading(!indexCache); // only show the loading hint on the very first open
    fetch('/api/search', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { items?: SearchItem[] }) => {
        if (!alive) return;
        indexCache = data.items ?? [];
        setItems(indexCache);
        setLoading(false);
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => (query.trim() ? searchItems(items, query) : []), [items, query]);

  // Keep the active row valid whenever the result set changes.
  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (item?: SearchItem) => {
      const target = item ?? results[active];
      if (!target) return;
      onClose();
      router.push(target.href);
    },
    [results, active, onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  const showResults = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-[760px]">
      {/* Input row */}
      <div className="relative">
        <Icon name="search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search courses, faculty, notices, gallery…"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="search-results"
          className="h-[52px] w-full rounded-[10px] border-[1.5px] border-navy bg-surface px-[52px] text-base text-text outline-none"
        />
        <button
          onClick={onClose}
          title="Close"
          className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-section-alt text-muted"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      {/* Results / hints */}
      <div id="search-results" role="listbox" className="mt-3">
        {!showResults ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-muted">Popular:</span>
            {POPULAR.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  onClose();
                  router.push(p.href);
                }}
                className="rounded-full bg-chip-bg px-3 py-[5px] text-[13px] font-medium text-navy hover:brightness-95 dark:text-gold-hi"
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : loading ? (
          <p className="px-1 py-3 text-sm text-muted">Loading…</p>
        ) : results.length === 0 ? (
          <p className="px-1 py-3 text-sm text-muted">
            No results for “<span className="font-medium text-text">{query}</span>”.
          </p>
        ) : (
          <ul className="max-h-[52vh] overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-[0_10px_30px_rgba(0,0,0,.12)]">
            {results.map((item, i) => {
              const meta = TYPE_META[item.type];
              const parts = splitHighlight(item.title, query);
              return (
                <li key={`${item.type}-${item.id}`} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                      i === active ? 'bg-section-alt' : 'hover:bg-section-alt',
                    )}
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-section-alt text-navy dark:text-gold-hi">
                      <Icon name={meta.icon} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-text">
                        {parts ? (
                          <>
                            {parts[0]}
                            <mark className="bg-transparent font-bold text-gold">{parts[1]}</mark>
                            {parts[2]}
                          </>
                        ) : (
                          item.title
                        )}
                      </span>
                      {item.subtitle && (
                        <span className="block truncate text-[13px] text-muted">{item.subtitle}</span>
                      )}
                    </span>
                    <span className="flex-none rounded-full bg-section-alt px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {meta.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
