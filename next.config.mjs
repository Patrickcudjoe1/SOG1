/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed ignoreBuildErrors for production safety
  // Fix TypeScript errors before deploying
  images: {
    unoptimized: false, // Enable Next.js Image Optimization for better performance
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Turbopack configuration for Next.js 16+
  turbopack: {},
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
