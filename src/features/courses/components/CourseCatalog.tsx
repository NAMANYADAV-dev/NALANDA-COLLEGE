'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { FilterPills, type FilterOption } from '@/components/ui/FilterPills';
import { levelBadgeTone } from '@/features/courses/data';
import { CourseDetailModal } from '@/features/courses/components/CourseDetailModal';
import { highlightElement } from '@/features/search/highlight';
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
 * Client Component that owns the active-filter state and the "which course is
 * open" state. Each card opens the shared <CourseDetailModal> — the same rich
 * detail view as the home page — so the experience is consistent everywhere.
 */
export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = courses.find((c) => c.id === activeId) ?? null;

  const visible = useMemo(
    () => (filter === 'all' ? courses : courses.filter((c) => c.level === filter)),
    [courses, filter],
  );

  // Deep-link support: when arriving via a `#course-<id>` search result, clear
  // the filter so the item is visible, then scroll to + highlight it.
  useEffect(() => {
    function handleHash() {
      const hash = decodeURIComponent(window.location.hash).replace('#', '');
      if (!hash.startsWith('course-')) return;
      const id = hash.slice('course-'.length);
      if (!courses.some((c) => c.id === id)) return;
      setFilter('all');
      window.setTimeout(() => highlightElement(hash), 60);
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [courses]);

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
              <button
                key={course.id}
                id={`course-${course.id}`}
                onClick={() => setActiveId(course.id)}
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
              </button>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {active && <CourseDetailModal course={active} onClose={() => setActiveId(null)} />}
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
