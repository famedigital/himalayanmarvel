import Navigation from '@/components/Navigation';
import HeroLuxury from '@/components/HeroLuxury';
import { FounderHero } from '@/components/luxury/FounderHero';
import DreamEscape from '@/components/DreamEscape';
import WhyTravelWithUs from '@/components/WhyTravelWithUs';
import TrustSection from '@/components/TrustSection';
import TrustBadges from '@/components/TrustBadges';
import SocialProof from '@/components/SocialProof';
import BentoGrid from '@/components/BentoGrid';
import JourneyCards from '@/components/JourneyCards';
import FAQ from '@/components/FAQ';
import BhutanJournal from '@/components/BhutanJournal';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppConcierge from '@/components/WhatsAppConcierge';

/**
 * Homepage — Luxury transformation
 *
 * NEW FLOW (Optimized for luxury conversion):
 * 1. HeroLuxury — Single video, founder badge, exclusivity signaling
 * 2. FounderHero — Moved up (trust authority immediately after hero)
 * 3. JourneyCards — Replaced TourPackages with editorial cards
 * 4. [Rest of sections remain, will be enhanced in future phases]
 */
export default function Home() {
  return (
    <main className="bg-alabaster dark:bg-dark-forest">
      <Navigation />
      <HeroLuxury />
      <FounderHero />
      <DreamEscape />
      <WhyTravelWithUs />
      <TrustSection />
      <TrustBadges />
      <SocialProof />
      <BentoGrid />
      <JourneyCards />
      <FAQ />
      <BhutanJournal />
      <Contact />
      <Footer />
      <WhatsAppConcierge />
    </main>
  );
}
