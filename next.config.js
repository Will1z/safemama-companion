const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DISABLE_PWA === 'true',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Force fresh build to clear cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
});

module.exports = nextConfig;