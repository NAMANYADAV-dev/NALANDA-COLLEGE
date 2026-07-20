/**
 * Next.js configuration.
 *
 * - `reactStrictMode` surfaces potential problems early in development.
 * - `images.remotePatterns` whitelists the Supabase Storage host so <Image />
 *   can optimize campus / faculty / gallery photos served from your bucket.
 * - `headers()` sets the site-wide security headers (see the CSP note below).
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Supabase project host, derived from the public URL so there is one place to
 * configure it. Used by both the image whitelist and the CSP.
 *
 * Falls back to a wildcard only when the env var is missing (e.g. a bare
 * `next build` in CI with no secrets). Set NEXT_PUBLIC_SUPABASE_URL and the
 * wildcard disappears — pinning it means our image optimizer can't be pointed
 * at somebody else's Supabase project.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = (() => {
  if (!supabaseUrl) return '*.supabase.co';
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return '*.supabase.co';
  }
})();

/**
 * Content-Security-Policy.
 *
 * `script-src` includes 'unsafe-inline' deliberately. The strict alternative is
 * a per-request nonce, but reading a nonce in the root layout forces every page
 * to render dynamically — that would throw away the static prerendering the
 * public site depends on. For a content site with no user-generated HTML the
 * trade is worth it; revisit if rich-text authoring is ever added.
 *
 * 'unsafe-eval' is dev-only (React Fast Refresh needs it) and never ships.
 *
 * The directives carrying real weight here are `frame-ancestors 'none'` (the
 * admin panel can't be framed and clickjacked), `object-src 'none'`, and
 * `form-action 'self'` (an injected script can't retarget the login form at
 * another origin).
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  `style-src 'self' 'unsafe-inline'`, // Tailwind + next/font inject inline styles
  `img-src 'self' data: blob: https://${supabaseHost}`,
  `font-src 'self' data:`,
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
  `frame-ancestors 'none'`,
  `frame-src 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // Belt-and-braces alongside frame-ancestors, for older browsers.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Send only the origin cross-site, the full URL same-origin — keeps admin
  // paths and query strings out of third-party referrer logs.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nothing on this site needs these APIs; deny them outright.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  // 2 years. `preload` is intentionally omitted — submitting to the browser
  // preload list is hard to undo, so add it only once the real domain is
  // settled on HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
