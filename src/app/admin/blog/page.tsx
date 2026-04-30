import { createClient } from '@/lib/supabase/server';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { BlogsTable } from '@/components/admin/BlogsTable';

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
      {/* Header */}
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <BlogsTable blogs={blogs} />
    </>
  );
}
