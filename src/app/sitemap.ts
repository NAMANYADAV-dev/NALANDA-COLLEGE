import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * sitemap.xml — lists the public pages for search engines. Next.js serves this
 * at /sitemap.xml automatically. Admin routes are intentionally excluded (see
 * robots.ts). The base URL comes from NEXT_PUBLIC_SITE_URL (set it to the real
 * domain in production so the URLs are absolute and correct).
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
