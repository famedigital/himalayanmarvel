import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HeroManager from '@/components/admin/HeroManager';

export default async function HeroPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch current hero slides from settings
  const { data: heroSettings } = await supabase
    .from('settings')
    .select('id, value')
    .eq('key', 'hero_slides')
    .single();

  const slides = heroSettings?.value || [];
  const settingId = heroSettings?.id || null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Hero Slider</h1>
          <p className="text-gray-900/50 dark:text-gray-400 mt-2">Manage homepage hero images and videos</p>
        </div>

        <HeroManager initialSlides={slides} initialSettingId={settingId} />
      </div>
    </div>
  );
}
