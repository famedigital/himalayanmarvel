import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import TourPackages from '@/components/TourPackages';
import Founder from '@/components/Founder';
import FAQ from '@/components/FAQ';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen dark:bg-black bg-white">
      <Navigation />
      <Hero />
      <BrandMarquee />
      <TourPackages />
      <Founder />
      <FAQ />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
