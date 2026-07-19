import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getAllCourses } from '@/features/courses/queries';
import { levelBadgeTone } from '@/features/courses/data';
import { CourseRowActions } from '@/features/courses/components/CourseRowActions';

export const metadata: Metadata = { title: 'Courses · Admin' };

/** Admin courses list — every programme (published or not) with inline controls. */
export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <>
      <AdminHeader
        title="Courses"
        subtitle={`${courses.length} programme${courses.length === 1 ? '' : 's'}`}
        actions={
          <Link
            href="/admin/courses/new"
            className="flex h-10 items-center gap-1.5 rounded-[9px] bg-gold px-4 font-head text-sm font-semibold text-white hover:bg-gold-hover"
          >
            <Icon name="plus" size={16} /> Add course
          </Link>
        }
      />

      <div className="p-7">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {courses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Icon name="cap" size={38} className="mx-auto mb-3 text-muted" />
              <p className="font-head text-lg font-semibold text-text">No courses yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                Add your first programme — it will appear on the Courses page and the nav menu.
                (Connect Supabase and run the seed to import the sample courses.)
              </p>
              <Link
                href="/admin/courses/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-hover"
              >
                <Icon name="plus" size={16} /> Add course
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#fafbfd] text-[12px] font-semibold uppercase tracking-[0.04em] text-muted dark:bg-white/[0.03]">
                    <th className="px-6 py-3">Course</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Seats</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-text">{c.name}</div>
                        <div className="max-w-[320px] truncate text-[12.5px] text-muted">{c.tagline}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={levelBadgeTone(c.level)}>{c.level}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-muted">{c.duration}</td>
                      <td className="px-4 py-3.5 text-muted">{c.seats}</td>
                      <td className="px-4 py-3.5 text-muted">{c.fee}</td>
                      <td className="px-6 py-3.5">
                        <CourseRowActions id={c.id} isPublished={c.is_published} />
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
