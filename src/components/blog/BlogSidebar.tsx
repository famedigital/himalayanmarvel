'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ShareButtons from './ShareButtons';

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  category?: string | null;
}

interface BlogSidebarProps {
  recentPosts: RecentPost[];
  categories: string[];
  currentSlug: string;
  postTitle: string;
}

export default function BlogSidebar({ recentPosts, categories, currentSlug, postTitle }: BlogSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  const filteredPosts = recentPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <aside className="space-y-8">
      {/* Share */}
      <div
        className="p-5 rounded-2xl"
        style={{
          backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
          border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
        }}
      >
        <p
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
        >
          Share this article
        </p>
        <ShareButtons url={postUrl} title={postTitle} />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
            border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
          }}
        >
          <p
            className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
          >
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 104, 56, 0.12)' : 'rgba(0, 104, 56, 0.06)',
                  color: '#006838',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {filteredPosts.length > 0 && (
        <div
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
            border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
          }}
        >
          <p
            className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
          >
            Recent Stories
          </p>
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="flex gap-3">
                  {post.featured_image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium line-clamp-2 mb-1 group-hover:underline"
                      style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                    >
                      {post.title}
                    </p>
                    {post.category && (
                      <p className="text-xs" style={{ color: '#006838' }}>{post.category}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Follow CTA */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 104, 56, 0.08), rgba(212, 175, 55, 0.06))',
          border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
        }}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
        >
          Follow our journey
        </p>
        <p
          className="text-xs mb-3"
          style={{ color: isDark ? 'rgba(247,247,242,0.5)' : 'rgba(26,26,26,0.5)' }}
        >
          Stories from the Land of the Thunder Dragon
        </p>
        <div className="flex gap-2">
          <a
            href="https://www.instagram.com/himalayanmarvels.travel/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#006838', color: '#FFFFFF' }}
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/himalayanmarvels/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: '#D4AF37',
            }}
          >
            Facebook
          </a>
        </div>
      </div>
    </aside>
  );
}
