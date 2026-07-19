import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NoticeForm } from '@/features/notices/components/NoticeForm';
import { getNoticeById } from '@/features/notices/queries';
import { updateNotice } from '@/features/notices/actions';

export const metadata: Metadata = { title: 'Edit notice · Admin' };

/**
 * Edit an existing notice/event. The id is bound into `updateNotice` so the
 * shared NoticeForm can call it with the standard (prevState, formData) shape.
 */
export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) notFound();

  const action = updateNotice.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit item" subtitle={notice.title} />
      <div className="p-7">
        <NoticeForm action={action} notice={notice} submitLabel="Save changes" />
      </div>
    </>
  );
}
