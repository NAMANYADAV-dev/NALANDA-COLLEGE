import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getGalleryImages } from '@/features/gallery/queries';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A glimpse of life, learning and events across the Nalanda College campus.',
};

/** Gallery page — server-fetched images, client-side masonry + lightbox. */
export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHeader
        eyebrow="Campus life"
        title="Gallery"
        subtitle="A glimpse of life, learning and events across the campus. Click any photo to enlarge."
      />
      <GalleryGrid images={images} />
    </>
  );
}
