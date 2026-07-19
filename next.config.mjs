/**
 * Next.js configuration.
 *
 * - `reactStrictMode` surfaces potential problems early in development.
 * - `images.remotePatterns` whitelists the Supabase Storage host so <Image />
 *   can optimize campus / faculty / gallery photos served from your bucket.
 *   Replace <your-project-ref> with your real Supabase project ref (or set it
 *   through the SUPABASE URL env — see .env.example).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
