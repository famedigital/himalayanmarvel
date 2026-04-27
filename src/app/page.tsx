import Navigation from '@/components/Navigation';
import HeroLuxury from '@/components/HeroLuxury';
import { FounderHero } from '@/components/luxury/FounderHero';
import { TrustArchitectureElite } from '@/components/luxury/TrustArchitectureElite';
import { VideoTestimonials } from '@/components/luxury/VideoTestimonials';
import { FounderStoryCinematic } from '@/components/luxury/FounderStoryCinematic';
import { CinematicScrollSection } from '@/components/luxury/CinematicScrollSection';
import { ConciergeInquiryElite } from '@/components/luxury/ConciergeInquiryElite';
import DreamEscape from '@/components/DreamEscape';
import WhyTravelWithUs from '@/components/WhyTravelWithUs';
import TrustSection from '@/components/TrustSection';
import TrustBadges from '@/components/TrustBadges';
import SocialProof from '@/components/SocialProof';
import BentoGrid from '@/components/BentoGrid';
import JourneyCards from '@/components/JourneyCards';
import FAQ from '@/components/FAQ';
import BhutanJournal from '@/components/BhutanJournal';
import Footer from '@/components/Footer';
import WhatsAppConcierge from '@/components/WhatsAppConcierge';
import JsonLd from '@/components/seo/JsonLd';

/**
 * Homepage — Luxury transformation
 *
 * NEW FLOW (Optimized for luxury conversion):
 * 1. HeroLuxury — Single video, founder badge, exclusivity signaling
 * 2. FounderHero — Moved up (trust authority immediately after hero)
 * 3. TrustArchitectureElite — Government licenses, partnerships, press mentions
 * 4. DreamEscape — Emotional connection
 * 5. WhyTravelWithUs — Value proposition
 * 6. TrustSection & TrustBadges — Social proof
 * 7. SocialProof — Guest stories
 * 8. BentoGrid — Visual showcase
 * 9. JourneyCards — Editorial journey cards (replaced TourPackages)
 * 10. VideoTestimonials — Video testimonials with luxury player
 * 11. FounderStoryCinematic — Founder narrative with video background
 * 12. CinematicScrollSection — Signature WOW moment (scroll-based storytelling)
 * 13. FAQ — Address objections
 * 14. BhutanJournal — Content marketing
 * 15. ConciergeInquiryElite — Premium 3-field concierge form (replaced Contact)
 * 16. Footer — Site navigation
 * 17. WhatsAppConcierge — Floating CTA
 */

// Organization schema for homepage SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Himalayan Marvels',
  alternateName: 'Himalayan Marvels Bhutan',
  url: 'https://himalayanmarvel.vercel.app',
  logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png',
  description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists. Founded by ex-Ritz-Carlton leadership.',
  foundingDate: '2012',
  foundingLocation: 'Thimphu, Bhutan',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: '+975-77270465',
    email: 'info@himalayanmarvels.com',
    availableLanguage: ['English', 'Dzongkha'],
  },
  sameAs: [
    'https://www.instagram.com/himalayanmarvels.travel/',
    'https://www.facebook.com/himalayanmarvels',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Thimphu, Bhutan',
    addressCountry: 'BT',
  },
  areaServed: ['Bhutan', 'Nepal', 'Tibet'],
  knowsAbout: ['Luxury Travel', 'Private Tours', 'Cultural Tourism', 'Spiritual Journeys', 'Trekking Expeditions'],
};

export default function Home() {
  return (
    <main className="bg-alabaster dark:bg-dark-forest">
      {/* Organization Schema for homepage SEO */}
      <JsonLd data={organizationSchema} />
      <Navigation />
      <HeroLuxury />
      <FounderHero />
      <TrustArchitectureElite />
      <DreamEscape />
      <WhyTravelWithUs />
      <TrustSection />
      <TrustBadges />
      <SocialProof />
      <BentoGrid />
      <JourneyCards />
      <VideoTestimonials />
      <FounderStoryCinematic />
      <CinematicScrollSection />
      <FAQ />
      <BhutanJournal />
      <ConciergeInquiryElite />
      <Footer />
      <WhatsAppConcierge />
    </main>
  );
}
