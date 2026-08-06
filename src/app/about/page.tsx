import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo';
import AboutContent from '@/components/AboutContent';
import { getSettingsMap } from '@/lib/cms/settings';
import type { FooterContent } from '@/components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const yearsOfService = currentYear - 2013 + '+';

  return generateSeoMetadata({
    title: 'About Himalayan Marvels | Bhutan Luxury Travel Experts',
    description: `Meet the team behind Bhutan's premier luxury travel concierge. Founded by Bivatsu Giri, ex-Ritz-Carlton leadership. ${yearsOfService} years crafting private journeys in the Last Shangri-La.`,
    canonical: '/about',
    type: 'website',
  });
}

export default async function AboutPage() {
  const settings = await getSettingsMap([
    'about_page_story',
    'footer_content',
  ]);

  return (
    <AboutContent
      story={settings.about_page_story as { title?: string; content?: string; portraitImage?: string } | null}
      footerContent={settings.footer_content as FooterContent | null}
    />
  );
}
