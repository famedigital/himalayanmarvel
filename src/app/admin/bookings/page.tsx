import { createClient } from '@/lib/supabase/server';
import { Calendar, User, DollarSign, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
          <input
            type="text"
            placeholder="Search by client name..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
          <select className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
            <h3 className="text-gray-900 font-semibold text-lg mb-2">No bookings yet</h3>
            <p className="text-gray-900/50 mb-6">Create your first booking</p>
            <Link
              href="/admin/bookings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              New Booking
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Client</th>
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Tour</th>
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Pax</th>
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-900/50 text-sm font-medium">Travel Date</th>
                  <th className="text-right py-4 px-6 text-gray-900/50 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 font-medium">{booking.client_name}</p>
                        <p className="text-gray-900/50 text-sm">{booking.email || booking.phone || '-'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {booking.tours ? (
                        <Link
                          href={`/admin/tours/${booking.tours.id}/edit`}
                          className="text-orange-500 hover:text-orange-400 font-medium"
                        >
                          {booking.tours.title}
                        </Link>
                      ) : (
                        <span className="text-gray-900/50">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {booking.no_of_pax || 1}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {booking.amount ? `$${Number(booking.amount).toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : booking.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : booking.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {booking.travel_date
                        ? new Date(booking.travel_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900/70 hover:text-gray-900 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
