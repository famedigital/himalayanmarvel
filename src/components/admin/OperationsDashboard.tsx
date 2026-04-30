'use client';

import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IntelligentBookingCard, type Booking } from './IntelligentBookingCard';

interface OperationsDashboardProps {
  bookings: Booking[];
}

export function OperationsDashboard({ bookings }: OperationsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter bookings based on search and status
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.client_name.toLowerCase().includes(query) ||
          booking.guide_details?.toLowerCase().includes(query) ||
          booking.car_details?.toLowerCase().includes(query) ||
          booking.itinerary?.title.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      paid: bookings.filter(b => b.status === 'paid').length,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-gray-900 dark:text-gray-100">
            Operations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage bookings, guides, drivers, and hotel confirmations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-xs text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {stats.pending}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide">Confirmed</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {stats.confirmed}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 p-4">
          <p className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wide">Paid</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {stats.paid}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by guest, guide, driver, or itinerary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery || statusFilter !== 'all' ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      ) : null}

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => (
            <IntelligentBookingCard
              key={booking.id}
              booking={booking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No bookings found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
