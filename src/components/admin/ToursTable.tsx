'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  DataTable,
  DataTableFilter,
  StatusBadge,
  createDeleteHandler,
} from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Map } from 'lucide-react';
import { DeleteConfirm } from './DeleteConfirm';
import { TableRowActions } from './TableRowActions';
import type { Tour } from '@/lib/supabase/types';

// ============================================================================
// Table Columns Definition
// ============================================================================

const createColumns = (
  onDeleteClick: (id: string, title: string) => void
): ColumnDef<Tour>[] => [
  {
    accessorKey: 'title',
    header: 'Tour',
    cell: ({ row }) => {
      const tour = row.original;
      return (
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
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number | null;
      return <span className="text-gray-900">{duration ? `${duration} days` : '-'}</span>;
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number | null;
      return (
        <span className="text-gray-900">
          {price ? `$${Number(price).toLocaleString()}` : '-'}
        </span>
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string | null;
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900/70">
          {category || 'General'}
        </span>
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'is_published',
    header: 'Status',
    cell: ({ row }) => {
      const isPublished = row.getValue('is_published') as boolean;
      return (
        <StatusBadge
          status={isPublished ? 'Published' : 'Draft'}
          variant={isPublished ? 'success' : 'warning'}
        />
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <span className="text-gray-900/50 text-sm">{new Date(date).toLocaleDateString()}</span>;
    },
    meta: {
      sortable: true,
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const tour = row.original;
      return (
        <TableRowActions
          id={tour.id}
          editHref={`/admin/tours/${tour.id}/edit`}
          viewHref={`/tours/${tour.slug}`}
          onDelete={() => onDeleteClick(tour.id, tour.title)}
          copyValue={tour.id}
        />
      );
    },
    meta: {
      sortable: false,
    },
  },
];

// ============================================================================
// Tours Table Component
// ============================================================================

interface ToursTableProps {
  tours: Tour[];
  categories?: string[];
}

export function ToursTable({ tours: initialTours, categories = [] }: ToursTableProps) {
  // State for delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find item being deleted
  const deletingItem = initialTours.find((t) => t.id === deleteId);

  // Build filter options from available data
  const filterOptions = useMemo(() => {
    // Get unique categories from tours
    const uniqueCategories = Array.from(
      new Set(initialTours.map((t) => t.category).filter(Boolean))
    ) as string[];

    return [
      {
        id: 'status',
        label: 'All Status',
        options: [
          { value: 'published', label: 'Published', count: initialTours.filter((t) => t.is_published).length },
          { value: 'draft', label: 'Draft', count: initialTours.filter((t) => !t.is_published).length },
        ],
      },
      {
        id: 'category',
        label: 'All Categories',
        options: uniqueCategories.map((cat) => ({
          value: cat,
          label: cat,
          count: initialTours.filter((t) => t.category === cat).length,
        })),
      },
    ] as DataTableFilter[];
  }, [initialTours]);

  // Create columns
  const columns = useMemo(() => createColumns(setDeleteId), []);

  // Query function for React Query
  const fetchTours = async (): Promise<Tour[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('tours').delete().eq('id', deleteId);

      if (error) throw error;

      setDeleteId(null);
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DataTable
        queryKey={['tours']}
        queryFn={fetchTours}
        initialData={initialTours}
        columns={columns}
        filters={filterOptions}
        searchPlaceholder="Search by title..."
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        enableColumnVisibility={true}
        emptyState={{
          icon: <Map className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />,
          title: 'No tours yet',
          description: 'Create your first tour package',
          action: {
            label: 'Create Tour',
            href: '/admin/tours/new',
          },
        }}
        renderMobileCard={(tour) => (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {tour.hero_image && (
                <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <img
                    src={tour.hero_image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-foreground">{tour.title}</p>
                <p className="text-sm text-muted-foreground">{tour.slug}</p>
              </div>
              <StatusBadge
                status={tour.is_published ? 'Published' : 'Draft'}
                variant={tour.is_published ? 'success' : 'warning'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration</span>
                <p className="font-medium text-foreground">
                  {tour.duration ? `${tour.duration} days` : '-'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Price</span>
                <p className="font-medium text-foreground">
                  {tour.price ? `$${Number(tour.price).toLocaleString()}` : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end pt-2 border-t">
              <TableRowActions
                id={tour.id}
                editHref={`/admin/tours/${tour.id}/edit`}
                viewHref={`/tours/${tour.slug}`}
                onDelete={() => setDeleteId(tour.id)}
                copyValue={tour.id}
              />
            </div>
          </div>
        )}
      />

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

// ============================================================================
// Server Component Wrapper (for SSR)
// ============================================================================

interface ToursTableServerProps {
  tours: Tour[];
  categories?: string[];
}

export function ToursTableServer({ tours, categories }: ToursTableServerProps) {
  return <ToursTable tours={tours} categories={categories} />;
}
