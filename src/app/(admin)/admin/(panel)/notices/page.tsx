import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getAllNoticesAdmin } from '@/features/notices/queries';
import { formatNoticeDate } from '@/features/notices/data';
import { NoticeRowActions } from '@/features/notices/components/NoticeRowActions';

export const metadata: Metadata = { title: 'Notices & Events · Admin' };

/** Admin notices list — every notice/event (published or not) with controls. */
export default async function AdminNoticesPage() {
  const notices = await getAllNoticesAdmin();

  return (
    <>
      <AdminHeader
        title="Notices & Events"
        subtitle={`${notices.length} item${notices.length === 1 ? '' : 's'}`}
        actions={
          <Link
            href="/admin/notices/new"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> Add item
          </Link>
        }
      />

      <div className="p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {notices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Icon name="bell" size={38} className="mx-auto mb-3 text-muted" />
              <p className="font-head text-lg font-semibold text-text">Nothing posted yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                Add your first notice or event — it will appear on the Home page and the Notices page.
              </p>
              <Link
                href="/admin/notices/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover"
              >
                <Icon name="plus" size={16} /> Add item
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#fafbfd] text-[12px] font-semibold uppercase tracking-[0.04em] text-muted dark:bg-white/[0.03]">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {notices.map((n) => {
                    const { day, month } = formatNoticeDate(n.published_at);
                    return (
                      <tr key={n.id}>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2 font-semibold text-text">
                            {n.is_pinned && (
                              <span title="Pinned" className="text-gold">
                                <Icon name="bell" size={14} />
                              </span>
                            )}
                            {n.title}
                          </div>
                          {n.location && <div className="text-[12.5px] text-muted">{n.location}</div>}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge tone={n.kind === 'event' ? 'gold' : 'navy'}>
                            {n.kind === 'event' ? 'Event' : 'Notice'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-muted">
                          {day} {month}
                        </td>
                        <td className="px-6 py-3.5">
                          <NoticeRowActions id={n.id} isPublished={n.is_published} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
