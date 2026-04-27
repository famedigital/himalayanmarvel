'use client';

import { useState, useEffect, useCallback } from 'react';

interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');

    const parsed: TOCHeading[] = [];
    headingElements.forEach((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      parsed.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(parsed);

    // Inject IDs into the actual DOM
    const articleEl = document.querySelector('.blog-content');
    if (articleEl) {
      const domHeadings = articleEl.querySelectorAll('h2, h3');
      domHeadings.forEach((el, index) => {
        if (parsed[index]) {
          el.id = parsed[index].id;
        }
      });
    }
  }, [content]);

  const handleScroll = useCallback(() => {
    const headingEls = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    const scrollPos = window.scrollY + 120;

    for (let i = headingEls.length - 1; i >= 0; i--) {
      if (headingEls[i] && headingEls[i]!.offsetTop <= scrollPos) {
        setActiveId(headings[i].id);
        return;
      }
    }
    setActiveId('');
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (headings.length === 0) return null;

  return (
    <nav>
      <p
        className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-4"
        style={{ color: '#D4AF37' }}
      >
        Contents
      </p>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
                }
              }}
              className="block text-sm leading-snug transition-colors"
              style={{
                paddingLeft: `${(heading.level - 2) * 12}px`,
                color: activeId === heading.id ? '#006838' : 'rgba(26, 26, 26, 0.5)',
                fontWeight: activeId === heading.id ? 600 : 400,
                borderLeft: activeId === heading.id ? '2px solid #006838' : '2px solid transparent',
                marginLeft: '-14px',
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
