import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { getPublishedCourses } from '@/features/courses/queries';
import { AdmissionForm } from '@/features/enquiries/components/AdmissionForm';

export const metadata: Metadata = {
  title: 'Admissions 2026–27',
  description:
    'A simple four-step admission process at Nalanda College. Submit an inquiry and our team will guide you.',
};

/** Four-step admission process (static). */
const STEPS = [
  { n: 1, title: 'Enquire', desc: 'Submit the inquiry form with your details and course of interest.' },
  { n: 2, title: 'Counselling', desc: 'Our team calls you to confirm eligibility and answer questions.' },
  { n: 3, title: 'Documents', desc: 'Submit mark sheets and required documents for verification.' },
  { n: 4, title: 'Enrol', desc: 'Complete admission, pay fees and join your programme.' },
];

/**
 * Admissions page — process overview + inquiry form. The course <select> is
 * populated from the live catalogue (server fetch), and the form posts to the
 * `submitEnquiry` Server Action.
 */
export default async function AdmissionsPage() {
  const courses = await getPublishedCourses();
  const courseNames = courses.map((c) => c.name);

  return (
    <>
      <PageHeader
        eyebrow="Join us"
        title="Admissions 2026–27"
        subtitle="A simple four-step process. Send us an inquiry and our team will guide you the rest of the way."
      />

      {/* Process steps */}
      <Section className="pb-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div
                className={`mb-3.5 flex h-11 w-11 items-center justify-center rounded-full font-head text-lg font-bold text-white ${
                  s.n === 4 ? 'bg-gold' : 'bg-navy'
                }`}
              >
                {s.n}
              </div>
              <h3 className="mb-1.5 font-head text-lg font-semibold text-text">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-7 text-[15px] leading-relaxed text-muted">
          <strong className="text-text">General eligibility:</strong> UG programmes require 10+2 (any
          recognised board); PG programmes require a relevant Bachelor&apos;s degree. Specific subject
          requirements vary by course — see the Courses page.
        </p>
      </Section>

      {/* Inquiry form */}
      <Section className="pt-4" container={false}>
        <div className="mx-auto max-w-[680px] px-5 sm:px-6 lg:px-10">
          <div className="rounded-lg border border-border bg-surface p-9 shadow-card">
            <AdmissionForm courses={courseNames} />
          </div>
        </div>
      </Section>
    </>
  );
}
