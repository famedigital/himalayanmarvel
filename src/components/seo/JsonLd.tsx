'use client';

import { useEffect, useState } from 'react';

/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data as a script tag for SEO.
 * Supports multiple schema types including Organization, TouristTrip, Article, FAQ, and more.
 *
 * Note: Uses client-side rendering to avoid hydration issues.
 */

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}
