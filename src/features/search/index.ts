import 'server-only';
import { getPublishedCourses } from '@/features/courses/queries';
import { getPublishedFaculty } from '@/features/faculty/queries';
import { getAllNotices } from '@/features/notices/queries';
import { getGalleryImages } from '@/features/gallery/queries';
import { getDownloads } from '@/features/downloads/queries';
import type { SearchItem } from './types';

/**
 * Server-side search index builder.
 *
 * Assembles one flat list of everything searchable — static pages plus all
 * published content — reusing the existing feature query layer (so RLS and the
 * seed-fallback behaviour apply). The `/api/search` route serves this once to
 * the client, which then filters it locally.
 *
 * Each href lands on the exact item:
 *   courses         → `/courses/<slug>` (a real page of its own)
 *   faculty/notices → `/route#type-<id>` (scrolled + highlighted)
 *   gallery         → `/gallery?photo=<id>` (opens the lightbox)
 */

/** Static, always-present destinations. */
const PAGES: SearchItem[] = [
  { id: 'home', type: 'page', title: 'Home', href: '/', keywords: 'homepage start' },
  { id: 'about', type: 'page', title: 'About', subtitle: 'History, vision & mission', href: '/about', keywords: 'history vision mission principal affiliation' },
  { id: 'courses', type: 'page', title: 'Courses', subtitle: 'Programmes & eligibility', href: '/courses', keywords: 'programmes ug pg degrees academics' },
  { id: 'admissions', type: 'page', title: 'Admissions', subtitle: 'Apply for 2026–27', href: '/admissions', keywords: 'apply admission inquiry enrol join eligibility' },
  { id: 'faculty', type: 'page', title: 'Faculty', subtitle: 'Our teachers', href: '/faculty', keywords: 'professors teachers staff departments' },
  { id: 'notices', type: 'page', title: 'Notices & Events', subtitle: 'Announcements', href: '/notices', keywords: 'news events announcements updates' },
  { id: 'gallery', type: 'page', title: 'Gallery', subtitle: 'Campus photos', href: '/gallery', keywords: 'photos campus life images' },
  { id: 'contact', type: 'page', title: 'Contact', subtitle: 'Reach us', href: '/contact', keywords: 'contact address phone email map enquiry' },
];

/** Build the full search index (pages + all published content). */
export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [courses, faculty, notices, gallery, downloads] = await Promise.all([
    getPublishedCourses(),
    getPublishedFaculty(),
    getAllNotices(),
    getGalleryImages(),
    getDownloads(),
  ]);

  const items: SearchItem[] = [...PAGES];

  for (const c of courses) {
    items.push({
      id: c.id,
      type: 'course',
      title: c.name,
      subtitle: `${c.level} · ${c.duration}`,
      href: `/courses/${c.slug}`,
      keywords: [c.tagline, c.eligibility, ...c.subjects, ...c.careers].join(' '),
    });
  }

  for (const f of faculty) {
    items.push({
      id: f.id,
      type: 'faculty',
      title: f.name,
      subtitle: `${f.designation} · ${f.department}`,
      href: `/faculty#faculty-${f.id}`,
      keywords: [f.qualification, f.department].filter(Boolean).join(' '),
    });
  }

  for (const n of notices) {
    items.push({
      id: n.id,
      type: n.kind === 'event' ? 'event' : 'notice',
      title: n.title,
      subtitle: n.kind === 'event' ? n.location ?? 'Event' : 'Notice',
      href: `/notices#notice-${n.id}`,
      keywords: [n.body, n.location].filter(Boolean).join(' '),
    });
  }

  for (const g of gallery) {
    items.push({
      id: g.id,
      type: 'gallery',
      title: g.title,
      subtitle: g.category ?? 'Gallery',
      href: `/gallery?photo=${g.id}`,
      keywords: g.category ?? '',
    });
  }

  for (const d of downloads) {
    items.push({
      id: d.id,
      type: 'download',
      title: d.name,
      subtitle: [d.file_type, d.size_label].filter(Boolean).join(' · '),
      href: d.file_url && d.file_url !== '#' ? d.file_url : '/',
      keywords: 'download pdf resource',
    });
  }

  return items;
}
