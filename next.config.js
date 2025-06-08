/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  // Make sure we have a proper error handling
  typescript: {
    // !! WARN !!
    // Handle type errors in development instead of build time for better DX
    ignoreBuildErrors: false,
  },
  // Ensure all routes are handled properly by Next.js
  trailingSlash: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './'),
    };
    return config;
  },
}

module.exports = nextConfig