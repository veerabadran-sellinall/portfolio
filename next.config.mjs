/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // On GitHub Pages the site lives at /portfolio — set basePath so
  // Next.js correctly prefixes all routes and internal asset links.
  // Local dev stays at / (no prefix) for convenience.
  basePath: isProd ? '/portfolio' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
