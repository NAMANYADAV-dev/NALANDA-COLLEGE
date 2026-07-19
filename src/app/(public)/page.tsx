import { getPublishedCourses } from '@/features/courses/queries';
import { getLatestNotices } from '@/features/notices/queries';
import { getDownloads } from '@/features/downloads/queries';
import { getGalleryImages } from '@/features/gallery/queries';
import { getSiteSettings } from '@/features/settings/queries';

import { Hero } from '@/features/home/components/Hero';
import { DatesBar } from '@/features/home/components/DatesBar';
import { StudentPortal } from '@/features/home/components/StudentPortal';
import { AcademicStreams } from '@/features/home/components/AcademicStreams';
import { NoticesPreview } from '@/features/home/components/NoticesPreview';
import { Placements } from '@/features/home/components/Placements';
import { TrustBand } from '@/features/home/components/TrustBand';
import { Testimonials } from '@/features/home/components/Testimonials';
import { DownloadsSection } from '@/features/home/components/DownloadsSection';
import { Faq } from '@/features/home/components/Faq';
import { GalleryPreview } from '@/features/home/components/GalleryPreview';
import { SecondaryCta } from '@/features/home/components/SecondaryCta';

/**
 * Home page (route "/").
 *
 * A Server Component: it fetches the dynamic content (courses, notices,
 * downloads) in parallel on the server, then composes the page from feature
 * sections. Interactive sections (AcademicStreams, Faq) receive their data as
 * props and manage only their own UI state on the client. This keeps data
 * fetching on the server and ships minimal JS to the browser.
 */
export default async function HomePage() {
  // Fetch independent datasets concurrently to minimise total latency.
  const [courses, notices, downloads, gallery, settings] = await Promise.all([
    getPublishedCourses(),
    getLatestNotices(4),
    getDownloads(),
    getGalleryImages(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />
      <DatesBar dates={settings.admission} />
      <StudentPortal links={settings.portal} />
      <AcademicStreams courses={courses} />
      <NoticesPreview notices={notices} />
      <Placements />
      <TrustBand />
      <Testimonials />
      <DownloadsSection downloads={downloads} />
      <Faq />
      <GalleryPreview images={gallery} />
      <SecondaryCta />
    </>
  );
}
