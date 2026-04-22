'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Map, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirm } from './DeleteConfirm';

interface Tour {
  id: string;
  title: string;
  slug: string;
  hero_image?: string;
  duration?: number;
  price?: number;
  category?: string;
  is_published: boolean;
}

interface ToursTableProps {
  tours: Tour[];
}

export function ToursTable({ tours }: ToursTableProps) {
  // State for delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [items, setItems] = useState(tours);

  // Find item being deleted for the modal message
  const deletingItem = items.find(t => t.id === deleteId);

  // DELETE FUNCTION - This is where "brain hooks to database"
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      // Create browser client - this is the key difference from server fetching!
      const supabase = createClient();

      // The mutation: delete from database
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      // Update local state to remove the item (optimistic UI update)
      setItems(prev => prev.filter(t => t.id !== deleteId));
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
        <Map className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
        <h3 className="text-gray-900 font-semibold text-lg mb-2">No tours yet</h3>
        <p className="text-gray-900/50">Create your first tour package</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Tour</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Duration</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Price</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Category</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Status</th>
              <th className="text-right py-4 px-6 text-gray-900/50 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tour) => (
              <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {tour.hero_image && (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={tour.hero_image}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-gray-900 font-medium">{tour.title}</p>
                      <p className="text-gray-900/50 text-sm">{tour.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {tour.duration ? `${tour.duration} days` : '-'}
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {tour.price ? `$${Number(tour.price).toLocaleString()}` : '-'}
                </td>
                <td className="py-4 px-6 text-gray-900">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900/70">
                    {tour.category || 'General'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    tour.is_published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tour.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/tours/${tour.id}/edit`}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900/70 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(tour.id)}
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

      {/* Delete Confirmation Modal */}
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
