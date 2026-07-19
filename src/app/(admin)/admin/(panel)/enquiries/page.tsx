import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { getEnquiries } from '@/features/enquiries/queries';
import { StatusActions } from '@/features/enquiries/components/StatusActions';
import { ExportEnquiriesButton } from '@/features/enquiries/components/ExportEnquiriesButton';
import type { EnquiryStatus } from '@/types/database.types';

export const metadata: Metadata = { title: 'Enquiries · Admin' };

/** Status filter tabs (query-param driven, server-filtered). */
const TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'resolved', label: 'Resolved' },
];

/**
 * Enquiries — lead inbox. Reads `?status=` to filter server-side, lists the
 * leads submitted via the public forms, and lets an admin move each through
 * its lifecycle with <StatusActions/>.
 */
export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = TABS.some((t) => t.value === status) ? (status as string) : 'all';
  const filter = active === 'all' ? undefined : (active as EnquiryStatus);
  const enquiries = await getEnquiries(filter);

  return (
    <>
      <AdminHeader
        title="Enquiries"
        subtitle="Leads from the Contact & Admissions forms"
        actions={<ExportEnquiriesButton enquiries={enquiries} />}
      />

      <div className="flex flex-col gap-4 p-7">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={t.value === 'all' ? '/admin/enquiries' : `/admin/enquiries?status=${t.value}`}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                active === t.value
                  ? 'bg-navy text-white dark:bg-gold dark:text-navy-deep'
                  : 'border border-border bg-surface text-navy hover:bg-section-alt dark:text-gold-hi',
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {enquiries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Icon name="mail" size={38} className="mx-auto mb-3 text-muted" />
              <p className="font-head text-lg font-semibold text-text">No enquiries here</p>
              <p className="mt-1 text-sm text-muted">
                {active === 'all'
                  ? 'Leads from the website forms will show up here.'
                  : `No ${active} enquiries right now.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#fafbfd] text-[12px] font-semibold uppercase tracking-[0.04em] text-muted dark:bg-white/[0.03]">
                    <th className="px-6 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Interested in</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((e) => (
                    <tr key={e.id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text">{e.name}</div>
                        <a href={`mailto:${e.email}`} className="text-[13px] text-muted hover:text-gold">
                          {e.email}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-muted">{e.phone ?? '—'}</td>
                      <td className="px-4 py-4">
                        {e.subject ? (
                          <span className="inline-block rounded-full bg-section-alt px-2.5 py-1 text-[12.5px] font-semibold text-navy dark:text-gold-hi">
                            {e.subject}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="max-w-[280px] px-4 py-4 text-[13px] leading-relaxed text-muted">
                        {e.message}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[13px] text-muted">
                        {new Date(e.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusActions id={e.id} status={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
