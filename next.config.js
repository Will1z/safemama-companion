const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
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