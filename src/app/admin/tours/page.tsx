import { createClient } from '@/lib/supabase/server';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { ToursTable } from '@/components/admin/ToursTable';

async function getTours() {
  const supabase = await createClient();

  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });

  return tours || [];
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tours</h1>
          <p className="text-gray-900/50">Manage your tour packages</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Create Tour
        </Link>
      </div>

      {/* Search Bar - Client Component for interactivity */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
          <input
            type="text"
            placeholder="Search tours..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden">
        <ToursTable tours={tours} />
      </div>
    </div>
  );
}
