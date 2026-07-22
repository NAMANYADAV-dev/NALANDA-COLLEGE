import { SkipLink } from '@/components/layout/SkipLink';
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
/**
 * Cache public pages and refresh them at most every 5 minutes. Admin actions
 * call `revalidatePath('/', 'layout')`, so edits still appear immediately — this
 * is just a safety net for changes made outside the admin (e.g. direct in DB).
 */
export const revalidate = 300;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [courses, settings] = await Promise.all([getPublishedCourses(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <OrganizationJsonLd contact={settings.contact} social={settings.social} />
      <SiteNav courses={courses} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter contact={settings.contact} social={settings.social} />
    </div>
  );
}
