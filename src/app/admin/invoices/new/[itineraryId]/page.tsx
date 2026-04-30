import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InvoiceEditor } from '@/components/admin/invoice/InvoiceEditor';

interface PageProps {
  params: Promise<{
    itineraryId: string;
  }>;
}

export default async function NewInvoicePage({ params }: PageProps) {
  const supabase = await createClient();
  const { itineraryId } = await params;

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch itinerary with related data
  const { data: itinerary, error } = await supabase
    .from('itineraries')
    .select(`
      *,
      itinerary_days(*)
    `)
    .eq('id', itineraryId)
    .single();

  if (error) {
    console.error('Failed to fetch itinerary:', {
      error,
      errorMessage: error?.message,
      errorDetails: error?.details,
      errorHint: error?.hint,
      errorCode: error?.code,
      itineraryId,
      errorJSON: JSON.stringify(error),
    });
    redirect('/admin/itineraries?error=fetch_failed');
  }

  if (!itinerary) {
    console.error('Itinerary not found:', {
      itineraryId,
      note: 'Query returned no error but itinerary is null/undefined',
    });
    redirect('/admin/itineraries?error=not_found');
  }

  // Try to fetch booking separately (bookings reference itineraries, not vice versa)
  let booking = undefined;
  try {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .limit(1);

    booking = bookings?.[0];
  } catch (e) {
    // Booking lookup is optional, don't fail if it errors
    console.debug('Could not fetch booking for itinerary:', itineraryId);
  }

  return (
    <InvoiceEditor
      itinerary={itinerary}
      booking={booking}
    />
  );
}
