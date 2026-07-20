import Link from 'next/link';
import { footerNav, siteConfig } from '@/config/site';
import { Icon, type IconName } from '@/components/ui/Icon';

/**
 * SiteFooter — static site footer. A pure Server Component: no interactivity,
 * all content sourced from `site.ts`, so it ships zero JavaScript.
 */
export function SiteFooter({
  contact,
  social,
}: {
  contact?: { email: string; phone: string; address: string };
  social?: { facebook: string; instagram: string; twitter: string };
}) {
  const c = contact ?? siteConfig.contact;
  // Only render social icons that have a real URL set (skip blanks / '#').
  const socialLinks = (
    [
      { label: 'Facebook', icon: 'facebook', href: social?.facebook },
      { label: 'Instagram', icon: 'instagram', href: social?.instagram },
      { label: 'Twitter', icon: 'twitter', href: social?.twitter },
    ] as const
  ).filter((s) => s.href && s.href !== '#');

  return (
    <footer className="bg-navy-deep px-5 pb-7 pt-14 text-[#c6d2e4] sm:px-6 lg:px-10 dark:bg-[#0a1626]">
      <div className="mx-auto grid max-w-content gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.3fr_1fr]">
        {/* Brand + blurb */}
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-gold-hi font-head font-bold text-navy-deep">
              N
            </span>
            <span className="font-head text-[17px] font-bold text-white">{siteConfig.name}</span>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed">{siteConfig.description}</p>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="mb-3.5 text-sm font-semibold text-white">Quick links</h2>
          <div className="flex flex-col gap-2.5 text-sm">
            {footerNav.map((link) => (
              <Link key={link.href} href={link.href} className="text-[#c6d2e4] hover:text-gold-hi">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="mb-3.5 text-sm font-semibold text-white">Contact</h2>
          <address className="text-sm not-italic leading-7">
            {c.address}
            <br />
            {c.phone}
            <br />
            {c.email}
          </address>
        </div>

        {/* Social — only shown when at least one link is set */}
        {socialLinks.length > 0 && (
          <div>
            <h2 className="mb-3.5 text-sm font-semibold text-white">Follow</h2>
            <div className="flex gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white transition-colors hover:bg-gold"
                >
                  <Icon name={s.icon as IconName} size={18} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-7 max-w-content border-t border-white/10 pt-[18px] text-center text-xs text-[#8fa0bd]">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
