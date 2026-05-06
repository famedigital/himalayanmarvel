import { createClient } from '@/lib/supabase/server';
import { ItineraryEditForm } from '@/components/admin/itineraries/ItineraryEditForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItineraryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch itinerary with all details
  const { data: itinerary } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', id)
    .single();

  if (!itinerary) {
    notFound();
  }

  // Fetch itinerary days from the related table
  const { data: itineraryDays } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('itinerary_id', id)
    .order('day_number', { ascending: true });

  // Convert database days to form format
  const formattedDays = (itineraryDays || []).map(day => ({
    day: day.day_number,
    title: day.title,
    date: day.date || '',
    activity: day.subtitle || '',
    night: day.night_location || '',
    description: day.description || '',
    image_url: day.image_url || undefined,
    images: day.images || [], // Initialize images array
    highlights: day.highlights || undefined,
    meals: [day.breakfast, day.lunch, day.dinner].filter(Boolean) as string[],
    schedule: day.highlights || undefined,
  }));

  // Merge data
  const itineraryWithDays = {
    ...itinerary,
    itinerary_days: formattedDays,
  };

  return <ItineraryEditForm itineraryId={id} initialData={itineraryWithDays} />;
}
