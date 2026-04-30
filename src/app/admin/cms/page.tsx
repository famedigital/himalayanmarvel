import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CmsAdminPanel from '@/components/admin/cms/CmsAdminPanel';

export default async function CmsAdminPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all CMS pages
  const { data: pages, error: pagesError } = await supabase
    .from('cms_pages')
    .select('*')
    .order('order_index', { ascending: true });

  if (pagesError) {
    console.error('Error fetching CMS pages:', pagesError);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Frontend CMS
          </h1>
          <p className="text-gray-900/50 dark:text-gray-400 mt-2">
            Edit all public website content
          </p>
        </div>

        <CmsAdminPanel initialPages={pages || []} />
      </div>
    </div>
  );
}
