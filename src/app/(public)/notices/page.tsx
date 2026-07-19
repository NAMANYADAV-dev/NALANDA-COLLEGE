import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getAllNotices } from '@/features/notices/queries';
import { NoticesBoard } from '@/features/notices/components/NoticesBoard';

export const metadata: Metadata = {
  title: 'Notices & Events',
  description: 'Official announcements and upcoming campus events at Nalanda College — newest first.',
};

/** Notices page — server-fetched feed, client-side Notices/Events tabs. */
export default async function NoticesPage() {
  const notices = await getAllNotices();

  return (
    <>
      <PageHeader
        eyebrow="Stay updated"
        title="Notices & Events"
        subtitle="Official announcements and upcoming campus events — newest first."
      />
      <NoticesBoard notices={notices} />
    </>
  );
}
