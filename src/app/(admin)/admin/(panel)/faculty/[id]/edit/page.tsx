import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { FacultyForm } from '@/features/faculty/components/FacultyForm';
import { getFacultyById } from '@/features/faculty/queries';
import { updateFaculty } from '@/features/faculty/actions';

export const metadata: Metadata = { title: 'Edit faculty · Admin' };

/**
 * Edit an existing faculty member. The id is bound into `updateFaculty` so the
 * shared FacultyForm can call it with the standard (prevState, formData) shape.
 */
export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faculty = await getFacultyById(id);
  if (!faculty) notFound();

  const action = updateFaculty.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit member" subtitle={faculty.name} />
      <div className="p-7">
        <FacultyForm action={action} faculty={faculty} submitLabel="Save changes" />
      </div>
    </>
  );
}
