'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatNoticeDate } from '@/features/notices/data';
import { highlightElement } from '@/features/search/highlight';
import type { Notice } from '@/types/database.types';

type Tab = 'notice' | 'event';

/**
 * NoticesBoard — Notices page with a Notices/Events segmented toggle.
 * Splits the server-provided list by `kind` and renders the active tab.
 */
export function NoticesBoard({ notices }: { notices: Notice[] }) {
  const [tab, setTab] = useState<Tab>('notice');

  const { noticeItems, eventItems } = useMemo(
    () => ({
      noticeItems: notices.filter((n) => n.kind === 'notice'),
      eventItems: notices.filter((n) => n.kind === 'event'),
    }),
    [notices],
  );

  const visible = tab === 'notice' ? noticeItems : eventItems;

  // Deep-link support: `#notice-<id>` from search → switch to the right tab
  // (notice vs event), then scroll to + highlight the item.
  useEffect(() => {
    function handleHash() {
      const hash = decodeURIComponent(window.location.hash).replace('#', '');
      if (!hash.startsWith('notice-')) return;
      const id = hash.slice('notice-'.length);
      const match = notices.find((n) => n.id === id);
      if (!match) return;
      setTab(match.kind);
      window.setTimeout(() => highlightElement(hash), 60);
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [notices]);

  return (
    <div className="container-page py-10">
      {/* Segmented control */}
      <div className="mb-7 inline-flex rounded-[10px] bg-section-alt p-1">
        {(['notice', 'event'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-lg px-6 py-2.5 text-[15px] font-semibold transition-colors',
              tab === t ? 'bg-surface text-navy shadow-card dark:text-gold-hi' : 'text-muted',
            )}
          >
            {t === 'notice' ? 'Notices' : 'Events'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3.5">
        {visible.map((item) => {
          const { day, month } = formatNoticeDate(item.published_at);
          const isEvent = item.kind === 'event';
          return (
            <article
              key={item.id}
              id={`notice-${item.id}`}
              className="flex gap-[18px] rounded-lg border border-border bg-surface p-[22px] shadow-card"
            >
              <div
                className={cn(
                  'h-fit min-w-[66px] flex-none rounded-lg px-3.5 py-2.5 text-center text-white',
                  isEvent ? 'bg-gold' : 'bg-navy',
                )}
              >
                <div className="font-head text-[22px] font-bold leading-none">{day}</div>
                <div className="text-[11px] tracking-[0.06em]">{month}</div>
              </div>
              <div>
                <Badge tone={isEvent ? 'gold' : 'navy'} className="uppercase tracking-[0.08em]">
                  {isEvent ? 'Event' : 'Notice'}
                </Badge>
                {/* h2: these cards are the first content level under the page h1 */}
                <h2 className="mb-1.5 mt-2 font-head text-lg font-semibold text-text">{item.title}</h2>
                {isEvent && item.location && (
                  <div className="mb-1.5 flex items-center gap-1.5 text-[13px] text-muted">
                    <Icon name="map-pin" size={13} className="text-gold" />
                    {item.location}
                  </div>
                )}
                {item.body && <p className="text-sm leading-relaxed text-muted">{item.body}</p>}
              </div>
            </article>
          );
        })}

        {visible.length === 0 && (
          <div className="py-12 text-center font-head text-lg font-semibold text-text">
            Nothing here yet — check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
