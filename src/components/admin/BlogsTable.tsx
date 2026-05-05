'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteConfirm } from './DeleteConfirm';
import { BlogTableRowActions } from './BlogTableRowActions';
import { formatDateCondensed } from '@/lib/utils';

interface Blog {
  id: string;
  title: string;
  slug: string;
  featured_image?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

interface BlogsTableProps {
  blogs: Blog[];
}

export function BlogsTable({ blogs }: BlogsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);
  const [items, setItems] = useState(blogs);

  const deletingItem = items.find(b => b.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setItems(prev => prev.filter(b => b.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    setTogglingPublish(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('blogs')
        .update({
          is_published: !currentlyPublished,
          published_at: !currentlyPublished ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(b =>
        b.id === id
          ? { ...b, is_published: !currentlyPublished, published_at: !currentlyPublished ? new Date().toISOString() : undefined }
          : b
      ));
    } catch (error) {
      console.error('Toggle publish failed:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setTogglingPublish(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
          <FileText className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-stone-700 mb-2">No blog posts yet</h3>
        <p className="text-stone-500 tracking-wide">Share your first Bhutan travel story</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[35%]">Post</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[15%]">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[15%]">Author</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[12%]">Published</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[13%]">Date</th>
              <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((blog, index) => (
              <tr
                key={blog.id}
                className={`transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                } hover:bg-muted/40`}
              >
                <td className="py-3 px-4 w-[35%] max-w-[35%]">
                  <div className="flex items-center gap-3">
                    {blog.featured_image && (
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={blog.featured_image}
                          alt={blog.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">{blog.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider truncate">{blog.excerpt || blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground border border-border">
                    {blog.category || 'General'}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs w-[15%]">{blog.author || 'Himalayan Marvels'}</td>
                <td className="py-3 px-4 w-[12%]">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase border ${
                    blog.is_published
                      ? 'bg-muted text-foreground border-border'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs w-[13%]">
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                </td>
                <td className="py-3 px-4 text-center w-[10%] relative">
                  <div className="flex items-center justify-center">
                    <BlogTableRowActions
                      id={blog.id}
                      title={blog.title}
                      editHref={`/admin/blog/${blog.id}/edit`}
                      viewHref={`/blog/${blog.slug}`}
                      isPublished={blog.is_published}
                      isToggling={togglingPublish === blog.id}
                      onTogglePublish={() => handleTogglePublish(blog.id, blog.is_published)}
                      onDelete={() => setDeleteId(blog.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && deletingItem && (
        <DeleteConfirm
          itemName={deletingItem.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
