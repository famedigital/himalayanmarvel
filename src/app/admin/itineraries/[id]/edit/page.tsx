import { createClient } from '@/lib/supabase/server';
import { ItineraryForm } from '@/components/admin/ItineraryForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItineraryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: itinerary } = await supabase
    .from('itineraries')
    .select('*, itinerary_days(*), itinerary_section_openers(*)')
    .eq('id', id)
    .single();

  if (!itinerary) {
    notFound();
  }

  return (
    <div className="p-8">
      <ItineraryForm initialData={itinerary} />
    </div>
  );
}
