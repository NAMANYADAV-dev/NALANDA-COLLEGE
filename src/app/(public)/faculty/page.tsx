import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getPublishedFaculty } from '@/features/faculty/queries';
import { FacultyDirectory } from '@/features/faculty/components/FacultyDirectory';

export const metadata: Metadata = {
  title: 'Faculty',
  description: 'Meet the experienced, credentialed teachers who mentor every student at Nalanda College.',
};

/** Faculty page — server-fetched directory, client-side department filter. */
export default async function FacultyPage() {
  const faculty = await getPublishedFaculty();

  return (
    <>
      <PageHeader
        eyebrow="Our people"
        title="Faculty"
        subtitle="Experienced, credentialed teachers who mentor every student personally."
      />
      <FacultyDirectory faculty={faculty} />
    </>
  );
}
