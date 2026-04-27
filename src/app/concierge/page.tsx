import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo';
import ConciergeContent from '@/components/ConciergeContent';

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: 'Travel Concierge Service | Custom Bhutan Journeys by Himalayan Marvels',
    description: 'Experience anticipatory service with our luxury travel concierge. Custom Bhutan itineraries crafted around your vision. 4-hour response time, private consultations, and seamless journey planning.',
    canonical: '/concierge',
    type: 'website',
  });
}

export default function ConciergePage() {
  return <ConciergeContent />;
}
