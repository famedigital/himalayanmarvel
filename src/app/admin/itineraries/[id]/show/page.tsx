import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Car, Hotel, IdCard, FileText, Receipt, CreditCard } from 'lucide-react';
import { OperationsAssignmentPanel } from '@/components/admin/OperationsAssignmentPanel';
import { ItineraryDetailActions } from '@/components/admin/ItineraryDetailActions';
import { ReadyForOperationsCard } from '@/components/admin/ReadyForOperationsCard';
import { ItineraryInvoiceManager } from '@/components/admin/ItineraryInvoiceManager';

async function getItinerary(itineraryId: string) {
  const supabase = await createClient();

  const { data: itinerary } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', itineraryId)
    .single();

  if (!itinerary) {
    return null;
  }

  // Check for associated booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('itinerary_id', itineraryId)
    .in('status', ['confirmed', 'paid'])
    .single();

  return { itinerary, booking };
}

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getItinerary(id);

  if (!result) {
    notFound();
  }

  const { itinerary, booking } = result;

  const travelDate = itinerary.start_date
    ? new Date(itinerary.start_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'TBD';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/itineraries"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {itinerary.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {itinerary.subtitle || 'Custom Tour'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {itinerary.guest_names} • {itinerary.duration_days} days / {itinerary.duration_nights} nights
              </p>
            </div>
            <ItineraryDetailActions id={id} hasBooking={!!booking} />
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Status</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2 capitalize">
            {itinerary.status || 'Draft'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Travel Date</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {travelDate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Guests</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {itinerary.guest_names}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Price</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {itinerary.currency || 'INR'} {itinerary.total_price?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      {/* Confirmed Booking - Operations Section */}
      {booking && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ✅ Confirmed Booking - Operations Ready
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Manage all operations for this itinerary below
              </p>
            </div>
            <Link
              href={`/admin/operations/${booking.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              Open Full Operations
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          {/* Quick Operations Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <QuickOpCard
              icon={User}
              label="Guides"
              status={booking.guide_details ? 'assigned' : 'pending'}
              color="blue"
              bookingId={booking.id}
            />
            <QuickOpCard
              icon={Car}
              label="Transport"
              status={booking.car_details ? 'assigned' : 'pending'}
              color="green"
              bookingId={booking.id}
            />
            <QuickOpCard
              icon={Hotel}
              label="Hotels"
              status={booking.hotel_details ? 'booked' : 'pending'}
              color="purple"
              bookingId={booking.id}
            />
            <QuickOpCard
              icon={IdCard}
              label="Passports"
              status="pending"
              color="orange"
              bookingId={booking.id}
            />
            <QuickOpCard
              icon={FileText}
              label="Permits"
              status="pending"
              color="red"
              bookingId={booking.id}
            />
          </div>
        </div>
      )}

      {/* Ready for Operations Card (when no confirmed booking) */}
      {!booking && <ReadyForOperationsCard itineraryId={id} />}

      {/* Operations Assignment Panel */}
      {booking && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Operations
          </h3>
          <OperationsAssignmentPanel bookingId={booking.id} />
        </div>
      )}
    </div>
  );
}

function QuickOpCard({
  icon: Icon,
  label,
  status,
  color,
  bookingId
}: {
  icon: any;
  label: string;
  status: string;
  color: string;
  bookingId: string;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400',
  };

  const isAssigned = status !== 'pending';

  return (
    <Link
      href={`/admin/operations/${bookingId}`}
      className={`block p-4 rounded-lg border transition-all hover:shadow-lg ${
        isAssigned
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75'
      }`}
    >
      <Icon className={`w-8 h-8 mb-2 ${colors[color as keyof typeof colors]}`} />
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
        {label}
      </h4>
      <p className={`text-xs font-medium ${
        isAssigned
          ? 'text-green-700 dark:text-green-400'
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        {isAssigned ? '✓ ' + status : '○ ' + status}
      </p>
    </Link>
  );
}
