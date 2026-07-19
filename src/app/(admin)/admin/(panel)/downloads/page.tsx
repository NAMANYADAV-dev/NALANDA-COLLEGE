import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getAllDownloads } from '@/features/downloads/queries';
import { DownloadRowActions } from '@/features/downloads/components/DownloadRowActions';

export const metadata: Metadata = { title: 'Downloads · Admin' };

/** Admin downloads list — every resource (published or not) with controls. */
export default async function AdminDownloadsPage() {
  const downloads = await getAllDownloads();

  return (
    <>
      <AdminHeader
        title="Downloads"
        subtitle={`${downloads.length} resource${downloads.length === 1 ? '' : 's'}`}
        actions={
          <Link
            href="/admin/downloads/new"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> Add resource
          </Link>
        }
      />

      <div className="p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {downloads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Icon name="file-down" size={38} className="mx-auto mb-3 text-muted" />
              <p className="font-head text-lg font-semibold text-text">No resources yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                Add your first file — paste a link to the prospectus, a form or the syllabus.
              </p>
              <Link
                href="/admin/downloads/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover"
              >
                <Icon name="plus" size={16} /> Add resource
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#fafbfd] text-[12px] font-semibold uppercase tracking-[0.04em] text-muted dark:bg-white/[0.03]">
                    <th className="px-6 py-3">Resource</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {downloads.map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-text">{d.name}</div>
                        <div className="text-[12.5px] text-muted">{d.category ?? 'General'}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone="navy">{d.file_type}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-muted">{d.size_label ?? '—'}</td>
                      <td className="px-6 py-3.5">
                        <DownloadRowActions id={d.id} isPublished={d.is_published} />
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
