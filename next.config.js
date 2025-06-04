/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
}

module.exports = nextConfig

module.exports = nextConfig