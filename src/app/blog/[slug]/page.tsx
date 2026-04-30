import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import JsonLd from '@/components/seo/JsonLd';
import { generateSeoMetadata, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { getRelatedToursForBlog } from '@/lib/supabase/queries';
import type { Metadata } from 'next';
import BlogPostLayout from '@/components/blog/BlogPostLayout';

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
  updated_at: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
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
    .select('id, title, slug, featured_image, excerpt, category')
    .eq('is_published', true)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(4);

  return blogs || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {};
  }

  const description = blog.excerpt || '';
  const image = blog.featured_image || '/og-image.jpg';
  const publishedTime = blog.published_at || blog.created_at;
  const modifiedTime = blog.updated_at;

  return generateSeoMetadata({
    title: blog.title,
    description,
    image,
    canonical: `/blog/${blog.slug}`,
    publishedTime,
    modifiedTime,
    authors: blog.author,
    type: 'article',
  });
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const recentBlogs = await getRecentBlogs(blog.id);
  const relatedTours = await getRelatedToursForBlog(blog.category, blog.id);

  // Generate JSON-LD schemas
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: blog.title, href: `/blog/${blog.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema({ items: breadcrumbItems });

  const articleSchema = generateArticleSchema({
    title: blog.title,
    description: blog.excerpt || blog.title,
    slug: blog.slug,
    image: blog.featured_image || '/og-image.jpg',
    publishedTime: blog.published_at || blog.created_at,
    modifiedTime: blog.updated_at,
    author: blog.author || 'Himalayan Marvels',
  });

  const jsonLdData = [breadcrumbSchema, articleSchema];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <Navigation />
      <BlogPostLayout blog={blog} recentPosts={recentBlogs} relatedTours={relatedTours} />
    </>
  );
}
