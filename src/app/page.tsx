import Navigation from '@/components/Navigation';
import HeroLuxury from '@/components/HeroLuxury';
import { FounderHero } from '@/components/luxury/FounderHero';
import { TrustArchitectureElite } from '@/components/luxury/TrustArchitectureElite';
import { CinematicScrollSection } from '@/components/luxury/CinematicScrollSection';
import { ConciergeInquiryElite } from '@/components/luxury/ConciergeInquiryElite';
import JourneyCards from '@/components/JourneyCards';
import FAQ from '@/components/FAQ';
import { TripAdvisorVerified } from '@/components/TripAdvisorVerified';
import Footer from '@/components/Footer';
import WhatsAppConcierge from '@/components/WhatsAppConcierge';
import JsonLd from '@/components/seo/JsonLd';

/**
 * Homepage — Luxury transformation (CURATED TO 8 SECTIONS)
 *
 * OPTIMIZED FLOW (Less is more for luxury):
 * 1. HeroLuxury — Single video, founder badge, exclusivity signaling
 * 2. FounderHero — Trust authority immediately after hero
 * 3. TrustArchitectureElite — Government licenses, partnerships, press mentions
 * 4. JourneyCards — Editorial journey cards (the core offering)
 * 5. CinematicScrollSection — Signature WOW moment (scroll-based storytelling)
 * 6. FAQ — Address objections
 * 7. ConciergeInquiryElite — Premium 3-field concierge form
 * 8. Footer — Site navigation
 * 9. WhatsAppConcierge — Floating CTA
 *
 * REMOVED (redundant/duplicate):
 * - DreamEscape, WhyTravelWithUs (covered in hero)
 * - TrustSection, TrustBadges (duplicate of TrustArchitectureElite)
 * - SocialProof (duplicate reviews)
 * - BentoGrid (visual showcase, not essential)
 * - VideoTestimonials, FounderStoryCinematic (duplicate founder content)
 * - BhutanJournal (can be accessed via nav)
 */

// Organization schema for homepage SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Himalayan Marvels',
  alternateName: 'Himalayan Marvels Bhutan',
  url: 'https://himalayanmarvel.vercel.app',
  logo: '/logo/HMT-Logo.png',
  description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists. Founded by ex-Ritz-Carlton leadership.',
  foundingDate: '2014',
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
      <TripAdvisorVerified />
      <JourneyCards />
      <CinematicScrollSection />
      <FAQ />
      <ConciergeInquiryElite />
      <Footer />
      <WhatsAppConcierge />
    </main>
  );
}
