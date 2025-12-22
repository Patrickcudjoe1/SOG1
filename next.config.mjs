/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed ignoreBuildErrors for production safety
  // Fix TypeScript errors before deploying
  images: {
    unoptimized: true, // Set to false if using Next.js Image Optimization
  },
}

export default nextConfig
