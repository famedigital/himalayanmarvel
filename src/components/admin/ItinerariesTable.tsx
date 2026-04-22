'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Eye, Download, Pencil, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirm } from './DeleteConfirm';

interface Itinerary {
  id: string;
  title: string;
  guest_names: string;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'final';
  created_at: string;
  itinerary_days?: { count: number }[];
}

interface ItinerariesTableProps {
  itineraries: Itinerary[];
}

export function ItinerariesTable({ itineraries }: ItinerariesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [items, setItems] = useState(itineraries);

  const deletingItem = items.find(i => i.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateHTML = async (id: string) => {
    setGenerating(id);
    try {
      const response = await fetch(`/api/itineraries/${id}/html`);
      if (!response.ok) throw new Error('Failed to generate HTML');

      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary-${id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate HTML. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
        <h3 className="text-gray-900 font-semibold text-lg mb-2">No itineraries yet</h3>
        <p className="text-gray-900/50">Create your first custom itinerary</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Itinerary</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Guest(s)</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Dates</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Days</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Status</th>
              <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Created</th>
              <th className="text-right py-4 px-6 text-gray-900/50 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itinerary) => (
              <tr key={itinerary.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="text-gray-900 font-medium">{itinerary.title}</p>
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {itinerary.guest_names}
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {itinerary.start_date && itinerary.end_date
                    ? `${formatDate(itinerary.start_date)} - ${formatDate(itinerary.end_date)}`
                    : '-'}
                </td>
                <td className="py-4 px-6 text-gray-900">
                  {itinerary.itinerary_days?.[0]?.count || 0} days
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    itinerary.status === 'final'
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-yellow-500/20 text-yellow-600'
                  }`}>
                    {itinerary.status === 'final' ? 'Final' : 'Draft'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-900/50 text-sm">
                  {new Date(itinerary.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/itineraries/${itinerary.id}/edit`}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900/70 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleGenerateHTML(itinerary.id)}
                      disabled={generating === itinerary.id}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                      title="Generate HTML"
                    >
                      {generating === itinerary.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteId(itinerary.id)}
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
