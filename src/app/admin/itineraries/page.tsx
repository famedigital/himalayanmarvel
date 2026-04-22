import { createClient } from '@/lib/supabase/server';
import { ItinerariesTable } from '@/components/admin/ItinerariesTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ItinerariesPage() {
  const supabase = await createClient();

  const { data: itineraries } = await supabase
    .from('itineraries')
    .select('*, itinerary_days(count)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Itineraries</h1>
          <p className="text-gray-500">Create and manage custom tour itineraries</p>
        </div>
        <Link
          href="/admin/itineraries/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Itinerary
        </Link>
      </div>

      <ItinerariesTable itineraries={itineraries || []} />
    </div>
  );
}
