'use client';

/**
 * React Hooks for CMS Content
 * Client-side hooks for consuming CMS content in React components
 */

import { useState, useEffect, useCallback } from 'react';
import type { CmsContent, ComponentContentMap } from './types';

export interface UseCmsContentResult {
  content: CmsContent[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCmsContentMapResult {
  content: ComponentContentMap;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch all CMS content for a page
 * @param pagePath - The page path (e.g., '/', '/about')
 * @param includeDraft - Whether to include draft content (default: false)
 * @returns Object with content, loading state, error, and refetch function
 */
export function useCmsContent(
  pagePath: string,
  includeDraft: boolean = false
): UseCmsContentResult {
  const [content, setContent] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    if (!pagePath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cms/content?page=${encodeURIComponent(pagePath)}&draft=${includeDraft}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const data = await response.json();
      setContent(data.content || []);
    } catch (err) {
      console.error('Error fetching CMS content:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [pagePath, includeDraft]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

/**
 * Hook to fetch content for a specific component as a key-value map
 * @param pagePath - The page path
 * @param componentId - The component identifier (e.g., 'hero', 'navigation')
 * @param includeDraft - Whether to include draft content
 * @returns Object with content map, loading state, error, and refetch function
 */
export function useCmsContentMap(
  pagePath: string,
  componentId: string,
  includeDraft: boolean = false
): UseCmsContentMapResult {
  const [content, setContent] = useState<ComponentContentMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    if (!pagePath || !componentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/cms/content?page=${encodeURIComponent(pagePath)}&component=${encodeURIComponent(componentId)}&draft=${includeDraft}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const data = await response.json();

      // Convert array to map
      const contentMap = (data.content || []).reduce((acc: ComponentContentMap, item: CmsContent) => {
        acc[item.content_key] = {
          key: item.content_key,
          value: item.content_value,
          type: item.content_type,
          metadata: item.metadata,
        };
        return acc;
      }, {});

      setContent(contentMap);
    } catch (err) {
      console.error('Error fetching CMS content map:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setContent({});
    } finally {
      setLoading(false);
    }
  }, [pagePath, componentId, includeDraft]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

/**
 * Hook to fetch all registered pages
 * @param activeOnly - Whether to fetch only active pages (default: true)
 * @returns Object with pages, loading state, error, and refetch function
 */
export function useCmsPages(activeOnly: boolean = true) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cms/pages?active=${activeOnly}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }

      const data = await response.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error('Error fetching CMS pages:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    pages,
    loading,
    error,
    refetch: fetchPages,
  };
}

/**
 * Hook to fetch a single content value by key
 * @param pagePath - The page path
 * @param componentId - The component identifier
 * @param contentKey - The content key
 * @param includeDraft - Whether to include draft content
 * @returns Object with value, loading state, error, and refetch function
 */
export function useCmsValue(
  pagePath: string,
  componentId: string,
  contentKey: string,
  includeDraft: boolean = false
) {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchValue = useCallback(async () => {
    if (!pagePath || !componentId || !contentKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/cms/content?page=${encodeURIComponent(pagePath)}&component=${encodeURIComponent(componentId)}&key=${encodeURIComponent(contentKey)}&draft=${includeDraft}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch value: ${response.statusText}`);
      }

      const data = await response.json();
      setValue(data.value || '');
    } catch (err) {
      console.error('Error fetching CMS value:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setValue('');
    } finally {
      setLoading(false);
    }
  }, [pagePath, componentId, contentKey, includeDraft]);

  useEffect(() => {
    fetchValue();
  }, [fetchValue]);

  return {
    value,
    loading,
    error,
    refetch: fetchValue,
  };
}
