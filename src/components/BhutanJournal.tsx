'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { getPublishedPosts, type BlogPost } from '@/lib/supabase';
import RevealOnScroll from './ui/RevealOnScroll';

export default function BhutanJournal() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const data = await getPublishedPosts(3);
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#0E140E' : '#F7F7F2' }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(0, 104, 56, 0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 104, 56, 0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Insights from the Kingdom
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-light mb-6"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Bhutan Journal
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: isDark ? 'rgba(247,247,242,0.5)' : 'rgba(26,26,26,0.5)' }}
          >
            Stories, wisdom, and insights from the Land of the Thunder Dragon.
          </p>
        </RevealOnScroll>

        {/* Blog Grid - horizontal scroll on mobile */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}`,
                }}
              >
                <div
                  className="aspect-video"
                  style={{ backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(0,0,0,0.04)' }}
                />
                <div className="p-6 space-y-3">
                  <div className="h-4 rounded w-1/3" style={{ backgroundColor: isDark ? 'rgba(247,247,242,0.05)' : 'rgba(0,0,0,0.04)' }} />
                  <div className="h-6 rounded w-3/4" style={{ backgroundColor: isDark ? 'rgba(247,247,242,0.05)' : 'rgba(0,0,0,0.04)' }} />
                  <div className="h-4 rounded w-full" style={{ backgroundColor: isDark ? 'rgba(247,247,242,0.05)' : 'rgba(0,0,0,0.04)' }} />
                  <div className="h-4 rounded w-2/3" style={{ backgroundColor: isDark ? 'rgba(247,247,242,0.05)' : 'rgba(0,0,0,0.04)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="scroll-snap-x flex md:grid md:grid-cols-3 gap-6 -mx-4 md:mx-0 px-4 md:px-0 pb-4 md:pb-0">
            {posts.map((post, index) => (
              <RevealOnScroll key={post.id} delay={index * 0.1} className="flex-shrink-0 w-[80vw] md:w-auto snap-start">
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500"
                    style={{
                      backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                      border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}`,
                      boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)';
                      (e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 16px 48px rgba(0,0,0,0.3)' : '0 16px 48px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)';
                      (e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Cover Image */}
                    <div className="aspect-video overflow-hidden relative">
                      {post.featured_image || post.cover_image ? (
                        <img
                          src={post.featured_image || post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-amber-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs mb-3">
                        {post.published_at && (
                          <span
                            className="flex items-center gap-1.5"
                            style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.4)' }}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                        {post.category && (
                          <>
                            <span
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: isDark ? 'rgba(247,247,242,0.15)' : 'rgba(26,26,26,0.15)' }}
                            />
                            <span style={{ color: '#006838', fontWeight: 500 }}>{post.category}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="text-xl font-semibold mb-3 transition-colors line-clamp-2"
                        style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
                        style={{ color: isDark ? 'rgba(247,247,242,0.5)' : 'rgba(26,26,26,0.5)' }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div
                        className="flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all"
                        style={{ color: '#D4AF37' }}
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <RevealOnScroll className="text-center py-12">
            <p style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}>
              More stories coming soon from the Kingdom.
            </p>
          </RevealOnScroll>
        )}

        {/* View All Link */}
        {posts.length > 0 && (
          <RevealOnScroll delay={0.3} className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all text-sm tracking-wide"
              style={{
                backgroundColor: '#006838',
                color: '#FFFFFF',
                border: '1px solid rgba(212, 175, 55, 0.15)',
              }}
            >
              View All Journal Entries
              <ArrowRight className="w-5 h-5" />
            </Link>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
