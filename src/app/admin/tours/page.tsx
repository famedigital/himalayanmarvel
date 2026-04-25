import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
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

async function getCategories() {
  const supabase = await createClient();

  const { data: tours } = await supabase
    .from('tours')
    .select('category')
    .not('category', 'is', null);

  const categories = Array.from(
    new Set(tours?.map((t) => t.category).filter(Boolean) || [])
  );

  return categories;
}

export default async function ToursPage() {
  const tours = await getTours();
  const categories = await getCategories();

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

      {/* Tours Table */}
      <ToursTable tours={tours} categories={categories} />
    </div>
  );
}
