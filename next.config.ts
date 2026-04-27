import type { NextConfig } from "next";
import { withSitemapConfig } from 'next-sitemap'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dxztrqjft/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// Wrapper for sitemap generation
export default withSitemapConfig(nextConfig, {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://himalayanmarvel.vercel.app',
  generateRobotsTxt: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin/', '/api/'],
  transform: async (config, path) => {
    if (path === '/') return { ...config, priority: 1.0, changefreq: 'daily' }
    if (path.startsWith('/tours/')) return { ...config, priority: 0.9, changefreq: 'weekly' }
    if (path.startsWith('/blog/')) return { ...config, priority: 0.8, changefreq: 'weekly' }
    return config
  },
})
