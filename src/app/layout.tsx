import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ThemeScript } from '@/components/layout/ThemeToggle';
import './globals.css';

/**
 * Root layout — wraps every route (public + admin).
 *
 * - Loads brand fonts via next/font (self-hosted, zero layout shift) and
 *   exposes them as CSS variables consumed by Tailwind's `font-head`/`font-body`.
 * - Injects the no-flash ThemeScript so the saved light/dark theme is applied
 *   before first paint.
 * - Declares default, template-based metadata for SEO.
 */

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Where curiosity becomes capability`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    images: [{ url: siteConfig.images.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.images.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable}`}>
      <head>
        {/* Warm up the Storage connection so gallery/faculty photos start
            downloading sooner (DNS + TLS handshake happens up front). */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />
        )}
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
