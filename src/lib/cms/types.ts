// CMS Types for Frontend Content Management System

export interface CmsContent {
  id: string;
  created_at: string;
  updated_at: string;
  page_path: string;
  component_id: string;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'html' | 'image' | 'link' | 'json' | 'number' | 'boolean';
  is_draft: boolean;
  order_index: number;
  metadata?: Record<string, any>;
  locale?: string;
  version?: number;
}

export interface CmsPage {
  id: string;
  created_at: string;
  updated_at: string;
  page_path: string;
  page_title: string;
  page_description?: string;
  route: string;
  is_active: boolean;
  order_index: number;
  metadata?: Record<string, any>;
}

export interface CmsContentResult {
  key: string;
  value: string;
  type: CmsContent['content_type'];
  metadata?: Record<string, any>;
}

// Helper type for component content mapping
export type ComponentContentMap = Record<string, CmsContentResult>;

// Cache configuration
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: boolean; // Serve stale content while revalidating
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttl: 300, // 5 minutes
  staleWhileRevalidate: true,
};
