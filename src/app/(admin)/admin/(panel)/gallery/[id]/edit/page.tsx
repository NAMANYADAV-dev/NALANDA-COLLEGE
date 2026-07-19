import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GalleryForm } from '@/features/gallery/components/GalleryForm';
import { getGalleryImageById } from '@/features/gallery/queries';
import { updateGalleryImage } from '@/features/gallery/actions';

export const metadata: Metadata = { title: 'Edit image · Admin' };

/**
 * Edit an existing gallery image. The id is bound into `updateGalleryImage` so
 * the shared GalleryForm can call it with the standard (prevState, formData) shape.
 */
export default async function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await getGalleryImageById(id);
  if (!image) notFound();

  const action = updateGalleryImage.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit image" subtitle={image.title} />
      <div className="p-7">
        <GalleryForm action={action} image={image} submitLabel="Save changes" />
      </div>
    </>
  );
}
