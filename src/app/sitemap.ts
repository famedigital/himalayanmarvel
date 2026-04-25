import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = 'https://himalayanmarvels.bt'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch all published tours
  const { data: tours } = await supabase
    .from('tours')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  // Fetch all published blog posts
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/tours`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Add tour pages
  if (tours) {
    for (const tour of tours) {
      sitemap.push({
        url: `${SITE_URL}/tours/${tour.slug}`,
        lastModified: new Date(tour.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  // Add blog pages
  if (blogs) {
    for (const blog of blogs) {
      sitemap.push({
        url: `${SITE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return sitemap
}
