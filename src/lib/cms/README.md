# Frontend CMS Library

Complete content management system utilities for fetching and consuming CMS data in the Himalayan Marvels application.

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Type Definitions](#type-definitions)
- [Server-Side Functions](#server-side-functions)
- [Client-Side Hooks](#client-side-hooks)
- [API Routes](#api-routes)
- [Usage Examples](#usage-examples)
- [Caching Strategy](#caching-strategy)

## Overview

The CMS library provides:

- **Type-safe content fetching** with full TypeScript support
- **Server-side functions** for static generation and server components
- **React hooks** for client components
- **Built-in caching** for performance optimization
- **Error handling** with graceful fallbacks

## File Structure

```
src/lib/cms/
├── types.ts              # TypeScript type definitions
├── fetch-content.ts      # Server-side fetch functions
├── use-cms-content.ts    # Client-side React hooks
├── index.ts              # Central export point
└── README.md            # This file

src/app/api/cms/
├── content/
│   └── route.ts         # API endpoint for content
└── pages/
    └── route.ts         # API endpoint for pages
```

## Type Definitions

### CmsContent

Represents a single content item in the CMS.

```typescript
interface CmsContent {
  id: string;
  created_at: string;
  updated_at: string;
  page_path: string;           // e.g., '/', '/about', '/tours'
  component_id: string;        // e.g., 'hero', 'navigation', 'footer'
  content_key: string;         // e.g., 'title', 'description', 'image'
  content_value: string;       // The actual content value
  content_type: 'text' | 'html' | 'image' | 'link' | 'json' | 'number' | 'boolean';
  is_draft: boolean;           // Whether the content is a draft
  order_index: number;         // Display order
  metadata?: Record<string, any>;
  locale?: string;             // For i18n support
  version?: number;            // Content versioning
}
```

### CmsPage

Represents a registered page in the CMS.

```typescript
interface CmsPage {
  id: string;
  created_at: string;
  updated_at: string;
  page_path: string;           // Unique page identifier
  page_title: string;          // Human-readable title
  page_description?: string;
  route: string;               // URL route
  is_active: boolean;          // Whether the page is active
  order_index: number;
  metadata?: Record<string, any>;
}
```

## Server-Side Functions

Import from `@/lib/cms`:

```typescript
import {
  getPageContent,
  getComponentContent,
  getComponentContentMap,
  getAllPages,
  getPageByRoute
} from '@/lib/cms';
```

### getPageContent(pagePath, includeDraft?, cacheConfig?)

Fetches all published content for a page.

```typescript
// In a Server Component or getStaticProps
const content = await getPageContent('/');
const draftContent = await getPageContent('/', true);

// With custom cache config
const content = await getPageContent('/', false, {
  enabled: true,
  ttl: 600,  // 10 minutes
  staleWhileRevalidate: true
});
```

**Parameters:**
- `pagePath` (string): The page path (e.g., '/', '/about')
- `includeDraft` (boolean, optional): Include draft content (default: false)
- `cacheConfig` (CacheConfig, optional): Cache configuration

**Returns:** `Promise<CmsContent[]>`

### getComponentContent(pagePath, componentId, includeDraft?)

Fetches content for a specific component.

```typescript
const heroContent = await getComponentContent('/', 'hero');
const navContent = await getComponentContent('/', 'navigation');
```

**Parameters:**
- `pagePath` (string): The page path
- `componentId` (string): Component identifier
- `includeDraft` (boolean, optional): Include draft content

**Returns:** `Promise<CmsContent[]>`

### getComponentContentMap(pagePath, componentId, includeDraft?)

Fetches component content as a key-value map.

```typescript
const heroMap = await getComponentContentMap('/', 'hero');
console.log(heroMap.title.value);      // Access title value
console.log(heroMap.title.type);       // Access title type
console.log(heroMap.description.value); // Access description
```

**Parameters:**
- `pagePath` (string): The page path
- `componentId` (string): Component identifier
- `includeDraft` (boolean, optional): Include draft content

**Returns:** `Promise<ComponentContentMap>`

### getAllPages(activeOnly?)

Fetches all registered pages.

```typescript
const activePages = await getAllPages();
const allPages = await getAllPages(false);
```

**Parameters:**
- `activeOnly` (boolean, optional): Fetch only active pages (default: true)

**Returns:** `Promise<CmsPage[]>`

### getPageByRoute(route)

Fetches a single page by route.

```typescript
const aboutPage = await getPageByRoute('/about');
if (aboutPage) {
  console.log(aboutPage.page_title);
}
```

**Parameters:**
- `route` (string): The route path

**Returns:** `Promise<CmsPage | null>`

### Additional Functions

- `getMultiplePageContent(pagePaths[], includeDraft?)` - Fetch content for multiple pages
- `getContentByKey(contentKey)` - Get all content with a specific key across all pages
- `searchContent(searchTerm, limit?)` - Search content by value
- `getCmsStats()` - Get CMS statistics
- `clearCmsCache()` - Clear the in-memory cache

## Client-Side Hooks

Import from `@/lib/cms`:

```typescript
import {
  useCmsContent,
  useCmsContentMap,
  useCmsPages,
  useCmsValue
} from '@/lib/cms';
```

### useCmsContent(pagePath, includeDraft?)

Hook to fetch all CMS content for a page.

```typescript
'use client';

import { useCmsContent } from '@/lib/cms';

function Hero() {
  const { content, loading, error, refetch } = useCmsContent('/');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading content</div>;

  const title = content.find(c => c.component_id === 'hero' && c.content_key === 'title');

  return <h1>{title?.content_value || 'Default Title'}</h1>;
}
```

**Returns:**
```typescript
{
  content: CmsContent[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### useCmsContentMap(pagePath, componentId, includeDraft?)

Hook to fetch component content as a key-value map.

```typescript
'use client';

import { useCmsContentMap } from '@/lib/cms';

function Hero() {
  const { content, loading, error } = useCmsContentMap('/', 'hero');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{content.title?.value || 'Default Title'}</h1>
      <p>{content.description?.value || 'Default Description'}</p>
    </div>
  );
}
```

**Returns:**
```typescript
{
  content: ComponentContentMap;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### useCmsPages(activeOnly?)

Hook to fetch all registered pages.

```typescript
'use client';

import { useCmsPages } from '@/lib/cms';

function Navigation() {
  const { pages, loading } = useCmsPages();

  return (
    <nav>
      {pages.map(page => (
        <Link key={page.id} href={page.route}>
          {page.page_title}
        </Link>
      ))}
    </nav>
  );
}
```

**Returns:**
```typescript
{
  pages: CmsPage[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### useCmsValue(pagePath, componentId, contentKey, includeDraft?)

Hook to fetch a single content value.

```typescript
'use client';

import { useCmsValue } from '@/lib/cms';

function Hero() {
  const { value, loading } = useCmsValue('/', 'hero', 'title');

  return <h1>{loading ? 'Loading...' : value || 'Default Title'}</h1>;
}
```

**Returns:**
```typescript
{
  value: string;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

## API Routes

### GET /api/cms/content

Fetches CMS content.

**Query Parameters:**
- `page` (required): Page path
- `component` (optional): Component ID
- `key` (optional): Content key (requires component)
- `draft` (optional): Include draft content (default: false)

**Examples:**
```typescript
// Fetch all content for home page
fetch('/api/cms/content?page=/')

// Fetch hero component content
fetch('/api/cms/content?page=/&component=hero')

// Fetch specific value
fetch('/api/cms/content?page=/&component=hero&key=title')

// Fetch including drafts
fetch('/api/cms/content?page=/&draft=true')
```

**Response:**
```typescript
// All content
{ content: CmsContent[] }

// Single value
{ value: string }
```

### GET /api/cms/pages

Fetches all CMS pages.

**Query Parameters:**
- `active` (optional): Fetch only active pages (default: true)

**Examples:**
```typescript
// Fetch active pages
fetch('/api/cms/pages')

// Fetch all pages
fetch('/api/cms/pages?active=false')
```

**Response:**
```typescript
{ pages: CmsPage[] }
```

## Usage Examples

### Server Component with Static Generation

```typescript
// src/app/page.tsx
import { getPageContent, getComponentContentMap } from '@/lib/cms';
import Image from 'next/image';

export default async function HomePage() {
  // Fetch all page content
  const pageContent = await getPageContent('/');

  // Or fetch as a map for easier access
  const heroMap = await getComponentContentMap('/', 'hero');

  return (
    <div>
      <h1>{heroMap.title?.value || 'Welcome'}</h1>
      <p>{heroMap.description?.value}</p>

      {heroMap.backgroundImage && (
        <Image
          src={heroMap.backgroundImage.value}
          alt={heroMap.backgroundImage.metadata?.alt || 'Hero image'}
          width={1920}
          height={1080}
        />
      )}
    </div>
  );
}
```

### Client Component with Hooks

```typescript
// src/components/Hero.tsx
'use client';

import { useCmsContentMap } from '@/lib/cms';

export default function Hero() {
  const { content, loading, error } = useCmsContentMap('/', 'hero');

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div>Error loading hero content</div>;
  }

  return (
    <section className="hero">
      <h1>{content.title?.value || 'Default Title'}</h1>
      <p>{content.subtitle?.value}</p>
      <a href={content.ctaLink?.value || '/tours'}>
        {content.ctaText?.value || 'Explore Tours'}
      </a>
    </section>
  );
}
```

### Shared Component Across Pages

```typescript
// src/components/Navigation.tsx
'use client';

import { useCmsPages } from '@/lib/cms';
import Link from 'next/link';

export default function Navigation() {
  const { pages, loading } = useCmsPages();

  if (loading) return <nav className="skeleton-nav" />;

  return (
    <nav>
      {pages.map(page => (
        <Link key={page.id} href={page.route}>
          {page.page_title}
        </Link>
      ))}
    </nav>
  );
}
```

### Loading and Error States

```typescript
'use client';

import { useCmsContentMap } from '@/lib/cms';

export default function ContentBlock() {
  const { content, loading, error, refetch } = useCmsContentMap('/', 'hero');

  if (loading) {
    return (
      <div className="loading-state">
        <div className="skeleton-title" />
        <div className="skeleton-text" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load content</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{content.title?.value}</h1>
      <p>{content.description?.value}</p>
    </div>
  );
}
```

## Caching Strategy

The CMS library implements a multi-level caching strategy:

### Server-Side Cache

- **In-memory cache** for server components
- **Default TTL:** 5 minutes (300 seconds)
- **Automatic invalidation** on cache expiry
- **Manual invalidation** via `clearCmsCache()`

Cache keys are generated as: `cms:{type}:{params}`

### Cache Configuration

```typescript
interface CacheConfig {
  enabled: boolean;              // Enable/disable caching
  ttl: number;                   // Time to live in seconds
  staleWhileRevalidate?: boolean; // Serve stale while revalidating
}

// Custom cache config
await getPageContent('/', false, {
  enabled: true,
  ttl: 600,  // 10 minutes
  staleWhileRevalidate: true
});
```

### Client-Side Cache

- React hooks use standard HTTP caching
- Browser cache respects API response headers
- Refetch function available for manual updates

### Best Practices

1. **Server Components:** Use default caching for most cases
2. **Client Components:** Let hooks handle caching automatically
3. **Preview Mode:** Use `includeDraft: true` to bypass cache
4. **Cache Invalidation:** Call `clearCmsCache()` after content updates

```typescript
// Example: Cache invalidation after admin update
import { clearCmsCache } from '@/lib/cms';

async function updateContent(id: string, value: string) {
  await supabase.from('cms_content').update({ content_value: value }).eq('id', id);
  clearCmsCache(); // Invalidate cache
}
```

## Content Type Handling

The library supports multiple content types:

### Text
```typescript
const title = content.title?.value; // "Welcome to Himalayan Marvels"
```

### HTML
```typescript
const description = content.description?.value; // "<p>Rich text content</p>"
<div dangerouslySetInnerHTML={{ __html: description }} />
```

### Image
```typescript
const image = content.heroImage?.value; // Cloudinary URL
const alt = content.heroImage?.metadata?.alt; // Alternative text
```

### JSON
```typescript
const features = JSON.parse(content.features?.value);
// { items: ['Feature 1', 'Feature 2'] }
```

### Number
```typescript
const price = parseFloat(content.price?.value);
```

### Boolean
```typescript
const isVisible = content.visible?.value === 'true';
```

## Error Handling

All functions include error handling:

```typescript
// Server-side - Returns empty array on error
const content = await getPageContent('/'); // Returns [] on error

// Client-side - Returns error state
const { content, loading, error } = useCmsContent('/');
if (error) {
  console.error('Failed to load:', error.message);
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { CmsContent, CmsPage, ComponentContentMap } from '@/lib/cms';

function processContent(content: CmsContent[]) {
  content.forEach(item => {
    console.log(`${item.component_id}.${item.content_key}: ${item.content_value}`);
  });
}
```
