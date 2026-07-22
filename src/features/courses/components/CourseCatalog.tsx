'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { FilterPills, type FilterOption } from '@/components/ui/FilterPills';
import { levelBadgeTone } from '@/features/courses/data';
import type { Course } from '@/types/database.types';

type Filter = 'all' | 'UG' | 'PG';

const FILTERS: FilterOption<Filter>[] = [
  { value: 'all', label: 'All' },
  { value: 'UG', label: 'Undergraduate' },
  { value: 'PG', label: 'Postgraduate' },
];

/**
 * CourseCatalog — the Courses page grid with a level filter.
 *
 * Client Component purely for the filter state; each card is a plain <Link> to
 * /courses/<slug>. It used to open a modal, which meant a programme had no URL
 * of its own — nothing to share, nothing to rank in search, and no working back
 * button. The detail now lives on a real page.
 *
 * The old `#course-<id>` hash deep-link handling went with the modal: search
 * results point straight at the course page now, so there is nothing to scroll
 * to and highlight.
 */
export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? courses : courses.filter((c) => c.level === filter)),
    [courses, filter],
  );

  return (
    <>
      {/* Sticky filter bar (sits directly under the 72px navbar) */}
      <div className="sticky top-[72px] z-30 border-b border-border bg-surface">
        <div className="container-page py-4">
          <FilterPills options={FILTERS} active={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="container-page py-12">
        {visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex w-full flex-col items-start rounded-lg border border-border bg-surface p-6 text-left shadow-card transition-transform duration-150 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex w-full items-center justify-between">
                  <Badge tone={levelBadgeTone(course.level)}>{course.level}</Badge>
                  <span className="text-[13px] text-muted">{course.duration}</span>
                </div>
                {/* h2: these cards are the first content level under the page h1 */}
                <h2 className="mb-1.5 mt-3.5 font-head text-xl font-semibold text-text">{course.name}</h2>
                <p className="mb-3.5 text-sm leading-relaxed text-muted">{course.about}</p>
                <div className="w-full border-t border-border pt-3 text-[13px] text-text">
                  <span className="text-muted">Eligibility:</span> {course.eligibility}
                </div>
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold">
                  View details <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center text-muted">
      <Icon name="file-down" size={46} className="mx-auto mb-3.5 text-gold" />
      <div className="font-head text-lg font-semibold text-text">No programmes in this category yet</div>
      <p className="mt-2 text-[15px]">Courses will appear here as they are added.</p>
    </div>
  );
}
