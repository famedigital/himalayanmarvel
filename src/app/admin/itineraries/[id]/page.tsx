import { createClient } from '@/lib/supabase/server';
import { ItineraryDetailTabs } from '@/components/admin/itineraries/ItineraryDetailTabs';
import { notFound } from 'next/navigation';

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch itinerary
  const { data: itinerary, error: itineraryError } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', id)
    .single();

  if (itineraryError || !itinerary) {
    notFound();
  }

  // Fetch booking (if exists)
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('itinerary_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('itinerary_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <a href="/admin/itineraries" className="hover:text-gray-900 dark:hover:text-gray-100">
          Itineraries
        </a>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{itinerary.title}</span>
      </div>

      <ItineraryDetailTabs
        itineraryId={id}
        itinerary={itinerary}
        booking={booking}
        invoices={invoices || []}
      />
    </div>
  );
}
