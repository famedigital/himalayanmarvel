'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BlogsTable } from '@/components/admin/BlogsTable';

export function BlogListClient({ blogs }: { blogs: any[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) => {
      return (
        b.title?.toLowerCase().includes(q) ||
        b.slug?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q)
      );
    });
  }, [blogs, query]);

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all text-sm"
          />
        </div>
        {query && (
          <p className="mt-2 text-xs text-muted-foreground">
            {filtered.length} of {blogs.length} posts
          </p>
        )}
      </div>
      <BlogsTable blogs={filtered} />
    </>
  );
}
