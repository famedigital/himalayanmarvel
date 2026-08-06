import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BlogListClient } from '@/components/admin/BlogListClient';

async function getBlogs() {
  const supabase = await createClient();

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return blogs || [];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-wide">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your travel blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Write Blog
        </Link>
      </div>

      <BlogListClient blogs={blogs} />
    </>
  );
}
