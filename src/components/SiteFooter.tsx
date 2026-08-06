import { createClient } from '@/lib/supabase/server';
import Footer, { type FooterContent } from '@/components/Footer';
import { getSetting } from '@/lib/cms/settings';

/** Server Footer that loads CMS `footer_content` with design fallbacks */
export default async function SiteFooter() {
  const content = await getSetting<FooterContent>('footer_content');
  return <Footer content={content} />;
}

/** Optional: prefetch helper if a page already has supabase */
export async function loadFooterContent() {
  return getSetting<FooterContent>('footer_content');
}

export async function requireAdminSession() {
  const supabase = await createClient();
  return supabase.auth.getSession();
}
