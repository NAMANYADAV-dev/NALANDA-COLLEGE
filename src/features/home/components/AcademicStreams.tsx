'use client';

import { useState } from 'react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { levelBadgeTone } from '@/features/courses/data';
import { CourseDetailModal } from '@/features/courses/components/CourseDetailModal';
import type { Course } from '@/types/database.types';

/**
 * AcademicStreams — home page grid of course cards that open a detail modal.
 *
 * Client Component: it owns the "which course is open" UI state. The course
 * DATA is fetched on the server (see the Home page) and passed in as props. The
 * detail view is the shared <CourseDetailModal>, identical to the /courses page.
 */
export function AcademicStreams({ courses }: { courses: Course[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = courses.find((c) => c.id === activeId) ?? null;

  return (
    <Section>
      <SectionHeading
        title="Academic streams"
        subtitle="Choose a stream to see programmes, eligibility and duration."
      />

      {courses.length === 0 ? (
        <p className="mt-10 text-center text-muted">Programmes will be listed here soon.</p>
      ) : (
        <>
          {/* Show only the first 6 on the home page; the rest live on /courses. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <button
                key={course.id}
                onClick={() => setActiveId(course.id)}
                className="flex w-full flex-col items-start rounded-lg border border-border bg-surface p-6 text-left shadow-card transition-transform duration-150 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <Badge tone={levelBadgeTone(course.level)}>{course.level}</Badge>
                <h3 className="mb-1 mt-3.5 font-head text-xl font-semibold text-text">{course.name}</h3>
                <p className="text-sm text-muted">{course.tagline}</p>
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold">
                  View details <Icon name="arrow-right" size={14} />
                </span>
              </button>
            ))}
          </div>

          {courses.length > 6 && (
            <div className="mt-9 flex justify-center">
              <Button href="/courses" variant="ghost">
                <span className="inline-flex items-center gap-2">
                  View all {courses.length} courses <Icon name="arrow-right" size={16} />
                </span>
              </Button>
            </div>
          )}
        </>
      )}

      {active && <CourseDetailModal course={active} onClose={() => setActiveId(null)} />}
    </Section>
  );
}
