import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getPublishedCourses } from '@/features/courses/queries';

/**
 * sitemap.xml — lists the public pages for search engines. Next.js serves this
 * at /sitemap.xml automatically. Admin routes are intentionally excluded (see
 * robots.ts). The base URL comes from NEXT_PUBLIC_SITE_URL (set it to the real
 * domain in production so the URLs are absolute and correct).
 *
 * Course pages are pulled from the database rather than hardcoded, so adding a
 * programme in the admin panel puts it in the sitemap automatically. A static
 * list would go stale the first time someone added a course — the exact pages
 * that most need to be discovered.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const routes: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/courses', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/admissions', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faculty', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/notices', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/gallery', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/downloads', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Priority 0.8: below the hub pages, above the rest of the site. These are
  // the high-intent landing pages ("<course> eligibility", "<course> fees").
  const courses = await getPublishedCourses();
  const courseEntries: MetadataRoute.Sitemap = courses
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${base}/courses/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticEntries, ...courseEntries];
}
