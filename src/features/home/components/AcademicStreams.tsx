import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CardRail, cardRailItem } from '@/components/ui/CardRail';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { levelBadgeTone } from '@/features/courses/data';
import type { Course } from '@/types/database.types';

/**
 * AcademicStreams — home page grid of course cards.
 *
 * A Server Component: the cards are now links to /courses/<slug> rather than
 * modal triggers, so there is no client state left to own. That takes this
 * section — and the detail markup it used to carry — out of the home page's
 * JavaScript bundle entirely.
 */
export function AcademicStreams({ courses }: { courses: Course[] }) {
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
          {/* Show only the first 6 on the home page; the rest live on /courses.
              On phones the cards swipe horizontally instead of stacking. */}
          <CardRail label="Courses" className="mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className={cn(
                  cardRailItem,
                  'flex flex-col items-start rounded-lg border border-border bg-surface p-6 text-left shadow-card transition-transform duration-150 hover:-translate-y-1 hover:shadow-card-hover',
                )}
              >
                <Badge tone={levelBadgeTone(course.level)}>{course.level}</Badge>
                <h3 className="mb-1 mt-3.5 font-head text-xl font-semibold text-text">{course.name}</h3>
                <p className="text-sm text-muted">{course.tagline}</p>
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold">
                  View details <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            ))}
          </CardRail>

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
    </Section>
  );
}
