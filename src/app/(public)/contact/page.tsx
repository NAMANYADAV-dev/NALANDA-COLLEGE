import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ContactForm } from '@/features/enquiries/components/ContactForm';
import { getSiteSettings } from '@/features/settings/queries';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Nalanda College about programmes, admissions or campus visits.',
};

/** Contact page — info + map placeholder alongside the message form. */
export default async function ContactPage() {
  // Contact details come from the admin site settings (fallback in config).
  const { contact } = await getSiteSettings();
  const DETAILS: { icon: IconName; label: string; lines: string[] }[] = [
    { icon: 'map-pin', label: 'Address', lines: [contact.address] },
    { icon: 'phone', label: 'Phone', lines: [contact.phone] },
    { icon: 'mail', label: 'Email', lines: [contact.email] },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        subtitle="Questions about programmes, admissions or the campus? We're here to help."
      />

      <section className="container-page grid items-start gap-10 py-14 lg:grid-cols-[1fr_1.15fr]">
        {/* Info + map */}
        <div>
          <div className="mb-7 flex flex-col gap-[22px]">
            {DETAILS.map((d) => (
              <div key={d.label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-section-alt text-navy dark:text-gold-hi">
                  <Icon name={d.icon} size={20} />
                </div>
                <div>
                  <div className="font-head text-base font-semibold text-text">{d.label}</div>
                  <div className="text-[15px] leading-relaxed text-muted">
                    {d.lines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps embed — no API key needed; centred on the address from
              site settings, so it updates when the admin changes the address. */}
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border">
            <iframe
              title="College location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-lg border border-border bg-surface p-9 shadow-card">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
