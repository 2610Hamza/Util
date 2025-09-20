/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // force les routes API en runtime Node (pour 'fs', 'path', etc.)
  experimental: { runtime: 'nodejs' },
};

module.exports = nextConfig;
