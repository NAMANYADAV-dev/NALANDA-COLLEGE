import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { HERO_STATS } from '@/features/home/data';

/**
 * Hero — headline, primary CTAs, and the overlapping stats card.
 *
 * Server Component (no interactivity). The campus photo is the page's LCP
 * element, so it uses <Image priority>: Next.js emits a <link rel="preload">
 * (the browser fetches it immediately instead of discovering it late through
 * CSS) and serves a resized WebP/AVIF instead of the full-size source. The
 * brand gradient sits behind as a fallback, with a readability overlay above.
 */
export function Hero() {
  return (
    <section className="relative">
      {/* Media + overlay */}
      <div className="hero-media relative h-[520px] overflow-hidden bg-[radial-gradient(120%_90%_at_80%_10%,#1d3a63_0%,#12294D_45%,#0e1a2e_100%)] md:h-[600px]">
        <Image
          src={siteConfig.images.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          // The readability overlay above hides compression artefacts, so the
          // hero can afford a lower quality — smaller LCP bytes for free.
          quality={60}
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(11,20,38,.92)_0%,rgba(18,41,77,.82)_42%,rgba(18,41,77,.28)_100%)]" />

        <div className="container-page relative flex h-full flex-col justify-center">
          <div className="max-w-[620px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-[7px] text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-hi">
              Est. {siteConfig.established} · NAAC Accredited
            </span>
            <h1 className="mt-5 font-head text-[34px] font-bold leading-[1.1] tracking-[-0.01em] text-white md:text-[52px]">
              Where curiosity becomes{' '}
              <span className="border-b-[5px] border-gold pb-0.5 text-gold-hi">capability</span>.
            </h1>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-[#dce4f0] md:text-lg">
              A six-decade legacy of arts, science, law and agriculture education — shaping graduates
              who lead in their fields.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href="/admissions" size="lg">
                Apply Now
              </Button>
              <Button href="/courses" size="lg" variant="hero-ghost">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping stats card */}
      <div className="container-page">
        <div className="relative z-[5] mx-auto -mt-10 grid max-w-[1120px] grid-cols-2 rounded-xl bg-surface p-2 shadow-[0_18px_44px_rgba(18,41,77,.16)] md:-mt-14 md:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`border-border px-5 py-6 text-center ${i < HERO_STATS.length - 1 ? 'md:border-r' : ''} ${i < 2 ? 'max-md:border-b' : ''} ${i % 2 === 0 ? 'max-md:border-r' : ''}`}
            >
              <div className="font-head text-[34px] font-bold text-heading">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
