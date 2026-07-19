import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { getCourseById } from '@/features/courses/queries';
import { updateCourse } from '@/features/courses/actions';

export const metadata: Metadata = { title: 'Edit course · Admin' };

/**
 * Edit an existing course. The course id is bound into `updateCourse` so the
 * shared CourseForm can call it with the standard (prevState, formData) shape.
 */
export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  const action = updateCourse.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit course" subtitle={course.name} />
      <div className="p-7">
        <CourseForm action={action} course={course} submitLabel="Save changes" />
      </div>
    </>
  );
}
