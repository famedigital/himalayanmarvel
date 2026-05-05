import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getOperationsBookings() {
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
    .in('status', ['confirmed', 'paid'])
    .order('travel_date', { ascending: true });

  return bookings || [];
}

export default async function OperationsPage() {
  const bookings = await getOperationsBookings();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/bookings"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Operations Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign guides, hotels, transport & track permits
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Total Operations
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {bookings.length}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
            Upcoming Departures
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {bookings.filter(b => {
              const travelDate = new Date(b.travel_date || '');
              const today = new Date();
              const daysUntil = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return daysUntil >= 0 && daysUntil <= 7;
            }).length}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
            Pending Assignments
          </p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
            {bookings.filter(b => !b.guide_details || !b.car_details).length}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            Ready to Deploy
          </p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
            {bookings.filter(b => b.guide_details && b.car_details && b.hotel_details).length}
          </p>
        </div>
      </div>

      {/* Operations List */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-2">No operations yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Operations appear after confirming invoices for itineraries
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin/itineraries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Manage Itineraries
            </Link>
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              View Invoices
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Client / Itinerary
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Travel Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assignments
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const travelDate = booking.travel_date
                  ? new Date(booking.travel_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'TBD';

                const hasGuide = !!booking.guide_details;
                const hasCar = !!booking.car_details;
                const hasHotel = !!booking.hotel_details;

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {booking.client_name}
                        </p>
                        {booking.itinerary_id && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Custom Itinerary
                          </p>
                        )}
                        {booking.tours && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {booking.tours.title}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 dark:text-gray-300">
                        {travelDate}
                      </span>
                      {booking.num_pax && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          ({booking.num_pax} pax)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {hasGuide && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400 rounded">
                            👨‍💼 Guide
                          </span>
                        )}
                        {hasCar && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 rounded">
                            🚗 Car
                          </span>
                        )}
                        {hasHotel && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 rounded">
                            🏨 Hotel
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/operations/${booking.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                      >
                        Manage Operations
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
