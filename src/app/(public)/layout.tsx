import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { getPublishedCourses } from '@/features/courses/queries';
import { getSiteSettings } from '@/features/settings/queries';

/**
 * Public layout — shared chrome (nav + footer) for all marketing pages in the
 * (public) route group: Home, About, Courses, Admissions, Faculty, Notices,
 * Gallery, Contact. The (public) folder is a route group, so it adds no URL
 * segment — Home still lives at "/".
 *
 * Fetches the course catalogue here (server-side) so the nav's Courses
 * mega-menu can list the live programmes on every page.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [courses, settings] = await Promise.all([getPublishedCourses(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <OrganizationJsonLd contact={settings.contact} social={settings.social} />
      <SiteNav courses={courses} />
      <main className="flex-1">{children}</main>
      <SiteFooter contact={settings.contact} social={settings.social} />
    </div>
  );
}
