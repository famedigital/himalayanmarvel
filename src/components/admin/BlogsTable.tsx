'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirm } from './DeleteConfirm';

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

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
        <h3 className="text-gray-900 font-semibold text-lg mb-2">No blogs yet</h3>
        <p className="text-gray-900/50">Write your first blog post</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Post</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Category</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Author</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Published</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Date</th>
              <th className="text-right py-4 px-6 text-gray-900/50 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((blog) => (
              <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {blog.featured_image && (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-gray-900 font-medium">{blog.title}</p>
                      <p className="text-gray-900/50 text-sm truncate max-w-xs">{blog.excerpt || blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900/70">
                    {blog.category || 'General'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {blog.author || 'Himalayan Marvels'}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    blog.is_published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {blog.is_published ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-900/50 text-sm">
                  {blog.published_at
                    ? new Date(blog.published_at).toLocaleDateString()
                    : new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blog/${blog.id}/edit`}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900/70 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(blog.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
