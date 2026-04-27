import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import DreamEscape from '@/components/DreamEscape';
import WhyTravelWithUs from '@/components/WhyTravelWithUs';
import TrustSection from '@/components/TrustSection';
import TrustBadges from '@/components/TrustBadges';
import SocialProof from '@/components/SocialProof';
import BentoGrid from '@/components/BentoGrid';
import FounderDynamic from '@/components/FounderDynamic';
import FAQ from '@/components/FAQ';
import BhutanJournal from '@/components/BhutanJournal';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppConcierge from '@/components/WhatsAppConcierge';

export default function Home() {
  return (
    <main className="bg-alabaster dark:bg-dark-forest">
      <Navigation />
      <Hero />
      <DreamEscape />
      <WhyTravelWithUs />
      <TrustSection />
      <TrustBadges />
      <SocialProof />
      <BentoGrid />
      <FounderDynamic />
      <FAQ />
      <BhutanJournal />
      <Contact />
      <Footer />
      <WhatsAppConcierge />
    </main>
  );
}
