import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo';
import AboutContent from '@/components/AboutContent';

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: 'About Himalayan Marvels | Bhutan Luxury Travel Experts',
    description: 'Meet the team behind Bhutan\'s premier luxury travel concierge. Founded by Bivatsu Giri, ex-Ritz-Carlton leadership. 12+ years crafting private journeys in the Last Shangri-La.',
    canonical: '/about',
    type: 'website',
  });
}

export default function AboutPage() {
  return <AboutContent />;
}
