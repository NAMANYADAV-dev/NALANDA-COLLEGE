import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DownloadForm } from '@/features/downloads/components/DownloadForm';
import { getDownloadById } from '@/features/downloads/queries';
import { updateDownload } from '@/features/downloads/actions';

export const metadata: Metadata = { title: 'Edit download · Admin' };

/**
 * Edit an existing download. The id is bound into `updateDownload` so the
 * shared DownloadForm can call it with the standard (prevState, formData) shape.
 */
export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const download = await getDownloadById(id);
  if (!download) notFound();

  const action = updateDownload.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit resource" subtitle={download.name} />
      <div className="p-7">
        <DownloadForm action={action} download={download} submitLabel="Save changes" />
      </div>
    </>
  );
}
