import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
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

  return (
    <main className="min-h-screen dark:bg-black bg-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container-premium">
          <span className="text-xs dark:text-white/30 text-neutral-500 uppercase tracking-[0.25em]">
            Bhutan Travel Journal
          </span>
          <h1 className="text-5xl md:text-6xl font-bold dark:text-white text-neutral-900 mt-4 mb-6">
            Our <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl dark:text-white/60 text-neutral-600 max-w-2xl">
            Stories, insights, and travel tips from the Land of the Thunder Dragon
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {blogs.length > 0 && blogs[0].featured_image && (
        <section className="pb-16 px-4">
          <div className="container-premium">
            <Link
              href={`/blog/${blogs[0].slug}`}
              className="group block dark:bg-white/5 bg-white rounded-3xl overflow-hidden border dark:border-white/10 border-neutral-200 hover:shadow-2xl transition-all duration-500"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto">
                  <img
                    src={blogs[0].featured_image}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 dark:bg-gradient-to-t from-black/60 to-transparent lg:dark:bg-gradient-to-r lg:from-black/40 lg:to-transparent" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {blogs[0].category && (
                    <span className="text-xs dark:text-orange-400 text-orange-600 uppercase tracking-wider mb-4">
                      {blogs[0].category}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-neutral-900 mb-4">
                    {blogs[0].title}
                  </h2>
                  {blogs[0].excerpt && (
                    <p className="dark:text-white/60 text-neutral-600 mb-6 line-clamp-2">
                      {blogs[0].excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm dark:text-white/50 text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {blogs[0].published_at
                          ? new Date(blogs[0].published_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : new Date(blogs[0].created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{blogs[0].author || 'Himalayan Marvels'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="pb-24 px-4">
        <div className="container-premium">
          <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-8">
            Latest Stories
          </h2>

          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="dark:text-white/50 text-neutral-500 text-lg">No stories yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group"
                >
                  <article className="dark:bg-white/5 bg-white rounded-2xl overflow-hidden border dark:border-white/10 border-neutral-200 hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                    {/* Featured Image */}
                    {blog.featured_image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category */}
                      {blog.category && (
                        <span className="text-xs dark:text-orange-400 text-orange-600 uppercase tracking-wider mb-3">
                          {blog.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-sm dark:text-white/60 text-neutral-600 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs dark:text-white/50 text-neutral-500 pt-4 border-t dark:border-white/10 border-neutral-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {blog.published_at
                              ? new Date(blog.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : new Date(blog.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{blog.author || 'Himalayan Marvels'}</span>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-sm font-medium dark:text-orange-400 text-orange-600 mt-4 group-hover:gap-3 transition-all">
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

      {/* Simple Copyright */}
      <footer className="py-8 border-t dark:border-white/10 border-neutral-200">
        <div className="container-premium text-center">
          <p className="text-sm dark:text-white/50 text-neutral-500">
            © {new Date().getFullYear()} Himalayan Marvels. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
