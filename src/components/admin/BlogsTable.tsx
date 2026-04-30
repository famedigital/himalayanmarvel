'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText } from 'lucide-react';
import Link from 'next/link';
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
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Post</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Author</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Published</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Date</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Actions</th>
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
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {blog.featured_image && (
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{blog.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider truncate">{blog.excerpt || blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground border border-border">
                    {blog.category || 'General'}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{blog.author || 'Himalayan Marvels'}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase border ${
                    blog.is_published
                      ? 'bg-muted text-foreground border-border'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
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
                <td className="py-3 px-4">
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
