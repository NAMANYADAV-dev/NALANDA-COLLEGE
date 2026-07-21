import { siteConfig } from '@/config/site';
import type { Course } from '@/types/database.types';

/**
 * CourseJsonLd — schema.org structured data for a single programme.
 *
 * Emits two graphs: a `Course` (so the programme can appear as a rich result
 * rather than a plain blue link) and a `BreadcrumbList` (so search results show
 * "Nalanda College › Courses › B.Sc Agriculture" instead of a bare URL).
 *
 * Only fields we can state truthfully are included. `fee` is free text like
 * "₹12,000" and `duration` like "3 years" — neither maps cleanly onto the
 * `offers` / `timeRequired` shapes Google expects, and guessing at them risks a
 * structured-data penalty for markup that contradicts the page. Better a
 * smaller, correct graph.
 */
export function CourseJsonLd({ course }: { course: Course }) {
  const base = siteConfig.url.replace(/\/$/, '');
  const url = `${base}/courses/${course.slug}`;

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.about,
      url,
      inLanguage: 'en',
      coursePrerequisites: course.eligibility,
      provider: {
        '@type': 'CollegeOrUniversity',
        name: siteConfig.name,
        url: base,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: base },
        { '@type': 'ListItem', position: 2, name: 'Courses', item: `${base}/courses` },
        { '@type': 'ListItem', position: 3, name: course.name, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
