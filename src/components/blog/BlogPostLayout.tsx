'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Calendar, User, ChevronRight } from 'lucide-react';
import TableOfContents from './TableOfContents';
import BlogSidebar from './BlogSidebar';

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category?: string;
  author?: string;
  tags?: string[];
  gallery_images?: string[];
  published_at?: string;
  created_at: string;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  category?: string | null;
}

interface RelatedTour {
  id: string;
  title: string;
  slug: string;
  hero_image?: string | null;
  category?: string | null;
  price?: number | null;
}

interface BlogPostLayoutProps {
  blog: Blog;
  recentPosts: RecentPost[];
  relatedTours?: RelatedTour[];
}

export default function BlogPostLayout({ blog, recentPosts, relatedTours }: BlogPostLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  const categories = recentPosts
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c))
    .filter((v, i, a) => a.indexOf(v) === i);

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Estimate reading time
  const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: isDark ? '#0E140E' : '#F7F7F2' }}
    >
      {/* Breadcrumb */}
      <div className="container-premium pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="transition-colors"
            style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3" style={{ color: isDark ? 'rgba(247,247,242,0.2)' : 'rgba(26,26,26,0.2)' }} />
          <Link
            href="/blog"
            className="transition-colors"
            style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
          >
            Journal
          </Link>
          <ChevronRight className="w-3 h-3" style={{ color: isDark ? 'rgba(247,247,242,0.2)' : 'rgba(26,26,26,0.2)' }} />
          <span
            className="truncate max-w-[200px]"
            style={{ color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)' }}
          >
            {blog.title}
          </span>
        </nav>
      </div>

      {/* Hero Image */}
      {blog.featured_image && (
        <div className="container-premium mb-8">
          <div
            className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden"
            style={{
              boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.3)' : '0 16px 48px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Article + Sidebar */}
      <div className="container-premium pb-24">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {blog.category && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'rgba(0, 104, 56, 0.1)',
                    color: '#006838',
                  }}
                >
                  {blog.category}
                </span>
              )}
              <span
                className="flex items-center gap-1.5 text-xs"
                style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
              >
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span
                className="flex items-center gap-1.5 text-xs"
                style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
              >
                <User className="w-3.5 h-3.5" />
                {blog.author || 'Himalayan Marvels'}
              </span>
              <span
                className="text-xs"
                style={{ color: isDark ? 'rgba(247,247,242,0.3)' : 'rgba(26,26,26,0.3)' }}
              >
                {readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight"
              style={{
                color: isDark ? '#F7F7F2' : '#1A1A1A',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p
                className="text-lg md:text-xl leading-relaxed mb-10 pb-8"
                style={{
                  color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)',
                  borderBottom: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                }}
              >
                {blog.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="blog-content prose prose-lg max-w-none"
              style={{
                color: isDark ? 'rgba(247,247,242,0.7)' : 'rgba(26,26,26,0.7)',
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div
                className="mt-12 pt-8"
                style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}` }}
              >
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{ color: isDark ? 'rgba(247,247,242,0.3)' : 'rgba(26,26,26,0.3)' }}
                >
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
                        color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.5)',
                        border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}`,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {blog.gallery_images && blog.gallery_images.length > 0 && (
              <div className="mt-12">
                <p
                  className="text-xs uppercase tracking-wider mb-6"
                  style={{ color: '#D4AF37' }}
                >
                  Gallery
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {blog.gallery_images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Photo from ${blog.title} - Travel gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              {/* TOC */}
              <div
                className="p-5 rounded-2xl mb-6"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                }}
              >
                <TableOfContents content={blog.content} />
              </div>

              {/* Blog Sidebar */}
              <BlogSidebar
                recentPosts={recentPosts}
                categories={categories}
                currentSlug={blog.slug}
                postTitle={blog.title}
              />

              {/* Explore This Journey - Related Tours */}
              {relatedTours && relatedTours.length > 0 && (
                <div
                  className="p-5 rounded-2xl mt-6"
                  style={{
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
                    border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-wider uppercase mb-4"
                    style={{ color: '#D4AF37' }}
                  >
                    Explore This Journey
                  </p>
                  <div className="space-y-4">
                    {relatedTours.map((tour) => (
                      <Link key={tour.id} href={`/tours/${tour.slug}`} className="block group">
                        <div className="rounded-xl overflow-hidden mb-2">
                          {tour.hero_image && (
                            <img
                              src={tour.hero_image}
                              alt={tour.title}
                              className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                          {tour.title}
                        </h4>
                        {tour.price && (
                          <p className="text-xs mt-1" style={{ color: '#006838' }}>
                            From ${Number(tour.price).toLocaleString()}/person
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/tours"
                    className="text-xs font-semibold mt-4 inline-block"
                    style={{ color: '#D4AF37' }}
                  >
                    View all journeys →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      {recentPosts.length > 0 && (
        <section
          className="py-16"
          style={{
            backgroundColor: isDark ? 'rgba(14, 20, 14, 0.5)' : 'rgba(255,255,255,0.5)',
            borderTop: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.04)'}`,
          }}
        >
          <div className="container-premium">
            <p
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-8"
              style={{ color: '#D4AF37' }}
            >
              More Stories
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.filter((p) => p.slug !== blog.slug).slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(255,255,255,0.9)',
                      border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}`,
                    }}
                  >
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3
                        className="font-medium mb-2 line-clamp-2"
                        style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                      >
                        {post.title}
                      </h3>
                      <span className="text-xs" style={{ color: '#006838' }}>
                        Read more
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Simple Footer */}
      <footer
        className="py-8"
        style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}` }}
      >
        <div className="container-premium text-center">
          <p
            className="text-sm"
            style={{ color: isDark ? 'rgba(247,247,242,0.3)' : 'rgba(26,26,26,0.3)' }}
          >
            &copy; {new Date().getFullYear()} Himalayan Marvels. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
