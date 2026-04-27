import { defineConfig } from 'next-sitemap'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://himalayanmarvel.vercel.app'

export default defineConfig({
  siteUrl: SITE_URL,
  generateRobotsTxt: false, // We already have a custom robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin/', '/api/'],
  transform: async (config, path) => {
    // Priority for important pages
    if (path === '/') return { ...config, priority: 1.0, changefreq: 'daily' }
    if (path.startsWith('/tours/')) return { ...config, priority: 0.9, changefreq: 'weekly' }
    if (path.startsWith('/blog/')) return { ...config, priority: 0.8, changefreq: 'weekly' }
    return config
  },
})
