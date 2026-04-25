import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import WhyTravelWithUs from '@/components/WhyTravelWithUs';
import SocialProof from '@/components/SocialProof';
import TourPackages from '@/components/TourPackages';
import FounderDynamic from '@/components/FounderDynamic';
import FAQ from '@/components/FAQ';
import BhutanJournal from '@/components/BhutanJournal';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-mineral-white dark:bg-bhutan-indigo">
      <Navigation />
      <Hero />
      <WhyTravelWithUs />
      <SocialProof />
      <TourPackages />
      <FounderDynamic />
      <FAQ />
      <BhutanJournal />
      <Contact />
      <Footer />
    </main>
  );
}
