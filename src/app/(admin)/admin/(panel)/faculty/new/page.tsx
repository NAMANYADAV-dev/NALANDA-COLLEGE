import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { FacultyForm } from '@/features/faculty/components/FacultyForm';
import { createFaculty } from '@/features/faculty/actions';

export const metadata: Metadata = { title: 'New faculty · Admin' };

/** Create a new faculty member. */
export default function NewFacultyPage() {
  return (
    <>
      <AdminHeader title="Add member" subtitle="Create a new faculty profile" />
      <div className="p-7">
        <FacultyForm action={createFaculty} submitLabel="Create profile" />
      </div>
    </>
  );
}
