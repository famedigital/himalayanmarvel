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
    .select('value')
    .eq('key', 'hero_slides')
    .single();

  const slides = heroSettings?.value || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hero Slider</h1>
          <p className="text-gray-900/50 mt-2">Manage homepage hero images and videos</p>
        </div>

        <HeroManager initialSlides={slides} />
      </div>
    </div>
  );
}
