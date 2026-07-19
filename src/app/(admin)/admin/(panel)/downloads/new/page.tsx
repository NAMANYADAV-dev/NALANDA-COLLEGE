import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DownloadForm } from '@/features/downloads/components/DownloadForm';
import { createDownload } from '@/features/downloads/actions';

export const metadata: Metadata = { title: 'New download · Admin' };

/** Add a new downloadable resource. */
export default function NewDownloadPage() {
  return (
    <>
      <AdminHeader title="Add resource" subtitle="Add a downloadable file" />
      <div className="p-7">
        <DownloadForm action={createDownload} submitLabel="Add resource" />
      </div>
    </>
  );
}
