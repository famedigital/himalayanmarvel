'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  DataTable,
  DataTableFilter,
  StatusBadge,
} from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, User, Mail, Phone, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { TableRowActions } from './TableRowActions';
import type { Booking, Tour } from '@/lib/supabase/types';

// ============================================================================
// Types
// ============================================================================

interface BookingWithTour extends Booking {
  tour?: Tour;
}

// ============================================================================
// Table Columns Definition
// ============================================================================

const createColumns = (): ColumnDef<BookingWithTour>[] => [
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <p className="text-gray-900 font-medium">{booking.client_name}</p>
          </div>
          {booking.email && (
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-3 h-3 text-gray-400" />
              <p className="text-gray-900/50 text-sm truncate">{booking.email}</p>
            </div>
          )}
          {booking.phone && (
            <div className="flex items-center gap-2 mt-0.5">
              <Phone className="w-3 h-3 text-gray-400" />
              <p className="text-gray-900/50 text-sm">{booking.phone}</p>
            </div>
          )}
        </div>
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'tour',
    header: 'Tour',
    cell: ({ row }) => {
      const booking = row.original;
      if (!booking.tour) {
        return <span className="text-gray-900/50">-</span>;
      }
      return (
        <Link
          href={`/admin/tours/${booking.tour.id}/edit`}
          className="text-orange-500 hover:text-orange-400 font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {booking.tour.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'no_of_pax',
    header: 'Pax',
    cell: ({ row }) => {
      const pax = row.getValue('no_of_pax') as number;
      return <span className="text-gray-900">{pax || 1}</span>;
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number | null;
      return (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">
            {amount ? Number(amount).toLocaleString() : '-'}
          </span>
        </div>
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variantMap: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'default'> = {
        paid: 'success',
        confirmed: 'info',
        pending: 'warning',
        cancelled: 'destructive',
      };
      return (
        <StatusBadge
          status={status || 'pending'}
          variant={variantMap[status] || 'default'}
        />
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'travel_date',
    header: 'Travel Date',
    cell: ({ row }) => {
      const date = row.getValue('travel_date') as string | null;
      if (!date) {
        return <span className="text-gray-900/50">-</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
        </div>
      );
    },
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'booking_date',
    header: 'Booked',
    cell: ({ row }) => {
      const date = row.getValue('booking_date') as string | null;
      if (!date) {
        return <span className="text-gray-900/50">-</span>;
      }
      return <span className="text-gray-900/50 text-sm">{format(new Date(date), 'MMM d, yyyy')}</span>;
    },
    meta: {
      sortable: true,
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <TableRowActions
          id={booking.id}
          editHref={`/admin/bookings/${booking.id}/edit`}
          viewHref={`/admin/bookings/${booking.id}`}
          copyValue={booking.id}
        />
      );
    },
    meta: {
      sortable: false,
    },
  },
];

// ============================================================================
// Bookings Table Component
// ============================================================================

interface BookingsTableProps {
  bookings: BookingWithTour[];
}

export function BookingsTable({ bookings: initialBookings }: BookingsTableProps) {
  // Build filter options from available data
  const filterOptions = useMemo(() => {
    const statusCounts = {
      pending: initialBookings.filter((b) => b.status === 'pending').length,
      confirmed: initialBookings.filter((b) => b.status === 'confirmed').length,
      paid: initialBookings.filter((b) => b.status === 'paid').length,
      cancelled: initialBookings.filter((b) => b.status === 'cancelled').length,
    };

    return [
      {
        id: 'status',
        label: 'All Status',
        options: [
          { value: 'pending', label: 'Pending', count: statusCounts.pending },
          { value: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          { value: 'paid', label: 'Paid', count: statusCounts.paid },
          { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
        ],
      },
    ] as DataTableFilter[];
  }, [initialBookings]);

  // Create columns
  const columns = useMemo(() => createColumns(), []);

  // Query function for React Query
  const fetchBookings = async (): Promise<BookingWithTour[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, tour:tours(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as BookingWithTour[];
  };

  return (
    <DataTable
      queryKey={['bookings']}
      queryFn={fetchBookings}
      initialData={initialBookings}
      columns={columns}
      filters={filterOptions}
      searchPlaceholder="Search by client name or email..."
      searchField="client_name"
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      enableColumnVisibility={true}
      emptyState={{
        icon: <Calendar className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />,
        title: 'No bookings yet',
        description: 'Manage client bookings and payments',
        action: {
          label: 'New Booking',
          href: '/admin/bookings/new',
        },
      }}
      onRowClick={(booking) => {
        window.location.href = `/admin/bookings/${booking.id}`;
      }}
      renderMobileCard={(booking) => (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900 font-medium">{booking.client_name}</p>
            </div>
            <StatusBadge
              status={booking.status || 'pending'}
              variant={
                booking.status === 'paid'
                  ? 'success'
                  : booking.status === 'confirmed'
                  ? 'info'
                  : booking.status === 'cancelled'
                  ? 'destructive'
                  : 'warning'
              }
            />
          </div>
          {booking.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3 text-gray-400" />
              <p className="text-gray-900/50">{booking.email}</p>
            </div>
          )}
          {booking.travel_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3 h-3 text-gray-400" />
              <p className="text-gray-900">
                {format(new Date(booking.travel_date), 'MMM d, yyyy')}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-900">{booking.no_of_pax || 1} pax</span>
              {booking.amount && (
                <span className="text-gray-900 font-medium">
                  ${Number(booking.amount).toLocaleString()}
                </span>
              )}
            </div>
            <Link
              href={`/admin/bookings/${booking.id}`}
              className="text-orange-500 hover:text-orange-400"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    />
  );
}

// ============================================================================
// Server Component Wrapper (for SSR)
// ============================================================================

interface BookingsTableServerProps {
  bookings: BookingWithTour[];
}

export function BookingsTableServer({ bookings }: BookingsTableServerProps) {
  return <BookingsTable bookings={bookings} />;
}
