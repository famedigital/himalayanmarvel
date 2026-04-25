import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TourCategoriesManager from '@/components/admin/TourCategoriesManager';

export default async function TourCategoriesPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch current tour categories from settings
  const { data: categorySettings } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'tour_categories')
    .single();

  const categories = categorySettings?.value || [];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tour Categories</h1>
          <p className="text-gray-900/50 dark:text-gray-400 mt-2">Manage homepage tour category cards</p>
        </div>

        <TourCategoriesManager initialCategories={categories} />
      </div>
    </div>
  );
}
