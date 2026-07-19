import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NoticeForm } from '@/features/notices/components/NoticeForm';
import { createNotice } from '@/features/notices/actions';

export const metadata: Metadata = { title: 'New notice · Admin' };

/** Create a new notice or event. */
export default function NewNoticePage() {
  return (
    <>
      <AdminHeader title="Add item" subtitle="Post a new notice or event" />
      <div className="p-7">
        <NoticeForm action={createNotice} submitLabel="Publish" />
      </div>
    </>
  );
}
