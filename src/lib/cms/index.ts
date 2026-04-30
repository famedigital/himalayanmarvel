/**
 * CMS Library Index
 * Central export point for all CMS utilities
 */

// Types
export type {
  CmsContent,
  CmsPage,
  CmsContentResult,
  ComponentContentMap,
  CacheConfig,
} from './types';

// Server-side fetch functions
export {
  getPageContent,
  getComponentContent,
  getComponentContentMap,
  getAllPages,
  getPageByRoute,
  getMultiplePageContent,
  getContentByKey,
  searchContent,
  getCmsStats,
  clearCmsCache,
} from './fetch-content';

// Client-side React hooks
export {
  useCmsContent,
  useCmsContentMap,
  useCmsPages,
  useCmsValue,
} from './use-cms-content';
