/**
 * CMS Content Fetching Utilities
 * Server-side functions for fetching CMS content from Supabase
 */

import { createClient } from '@/lib/supabase/server';
import type { CmsContent, CmsPage, ComponentContentMap, CacheConfig, DEFAULT_CACHE_CONFIG } from './types';

// Simple in-memory cache for server-side
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300; // 5 minutes default

/**
 * Clear CMS cache (useful for invalidation)
 */
export function clearCmsCache(): void {
  cache.clear();
}

/**
 * Get cache key for a query
 */
function getCacheKey(type: string, ...params: string[]): string {
  return `cms:${type}:${params.join(':')}`;
}

/**
 * Get from cache if available and not expired
 */
function getFromCache<T>(key: string, ttl: number = CACHE_TTL): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl * 1000) {
    return cached.data as T;
  }
  return null;
}

/**
 * Set cache with current timestamp
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch all published content for a specific page
 * @param pagePath - The page path (e.g., '/', '/about', '/tours')
 * @param includeDraft - Whether to include draft content (default: false)
 * @param cacheConfig - Cache configuration
 * @returns Array of CMS content items ordered by order_index
 */
export async function getPageContent(
  pagePath: string,
  includeDraft: boolean = false,
  cacheConfig: Partial<CacheConfig> = {}
): Promise<CmsContent[]> {
  const cacheKey = getCacheKey('page', pagePath, String(includeDraft));

  if (cacheConfig.enabled !== false) {
    const cached = getFromCache<CmsContent[]>(cacheKey, cacheConfig.ttl || CACHE_TTL);
    if (cached) {
      return cached;
    }
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('cms_content')
      .select('*')
      .eq('page_path', pagePath)
      .order('order_index', { ascending: true });

    if (!includeDraft) {
      query = query.eq('is_draft', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching page content for ${pagePath}:`, error);
      return [];
    }

    if (cacheConfig.enabled !== false && data) {
      setCache(cacheKey, data);
    }

    return data || [];
  } catch (error) {
    console.error(`Unexpected error fetching page content for ${pagePath}:`, error);
    return [];
  }
}

/**
 * Fetch content for a specific component within a page
 * @param pagePath - The page path
 * @param componentId - The component identifier (e.g., 'hero', 'navigation')
 * @param includeDraft - Whether to include draft content
 * @returns Array of content items for the specified component
 */
export async function getComponentContent(
  pagePath: string,
  componentId: string,
  includeDraft: boolean = false
): Promise<CmsContent[]> {
  try {
    const contents = await getPageContent(pagePath, includeDraft);
    return contents.filter(c => c.component_id === componentId);
  } catch (error) {
    console.error(`Error fetching component content for ${componentId}:`, error);
    return [];
  }
}

/**
 * Get component content as a key-value map for easier access
 * @param pagePath - The page path
 * @param componentId - The component identifier
 * @param includeDraft - Whether to include draft content
 * @returns Object with content_key as keys and content results as values
 */
export async function getComponentContentMap(
  pagePath: string,
  componentId: string,
  includeDraft: boolean = false
): Promise<ComponentContentMap> {
  try {
    const contents = await getComponentContent(pagePath, componentId, includeDraft);

    return contents.reduce((acc, item) => {
      acc[item.content_key] = {
        key: item.content_key,
        value: item.content_value,
        type: item.content_type,
        metadata: item.metadata,
      };
      return acc;
    }, {} as ComponentContentMap);
  } catch (error) {
    console.error(`Error creating component content map for ${componentId}:`, error);
    return {};
  }
}

/**
 * Fetch all registered pages
 * @param activeOnly - Whether to fetch only active pages (default: true)
 * @returns Array of CMS pages ordered by order_index
 */
export async function getAllPages(activeOnly: boolean = true): Promise<CmsPage[]> {
  const cacheKey = getCacheKey('pages', String(activeOnly));

  const cached = getFromCache<CmsPage[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('cms_pages')
      .select('*')
      .order('order_index', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pages:', error);
      return [];
    }

    if (data) {
      setCache(cacheKey, data);
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch a single page by route
 * @param route - The route path (e.g., '/', '/about')
 * @returns The page object or null if not found
 */
export async function getPageByRoute(route: string): Promise<CmsPage | null> {
  try {
    const pages = await getAllPages();
    return pages.find(p => p.route === route) || null;
  } catch (error) {
    console.error(`Error fetching page by route ${route}:`, error);
    return null;
  }
}

/**
 * Fetch multiple pages by their paths
 * @param pagePaths - Array of page paths to fetch
 * @param includeDraft - Whether to include draft content
 * @returns Object with page paths as keys and content arrays as values
 */
export async function getMultiplePageContent(
  pagePaths: string[],
  includeDraft: boolean = false
): Promise<Record<string, CmsContent[]>> {
  try {
    const results = await Promise.all(
      pagePaths.map(async (path) => {
        const content = await getPageContent(path, includeDraft);
        return [path, content];
      })
    );

    return Object.fromEntries(results);
  } catch (error) {
    console.error('Error fetching multiple page contents:', error);
    return {};
  }
}

/**
 * Get all content for a specific content key across all pages
 * Useful for global elements like navigation, footer, etc.
 * @param contentKey - The content key to search for
 * @returns Array of content items with the specified key
 */
export async function getContentByKey(contentKey: string): Promise<CmsContent[]> {
  const cacheKey = getCacheKey('key', contentKey);

  const cached = getFromCache<CmsContent[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('content_key', contentKey)
      .eq('is_draft', false)
      .order('page_path', { ascending: true });

    if (error) {
      console.error(`Error fetching content by key ${contentKey}:`, error);
      return [];
    }

    if (data) {
      setCache(cacheKey, data);
    }

    return data || [];
  } catch (error) {
    console.error(`Unexpected error fetching content by key ${contentKey}:`, error);
    return [];
  }
}

/**
 * Search content by value (partial match)
 * @param searchTerm - The search term
 * @param limit - Maximum number of results (default: 50)
 * @returns Array of matching content items
 */
export async function searchContent(searchTerm: string, limit: number = 50): Promise<CmsContent[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .ilike('content_value', `%${searchTerm}%`)
      .eq('is_draft', false)
      .limit(limit);

    if (error) {
      console.error(`Error searching content for ${searchTerm}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Unexpected error searching content for ${searchTerm}:`, error);
    return [];
  }
}

/**
 * Get content statistics
 * @returns Object with counts and statistics
 */
export async function getCmsStats(): Promise<{
  totalPages: number;
  totalContent: number;
  draftContent: number;
  publishedContent: number;
  activePages: number;
}> {
  try {
    const [pages, content] = await Promise.all([
      getAllPages(false),
      (async () => {
        const supabase = await createClient();
        const { data } = await supabase
          .from('cms_content')
          .select('is_draft');
        return data || [];
      })(),
    ]);

    const draftContent = content.filter(c => c.is_draft).length;
    const publishedContent = content.filter(c => !c.is_draft).length;
    const activePages = pages.filter(p => p.is_active).length;

    return {
      totalPages: pages.length,
      totalContent: content.length,
      draftContent,
      publishedContent,
      activePages,
    };
  } catch (error) {
    console.error('Error fetching CMS stats:', error);
    return {
      totalPages: 0,
      totalContent: 0,
      draftContent: 0,
      publishedContent: 0,
      activePages: 0,
    };
  }
}
