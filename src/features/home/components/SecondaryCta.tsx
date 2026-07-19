import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/** SecondaryCta — closing "Have a question?" prompt above the footer. */
export function SecondaryCta() {
  return (
    <Section className="text-center">
      <h2 className="section-title">Have a question?</h2>
      <p className="mx-auto mb-6 mt-3 max-w-xl text-base text-muted">
        Reach out to our team — we&apos;ll get back to you within 48 hours.
      </p>
      <div className="flex flex-wrap justify-center gap-3.5">
        <Button href="/contact" variant="ghost" size="lg">
          Contact us
        </Button>
        <Button href="/admissions" size="lg">
          Apply Now
        </Button>
      </div>
    </Section>
  );
}
