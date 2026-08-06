import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FrontendContentManager from '@/components/admin/FrontendContentManager';

export default async function FrontendPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all frontend content from settings table
  const { data: frontendContent } = await supabase
    .from('settings')
    .select('*')
    .or(
      'key.eq.homepage_hero,key.eq.homepage_founder,key.eq.homepage_trust,key.eq.homepage_reviews,key.eq.homepage_bento,key.eq.homepage_journeys,key.eq.homepage_cinematic,key.eq.homepage_faq,key.eq.homepage_concierge_form,key.eq.about_page_story,key.eq.about_page_team,key.eq.about_page_credentials,key.eq.about_page_timeline,key.eq.concierge_page_hero,key.eq.concierge_page_process,key.eq.concierge_page_services,key.eq.concierge_page_form,key.eq.footer_content,key.eq.nav_content,key.eq.tours_page,key.eq.hero_slides,key.eq.tour_categories,key.eq.theme_tokens'
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-amber-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-amber-950/20">
      <div className="max-w-full mx-auto">
        <FrontendContentManager initialContent={frontendContent || []} />
      </div>
    </div>
  );
}
