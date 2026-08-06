import Navigation from '@/components/Navigation';
import { getSetting } from '@/lib/cms/settings';
import type { NavContent } from '@/components/admin/frontend/NavigationEditor';

/** Server Navigation that loads CMS `nav_content` */
export default async function SiteNavigation() {
  const content = await getSetting<NavContent>('nav_content');
  return <Navigation content={content} />;
}
