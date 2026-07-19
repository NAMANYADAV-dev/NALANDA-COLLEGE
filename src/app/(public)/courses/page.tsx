import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getPublishedCourses } from '@/features/courses/queries';
import { CourseCatalog } from '@/features/courses/components/CourseCatalog';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore undergraduate and postgraduate programmes across four faculties at Nalanda College.',
};

/** Courses page — fetches the catalogue on the server, filters on the client. */
export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Courses & programmes"
        subtitle="Explore our undergraduate and postgraduate programmes across four faculties."
      />
      <CourseCatalog courses={courses} />
    </>
  );
}
