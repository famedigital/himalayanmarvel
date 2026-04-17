import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import WhyTravelWithUs from '@/components/WhyTravelWithUs';
import InstagramFeed from '@/components/InstagramFeed';
import BrandMarquee from '@/components/BrandMarquee';
import TourPackages from '@/components/TourPackages';
import Founder from '@/components/Founder';
import FAQ from '@/components/FAQ';
import Reviews from '@/components/Reviews';
import BhutanJournal from '@/components/BhutanJournal';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-mineral-white dark:bg-bhutan-indigo">
      <Navigation />
      <Hero />
      <WhyTravelWithUs />
      <InstagramFeed />
      <BrandMarquee />
      <TourPackages />
      <Founder />
      <FAQ />
      <Reviews />
      <BhutanJournal />
      <Contact />
      <Footer />
    </main>
  );
}
