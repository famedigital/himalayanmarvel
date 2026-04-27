import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Calendar, User, ArrowRight, ChevronRight, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';

async function getBlogs() {
  const supabase = await createClient();

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return blogs || [];
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  // Extract unique categories
  const categories = [...new Set(blogs.map((b: any) => b.category).filter(Boolean))];
  const featured = blogs[0];
  const remaining = blogs.slice(1);

  return (
    <main className="min-h-screen bg-[#F7F7F2] dark:bg-[#0E140E]">
      <Navigation />

      {/* Breadcrumb */}
      <div className="container-premium pt-24 pb-2">
        <nav className="flex items-center gap-2 text-xs text-neutral-400 dark:text-white/30">
          <Link href="/" className="hover:text-[#006838] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-600 dark:text-white/60">Journal</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pb-12 px-4">
        <div className="container-premium">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">
              Insights from the Kingdom
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-light text-neutral-900 dark:text-white mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Bhutan Travel{' '}
            <span className="gradient-text">Journal</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-white/50 max-w-2xl leading-relaxed">
            Stories, insights, and travel tips from the Land of the Thunder Dragon
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && featured.featured_image && (
        <section className="pb-12 px-4">
          <div className="container-premium">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-3xl overflow-hidden relative"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              }}
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                  <img
                    src={featured.featured_image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/20 dark:lg:to-[#0E140E]/20" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-[#1C241C]">
                  <div className="flex items-center gap-3 mb-4">
                    {featured.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#006838]/10 text-[#006838]">
                        {featured.category}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400 dark:text-white/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featured.content ? `${Math.max(1, Math.ceil(featured.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} min` : ''}
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-light text-neutral-900 dark:text-white mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-neutral-500 dark:text-white/50 mb-6 line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-neutral-400 dark:text-white/40">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {featured.published_at
                          ? new Date(featured.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : new Date(featured.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featured.author || 'Himalayan Marvels'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] mt-6 group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="pb-8 px-4">
          <div className="container-premium">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
              <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-neutral-400 dark:text-white/30 flex-shrink-0">
                Topics
              </span>
              <div className="w-px h-4 bg-neutral-200 dark:bg-white/10 flex-shrink-0" />
              {categories.map((cat) => (
                <span
                  key={cat as string}
                  className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-[#006838]/8 text-[#006838] border border-[#006838]/10"
                >
                  {cat as string}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="pb-24 px-4">
        <div className="container-premium">
          {remaining.length === 0 && !featured ? (
            <div className="text-center py-24">
              <p className="text-neutral-400 dark:text-white/30 text-lg">More stories coming soon from the Kingdom.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(remaining.length > 0 ? remaining : []).map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group"
                >
                  <article
                    className="bg-white dark:bg-[#1C241C] rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg"
                    style={{ border: '1px solid rgba(212, 175, 55, 0.06)' }}
                  >
                    {blog.featured_image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      {blog.category && (
                        <span className="text-xs text-[#006838] uppercase tracking-wider mb-3 font-semibold">
                          {blog.category}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-sm text-neutral-500 dark:text-white/50 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-neutral-400 dark:text-white/30 pt-4 border-t border-neutral-100 dark:border-white/5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {blog.published_at
                              ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{blog.author || 'Himalayan Marvels'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] mt-4 group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-neutral-100 dark:border-white/5">
        <div className="container-premium text-center">
          <p className="text-sm text-neutral-400 dark:text-white/30">
            &copy; {new Date().getFullYear()} Himalayan Marvels. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
