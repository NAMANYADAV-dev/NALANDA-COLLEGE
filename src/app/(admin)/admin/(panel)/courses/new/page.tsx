import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { createCourse } from '@/features/courses/actions';

export const metadata: Metadata = { title: 'New course · Admin' };

/** Create a new course. */
export default function NewCoursePage() {
  return (
    <>
      <AdminHeader title="Add course" subtitle="Create a new programme" />
      <div className="p-7">
        <CourseForm action={createCourse} submitLabel="Create course" />
      </div>
    </>
  );
}
