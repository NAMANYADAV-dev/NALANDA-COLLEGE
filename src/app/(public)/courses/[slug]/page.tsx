import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CourseJsonLd } from '@/components/seo/CourseJsonLd';
import { levelBadgeTone } from '@/features/courses/data';
import {
  getPublishedCourseBySlug,
  getPublishedCourseSlugs,
} from '@/features/courses/queries';
import { siteConfig } from '@/config/site';

/**
 * /courses/[slug] — the public page for one programme.
 *
 * This is the page the whole site was missing. Course detail used to live only
 * in a modal, so a search for "B.Sc Agriculture eligibility" had nothing here
 * to land on. Now every programme is its own indexable, linkable, shareable URL.
 *
 * Statically prerendered via generateStaticParams and revalidated on the same
 * 5-minute cycle as the rest of the public site; a course added later is
 * rendered on first request rather than 404ing (dynamicParams defaults to true).
 */

type Params = { params: Promise<{ slug: string }> };

/** Prerender every published course at build time. */
export async function generateStaticParams() {
  const slugs = await getPublishedCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Per-course metadata. `alternates.canonical` matters here more than anywhere
 * else on the site: these pages are reachable with tracking parameters from
 * campaigns, and without a canonical each variant competes as duplicate content.
 *
/**
 * KNOWN ISSUE — soft 404 on unknown slugs.
 *
 * An unknown slug renders the 404 UI (see not-found.tsx) but the response
 * still carries a 200 status. Verified against a production build that this is
 * not caused by our code: it reproduces with the route static, fully dynamic,
 * with and without generateStaticParams, and with the not-found boundary at
 * both the segment and the app root. `notFound()` simply does not set the
 * status in this Next.js version under `next start`.
 *
 * So this returns `robots: noindex` rather than calling notFound() here. We
 * cannot fix the status, but we can stop a crawler indexing a dead course URL,
 * which is the harm the status code would have prevented. The page body still
 * calls notFound() to render the right UI. Re-check on the next Next.js
 * upgrade, and on Vercel, where the ISR cache handler differs.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    return { title: 'Course not found', robots: { index: false, follow: true } };
  }

  const path = `/courses/${course.slug}`;
  // The tagline is written as a summary line, which is exactly what a search
  // snippet needs; `about` is the fallback for older rows without one.
  const description = course.tagline || course.about;

  return {
    title: course.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${course.name} · ${siteConfig.name}`,
      description,
      url: path,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.name} · ${siteConfig.name}`,
      description,
    },
  };
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  // Unknown or unpublished slug → the shared 404, not an empty shell.
  if (!course) notFound();

  const facts = [
    { label: 'Duration', value: course.duration },
    { label: 'Seats', value: String(course.seats) },
    { label: 'Annual fee', value: course.fee },
  ];

  return (
    <>
      <CourseJsonLd course={course} />

      {/* Header — mirrors the navy panel the old detail modal used, so the
          programme still reads as one distinct "card" of information. */}
      <header className="bg-navy-deep py-12 text-white sm:py-16">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-[#9fb0c9]">
              <li>
                <Link href="/" className="hover:text-gold-hi">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/courses" className="hover:text-gold-hi">
                  Courses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {course.name}
              </li>
            </ol>
          </nav>

          <span className="inline-block rounded-full border border-gold/40 bg-gold/[0.18] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-gold-hi">
            {course.level} · {course.duration}
          </span>

          <h1 className="mt-4 max-w-[20ch] font-head text-[34px] font-bold leading-tight sm:text-[42px]">
            {course.name}
          </h1>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-[#c6d2e4]">
            {course.about}
          </p>
        </div>
      </header>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <dl className="mb-10 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-lg bg-section-alt px-4 py-3.5">
                  <dt className="mb-1 text-xs text-muted">{f.label}</dt>
                  <dd className="font-head text-base font-semibold text-navy dark:text-gold-hi">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {course.subjects.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-3 font-head text-xl font-semibold text-heading">Core subjects</h2>
                <ul className="flex flex-wrap gap-2">
                  {course.subjects.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-section-alt px-3.5 py-1.5 text-[13px] font-medium text-navy dark:text-gold-hi"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mb-10">
              <h2 className="mb-3 font-head text-xl font-semibold text-heading">Eligibility</h2>
              <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted">
                {course.eligibility}
              </p>
            </section>

            {course.careers.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-3 font-head text-xl font-semibold text-heading">Career paths</h2>
                <ul className="flex flex-wrap gap-2">
                  {course.careers.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-faint-gold px-3.5 py-1.5 text-[13px] font-medium text-gold"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Apply panel — sticky on desktop so the CTA stays in reach while
              reading a long subject list. */}
          <aside className="lg:sticky lg:top-[92px] lg:self-start">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <Badge tone={levelBadgeTone(course.level)}>{course.level}</Badge>
              <h2 className="mt-3 font-head text-lg font-semibold text-heading">
                Interested in {course.name}?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Send an inquiry and our admissions team will call you back within 48 hours.
              </p>
              <Button href="/admissions" className="mt-5 w-full shadow-none">
                Apply for this programme
              </Button>
              <Link
                href="/courses"
                className="mt-3 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-navy hover:underline dark:text-gold-hi"
              >
                <Icon name="arrow-right" size={14} className="rotate-180" />
                All courses
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
