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
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Posts</h1>
          <p className="text-gray-900/50">Manage your travel blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Write Blog
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden">
        <BlogsTable blogs={blogs} />
      </div>
    </div>
  );
}
