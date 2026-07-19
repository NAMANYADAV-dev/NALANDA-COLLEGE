import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GalleryForm } from '@/features/gallery/components/GalleryForm';
import { createGalleryImage } from '@/features/gallery/actions';

export const metadata: Metadata = { title: 'New image · Admin' };

/** Add a new gallery image. */
export default function NewGalleryImagePage() {
  return (
    <>
      <AdminHeader title="Add image" subtitle="Add a photo to the gallery" />
      <div className="p-7">
        <GalleryForm action={createGalleryImage} submitLabel="Add image" />
      </div>
    </>
  );
}
