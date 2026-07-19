import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Icon, type IconName } from '@/components/ui/Icon';
import { AssetImage } from '@/components/ui/AssetImage';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Six decades of academic excellence at Nalanda College — our history, vision, mission and affiliation.',
};

/** Static value props shown in the "Why choose Nalanda" strip. */
const HIGHLIGHTS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'cap', title: 'NAAC Accredited', desc: 'Nationally validated quality standards.' },
  { icon: 'award', title: '60+ Years', desc: 'A trusted legacy since 1962.' },
  { icon: 'users', title: 'Expert Faculty', desc: 'Credentialed, caring mentors.' },
  { icon: 'trending', title: 'Placement Support', desc: 'Careers & higher-study guidance.' },
];

/** About page — static institutional content. Pure Server Component. */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="About Nalanda College"
        subtitle="Six decades of academic excellence, rooted in values and open to every learner."
      />

      {/* History */}
      <Section container={false}>
        <div className="mx-auto max-w-[820px] px-5 sm:px-6 lg:px-10">
          <h2 className="section-title mb-4">Our history</h2>
          <p className="mb-4 text-base leading-[1.7] text-text">
            Founded in 1962, Nalanda College began with a handful of arts programmes and a mission to
            bring quality higher education within reach of the district&apos;s students. Over the
            decades it has grown into a multi-faculty institution spanning the humanities, sciences,
            law and agriculture.
          </p>
          <p className="text-base leading-[1.7] text-text">
            Today the college serves thousands of students each year, pairing experienced faculty with
            modern laboratories, a well-stocked library and active campus life — while staying true to
            its founding commitment to accessible, values-driven education.
          </p>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section tone="alt">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-surface p-9 shadow-card">
            <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-navy/[0.08] text-navy dark:text-gold-hi">
              <Icon name="eye" size={26} />
            </div>
            <h3 className="mb-2.5 font-head text-xl font-semibold text-navy dark:text-gold-hi">Our vision</h3>
            <p className="text-base leading-relaxed text-text">
              To be a centre of learning that shapes capable, ethical and independent-minded graduates
              who contribute meaningfully to society.
            </p>
          </div>
          <div className="rounded-lg bg-surface p-9 shadow-card">
            <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gold/[0.12] text-gold">
              <Icon name="layers" size={26} />
            </div>
            <h3 className="mb-2.5 font-head text-xl font-semibold text-navy dark:text-gold-hi">Our mission</h3>
            <p className="text-base leading-relaxed text-text">
              To deliver accessible, high-quality education across disciplines, nurture curiosity, and
              support every student&apos;s growth through mentorship and opportunity.
            </p>
          </div>
        </div>
      </Section>

      {/* Affiliation banner */}
      <Section>
        <div className="flex flex-col items-start gap-8 rounded-xl bg-gradient-to-r from-navy to-navy-deep p-9 sm:flex-row sm:items-center sm:p-11">
          <div className="flex h-[150px] w-full flex-none items-center justify-center overflow-hidden rounded-xl bg-white p-3 sm:h-[160px] sm:w-[280px]">
            <AssetImage
              src={siteConfig.images.universityLogo}
              alt="Affiliating university logo"
              width={260}
              height={150}
              className="h-full w-full object-contain"
              fallback={<span className="text-center text-[13px] text-[#6b7a90]">University logo</span>}
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-hi">Affiliation</p>
            <h2 className="my-2 font-head text-2xl font-semibold text-white">
              Affiliated to the State University
            </h2>
            <p className="max-w-[60ch] text-base leading-relaxed text-[#c6d2e4]">
              All programmes are recognised and awarded by the State University, and the college is
              accredited by NAAC — assuring students of nationally validated degrees.
            </p>
          </div>
        </div>
      </Section>

      {/* Why choose */}
      <Section className="pt-0">
        <h2 className="section-title mb-10 text-center">Why choose Nalanda</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-section-alt text-gold">
                <Icon name={h.icon} size={26} />
              </div>
              <h3 className="mb-1.5 font-head text-lg font-semibold text-text">{h.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{h.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Principal's message */}
      <Section tone="alt">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-9 rounded-xl bg-surface p-8 shadow-card sm:flex-row sm:items-start sm:gap-12 sm:p-12">
          <div className="h-[200px] w-[200px] flex-none overflow-hidden rounded-2xl shadow-card sm:h-[240px] sm:w-[240px]">
            <AssetImage
              src={siteConfig.images.principal}
              alt={`${siteConfig.principal.name}, ${siteConfig.principal.title}`}
              width={240}
              height={240}
              className="h-full w-full object-cover"
              fallback={
                <span className="flex h-full w-full items-center justify-center bg-navy font-head text-[72px] font-bold text-white">
                  {siteConfig.principal.name.replace(/^Dr\.\s*/, '').charAt(0)}
                </span>
              }
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="eyebrow">Principal&apos;s message</p>
            <p className="my-4 font-head text-[22px] font-medium leading-[1.6] text-text sm:text-[26px]">
              &ldquo;Our purpose is simple — to help every student who walks through our gates leave
              more capable, more confident and more prepared for the world than when they arrived.&rdquo;
            </p>
            <div className="font-head text-lg font-semibold text-navy dark:text-gold-hi sm:text-xl">
              {siteConfig.principal.name}
            </div>
            <div className="text-[15px] text-muted">{siteConfig.principal.title}</div>
          </div>
        </div>
      </Section>
    </>
  );
}
