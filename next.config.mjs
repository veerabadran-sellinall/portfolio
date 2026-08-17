/** @type {import('next').NextConfig} */

// DEPLOYMENT NOTES:
// - GitHub Pages: CI uses actions/configure-pages@v5 (static_site_generator: next)
//   which auto-injects basePath: '/portfolio' and assetPrefix: '/portfolio' at build time.
//   Do NOT hardcode basePath here — it conflicts with the CI auto-injection.
// - Local dev: no basePath needed (served at localhost:3000/).
// - NEXT_PUBLIC_BASE_PATH is set by the CI environment so JS code can read it at runtime.

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
