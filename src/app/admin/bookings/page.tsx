import { createClient } from '@/lib/supabase/server';
import { Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
  // Redirect to the new operations page
  redirect('/admin/operations');
}
