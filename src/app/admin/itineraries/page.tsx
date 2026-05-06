import { createClient } from '@/lib/supabase/server';
import { ItinerariesDashboard } from '@/components/admin/ItinerariesDashboard';

export default async function ItinerariesPage() {
  const supabase = await createClient();

  const { data: itineraries } = await supabase
    .from('itineraries')
    .select('*, itinerary_days(count)')
    .order('created_at', { ascending: false });

  // Get booking stats
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, itineraries(*)')
    .in('status', ['confirmed', 'paid']);

  // Get invoice stats and data
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, itineraries(id, title, guest_names)')
    .order('created_at', { ascending: false });

  return (
    <ItinerariesDashboard
      itineraries={itineraries || []}
      bookings={bookings || []}
      invoices={invoices || []}
    />
  );
}
