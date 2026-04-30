import { createClient } from './server'

/**
 * Query helper functions for related content linking between Tours and Blogs
 * Uses category-based matching for automatic content discovery
 */

export interface RelatedTour {
  id: string
  title: string
  slug: string
  hero_image?: string | null
  category?: string | null
  price?: number | null
  excerpt?: string | null
}

export interface RelatedBlog {
  id: string
  title: string
  slug: string
  featured_image?: string | null
  category?: string | null
  excerpt?: string | null
}

/**
 * Get related content by category for tours and blogs
 *
 * @param type - 'tours' or 'blogs'
 * @param category - Optional category filter for matching
 * @param excludeId - Optional ID to exclude (current item)
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of related items
 */
export async function getRelatedContent(
  type: 'tours' | 'blogs',
  category?: string | null,
  excludeId?: string,
  limit = 3
): Promise<(RelatedTour | RelatedBlog)[]> {
  const supabase = await createClient()
  const table = type === 'tours' ? 'tours' : 'blogs'
  const imageField = type === 'tours' ? 'hero_image' : 'featured_image'

  let query = supabase
    .from(table)
    .select('id, title, slug, category, price, excerpt, ' + imageField)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query

  // Transform data to consistent format
  if (!data || data.length === 0 || Array.isArray(data) === false) {
    return []
  }

  return (data as any[]).map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category,
    price: item.price,
    excerpt: item.excerpt,
    hero_image: type === 'tours' ? item.hero_image : undefined,
    featured_image: type === 'blogs' ? item.featured_image : undefined,
  }))
}

/**
 * Get related blogs for a tour page
 *
 * @param tourCategory - The tour's category to match
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of related blog posts
 */
export async function getRelatedBlogsForTour(
  tourCategory?: string | null,
  limit = 3
): Promise<RelatedBlog[]> {
  return await getRelatedContent('blogs', tourCategory, undefined, limit) as RelatedBlog[]
}

/**
 * Get related tours for a blog page
 *
 * @param blogCategory - The blog's category to match
 * @param excludeId - Optional blog ID to exclude
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of related tours
 */
export async function getRelatedToursForBlog(
  blogCategory?: string | null,
  excludeId?: string,
  limit = 3
): Promise<RelatedTour[]> {
  return await getRelatedContent('tours', blogCategory, excludeId, limit) as RelatedTour[]
}
