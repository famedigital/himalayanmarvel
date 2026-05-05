import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OperationsAssignmentPanel } from '@/components/admin/OperationsAssignmentPanel';

async function getBooking(bookingId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours (
        id,
        title,
        slug
      ),
      itineraries (
        id,
        title
      )
    `)
    .eq('id', bookingId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function OperationsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const travelDate = booking.travel_date
    ? new Date(booking.travel_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'TBD';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/operations"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {booking.client_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {booking.tours?.title || booking.itineraries?.title || 'Custom Tour'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              booking.status === 'paid'
                ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            Travel Date
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {travelDate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            Number of Guests
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {booking.num_pax || 'TBD'} pax
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            Total Amount
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {booking.currency || 'INR'} {booking.amount?.toLocaleString() || 'TBD'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            Booking ID
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono text-sm">
            {booking.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      {/* Operations Assignment Panel */}
      <OperationsAssignmentPanel bookingId={booking.id} />
    </div>
  );
}
