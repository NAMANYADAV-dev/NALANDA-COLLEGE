import { siteConfig } from '@/config/site';

/**
 * OrganizationJsonLd — Schema.org structured data describing the college.
 *
 * Rendered site-wide (from the public layout) so search engines can show rich
 * results (name, logo, address, contact, social profiles). Contact + social
 * come from the admin site settings, so they stay accurate. Emitted as a
 * <script type="application/ld+json"> — the standard, safe way in Next.js.
 */
export function OrganizationJsonLd({
  contact,
  social,
}: {
  contact: { email: string; phone: string; address: string };
  social: { facebook: string; instagram: string; twitter: string };
}) {
  const base = siteConfig.url.replace(/\/$/, '');
  const sameAs = [social.facebook, social.instagram, social.twitter].filter(
    (u) => u && u !== '#',
  );

  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: base,
    image: `${base}${siteConfig.images.ogImage}`,
    foundingDate: String(siteConfig.established),
    email: contact.email,
    telephone: contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressCountry: 'IN',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
