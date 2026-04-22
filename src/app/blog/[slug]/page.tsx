import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

async function getBlog(slug: string) {
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return blog;
}

async function getRecentBlogs(currentId: string) {
  const supabase = await createClient();

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, featured_image, excerpt')
    .eq('is_published', true)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3);

  return blogs || [];
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  const recentBlogs = await getRecentBlogs(blog.id);

  return (
    <main className="min-h-screen dark:bg-black bg-neutral-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 dark:bg-black/80 bg-neutral-50/80 backdrop-blur-xl border-b dark:border-white/10 border-neutral-200">
        <div className="container-premium">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-sm font-light tracking-[0.15em] dark:text-white text-neutral-900">
              HIMALAYAN MARVELS
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-xs dark:text-white/60 text-neutral-600 hover:dark:text-white hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Posts
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      {blog.featured_image && (
        <section className="pt-16">
          <div className="relative h-[50vh] min-h-[400px]">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 dark:bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="pb-24 px-4">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm dark:text-white/60 text-neutral-600 mb-6">
              {blog.category && (
                <span className="px-3 py-1 dark:bg-white/10 bg-neutral-200 rounded-full dark:text-white text-neutral-700">
                  {blog.category}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{blog.author || 'Himalayan Marvels'}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mb-8">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl dark:text-white/70 text-neutral-700 leading-relaxed mb-12 pb-12 border-b dark:border-white/10 border-neutral-200">
                {blog.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none dark:prose-headings:text-white prose-headings:text-neutral-900 dark:prose-p:text-white/70 prose-p:text-neutral-700 dark:prose-a:text-orange-400 prose-a:text-orange-600 dark:prose-strong:text-white prose-strong:text-neutral-900 dark:prose-code:text-orange-400 prose-code:text-orange-600 dark:prose-pre:text-white prose-pre:text-neutral-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-12 border-t dark:border-white/10 border-neutral-200">
                <p className="text-sm dark:text-white/50 text-neutral-500 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 dark:bg-white/5 bg-neutral-100 rounded-full text-sm dark:text-white/60 text-neutral-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Gallery */}
      {blog.gallery_images && blog.gallery_images.length > 0 && (
        <section className="pb-24 px-4 dark:bg-white/5 bg-neutral-100">
          <div className="container-premium">
            <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blog.gallery_images.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentBlogs.length > 0 && (
        <section className="pb-24 px-4">
          <div className="container-premium">
            <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-8">More Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentBlogs.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="dark:bg-white/5 bg-white rounded-xl overflow-hidden border dark:border-white/10 border-neutral-200 hover:shadow-xl transition-all">
                    {post.featured_image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm dark:text-white/60 text-neutral-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
