import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { OperationsDashboard } from '@/components/admin/OperationsDashboard';

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

  if (!bookings) return [];

  // Try to fetch itineraries separately for bookings that have itinerary_id
  const itineraryIds = bookings
    .map(b => b.itinerary_id)
    .filter((id): id is string => id !== null && id !== undefined);

  let itinerariesMap: Record<string, { id: string; title: string }> = {};

  if (itineraryIds.length > 0) {
    try {
      const { data: itineraries } = await supabase
        .from('itineraries')
        .select('id, title')
        .in('id', itineraryIds);

      itinerariesMap = (itineraries || []).reduce((acc, i) => {
        acc[i.id] = i;
        return acc;
      }, {} as Record<string, { id: string; title: string }>);
    } catch (e) {
      console.debug('Could not fetch itineraries for bookings');
    }
  }

  // Merge itineraries into bookings
  return bookings.map(booking => ({
    ...booking,
    itinerary: booking.itinerary_id ? itinerariesMap[booking.itinerary_id] : undefined,
  }));
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations</h1>
          <p className="text-gray-900/50">Confirmed itineraries with guide, driver, and hotel assignments</p>
        </div>
        <Link
          href="/admin/itineraries"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Create from Itinerary
        </Link>
      </div>

      {/* Operations Dashboard */}
      <OperationsDashboard bookings={bookings} />
    </div>
  );
}
