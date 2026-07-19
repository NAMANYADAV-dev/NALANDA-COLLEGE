import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { formatNoticeDate } from '@/features/notices/data';
import type { Notice } from '@/types/database.types';

/**
 * NoticesPreview — latest notices & events grid.
 * Presentation only; `notices` are fetched server-side and passed in.
 */
export function NoticesPreview({ notices }: { notices: Notice[] }) {
  return (
    <Section tone="alt">
      <div className="mb-7 flex items-baseline justify-between">
        <h2 className="section-title">Latest notices &amp; events</h2>
        <Link href="/notices" className="text-[15px] font-semibold text-navy hover:text-gold dark:text-gold-hi">
          View all →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {notices.map((notice) => {
          const { day, month } = formatNoticeDate(notice.published_at);
          const isEvent = notice.kind === 'event';
          return (
            <Link
              key={notice.id}
              href="/notices"
              className="flex items-start gap-4 rounded-lg bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div
                className={cn(
                  'min-w-[58px] flex-none rounded-lg px-3 py-2 text-center text-white',
                  isEvent ? 'bg-gold' : 'bg-navy',
                )}
              >
                <div className="font-head text-xl font-bold leading-none">{day}</div>
                <div className="text-[11px] tracking-[0.06em]">{month}</div>
              </div>
              <div>
                <Badge tone={isEvent ? 'gold' : 'navy'} className="uppercase tracking-[0.08em]">
                  {isEvent ? 'Event' : 'Notice'}
                </Badge>
                <div className="mt-1.5 font-head text-base font-semibold text-text">{notice.title}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 sm:hidden">
        <Link href="/notices" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy dark:text-gold-hi">
          View all notices <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </Section>
  );
}
