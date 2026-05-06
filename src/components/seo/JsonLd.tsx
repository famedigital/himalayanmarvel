'use client';

import { useEffect, useState } from 'react';

/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data as a script tag for SEO.
 * Supports multiple schema types including Organization, TouristTrip, Article, FAQ, and more.
 *
 * Note: Uses DOM manipulation to avoid React script tag warning.
 */

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const schemas = Array.isArray(data) ? data : [data];

  useEffect(() => {
    if (!isMounted) return;

    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-jsonld]');
    existingScripts.forEach(script => script.remove());

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', 'true');
      script.text = JSON.stringify(schema, null, 0);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-jsonld]');
      scripts.forEach(script => script.remove());
    };
  }, [schemas, isMounted]);

  return null;
}
