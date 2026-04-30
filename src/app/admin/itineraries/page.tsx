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
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-wide">Itineraries</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage custom tour itineraries</p>
          </div>
          <Link
            href="/admin/itineraries/new"
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Itinerary
          </Link>
        </div>
      </div>

      {/* Table */}
      <ItinerariesTable itineraries={itineraries || []} />
    </>
  );
}
