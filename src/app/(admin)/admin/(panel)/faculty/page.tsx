import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Icon } from '@/components/ui/Icon';
import { getAllFaculty } from '@/features/faculty/queries';
import { facultyInitials, departmentColor } from '@/features/faculty/data';
import { FacultyRowActions } from '@/features/faculty/components/FacultyRowActions';

export const metadata: Metadata = { title: 'Faculty · Admin' };

/** Admin faculty list — every member (published or not) with inline controls. */
export default async function AdminFacultyPage() {
  const faculty = await getAllFaculty();

  return (
    <>
      <AdminHeader
        title="Faculty"
        subtitle={`${faculty.length} member${faculty.length === 1 ? '' : 's'}`}
        actions={
          <Link
            href="/admin/faculty/new"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> Add member
          </Link>
        }
      />

      <div className="p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {faculty.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Icon name="users" size={38} className="mx-auto mb-3 text-muted" />
              <p className="font-head text-lg font-semibold text-text">No faculty yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                Add your first member — they will appear on the Faculty page.
                (Connect Supabase and run the seed to import the sample staff.)
              </p>
              <Link
                href="/admin/faculty/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover"
              >
                <Icon name="plus" size={16} /> Add member
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#fafbfd] text-[12px] font-semibold uppercase tracking-[0.04em] text-muted dark:bg-white/[0.03]">
                    <th className="px-6 py-3">Member</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Qualification</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {faculty.map((f) => (
                    <tr key={f.id}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                            style={{ background: departmentColor(f.department) }}
                          >
                            {facultyInitials(f.name)}
                          </span>
                          <div>
                            <div className="font-semibold text-text">{f.name}</div>
                            <div className="text-[12.5px] text-muted">{f.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted">{f.department}</td>
                      <td className="px-4 py-3.5 text-muted">{f.qualification ?? '—'}</td>
                      <td className="px-6 py-3.5">
                        <FacultyRowActions id={f.id} isPublished={f.is_published} />
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
