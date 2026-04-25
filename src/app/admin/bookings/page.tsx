import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BookingsTableServer } from '@/components/admin/BookingsTable';
import type { Booking } from '@/lib/supabase/types';

async function getBookings() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      tours (
        id,
        title,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  return bookings || [];
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-900/50">Manage client bookings and payments</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </Link>
      </div>

      {/* Bookings Table */}
      <BookingsTableServer bookings={bookings} />
    </div>
  );
}
