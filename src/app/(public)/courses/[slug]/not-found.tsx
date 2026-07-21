import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * 404 for an unknown course slug.
 *
 * Scoped to this segment rather than falling through to the site-wide 404, for
 * two reasons: it renders inside the (public) layout so the visitor keeps the
 * nav and footer, and it can answer the actual question — "that programme
 * isn't here, but the full list is one click away". A generic "page not found"
 * on a course URL is a dead end for someone who searched for a programme.
 *
 * Reached when the slug doesn't match a published course, which also covers a
 * course that was unpublished after its URL was shared or indexed.
 */
export default function CourseNotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-[620px] flex-col items-center justify-center px-6 py-20 text-center">
      <span className="inline-block rounded-full border border-border bg-chip-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        Course not found
      </span>

      <h1 className="mt-5 font-head text-[30px] font-bold leading-tight text-heading">
        We couldn&apos;t find that programme
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        It may have been renamed, or is no longer offered. Browse the current programmes to find
        what you&apos;re looking for.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/courses">View all courses</Button>
        <Button href="/admissions" variant="ghost">
          Admissions
        </Button>
      </div>

      <Link href="/" className="mt-6 text-[13px] font-semibold text-navy hover:underline dark:text-gold-hi">
        Back to home
      </Link>
    </section>
  );
}
