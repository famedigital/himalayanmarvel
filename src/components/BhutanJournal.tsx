'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getPublishedPosts, type BlogPost } from '@/lib/supabase';

export default function BhutanJournal() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const data = await getPublishedPosts(3);
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="section-padding bg-stone-100 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/40 to-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-100/80 text-amber-800 text-sm font-medium tracking-wide mb-4"
          >
            Insights from the Kingdom
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-charcoal"
            style={{
              background: 'linear-gradient(135deg, rgb(20 83 45), rgb(181 138 48))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Bhutan Journal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            Stories, wisdom, and insights from the Land of the Thunder Dragon.
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-video bg-stone-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-stone-200/50 hover:border-amber-200/50">
                    {/* Cover Image */}
                    <div className="aspect-video overflow-hidden relative">
                      {post.featured_image || post.cover_image ? (
                        <img
                          src={post.featured_image || post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-emerald-800 to-amber-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-charcoal/60 mb-3">
                        {post.published_at && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                        {post.category && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-stone-300" />
                            <span className="text-amber-700 font-medium">{post.category}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold mb-3 text-charcoal group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-charcoal/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center gap-2 text-amber-700 font-medium text-sm group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-charcoal/60">More stories coming soon from the Kingdom.</p>
          </motion.div>
        )}

        {/* View All Link */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgb(20 83 45), rgb(181 138 48))',
                color: 'white',
              }}
            >
              View All Journal Entries
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
