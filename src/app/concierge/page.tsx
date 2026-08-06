import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo';
import ConciergeContent from '@/components/ConciergeContent';
import { getSettingsMap } from '@/lib/cms/settings';
import type { FooterContent } from '@/components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: 'Travel Concierge Service | Custom Bhutan Journeys by Himalayan Marvels',
    description:
      'Experience anticipatory service with our luxury travel concierge. Custom Bhutan itineraries crafted around your vision. 4-hour response time, private consultations, and seamless journey planning.',
    canonical: '/concierge',
    type: 'website',
  });
}

export default async function ConciergePage() {
  const settings = await getSettingsMap(['concierge_page_hero', 'footer_content']);

  return (
    <ConciergeContent
      hero={
        settings.concierge_page_hero as
          | { title?: string; subtitle?: string; image?: string }
          | null
      }
      footerContent={settings.footer_content as FooterContent | null}
    />
  );
}
