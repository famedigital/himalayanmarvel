'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import JsonLd from '@/components/seo/JsonLd';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Himalayan Marvels',
  alternateName: 'Himalayan Marvels Bhutan',
  url: 'https://himalayanmarvel.vercel.app',
  logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png',
  description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists. Founded by ex-Ritz-Carlton leadership.',
  foundingDate: '2014',
  foundingLocation: 'Thimphu, Bhutan',
  founder: {
    '@type': 'Person',
    name: 'Bivatsu Giri',
    jobTitle: 'Founder & CEO',
    alumniOf: ['Les Roches Spain', 'International College of Hotel Management, Australia', 'University of Canberra'],
    knowsAbout: ['Luxury Hospitality', 'Travel Management', 'Bhutan Tourism'],
  },
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
    streetAddress: 'Changbangdu',
    addressLocality: 'Thimphu',
    postalCode: '11001',
    addressCountry: 'BT',
  },
  areaServed: ['Bhutan', 'Nepal', 'Tibet'],
};

export default function AboutContent() {
  return (
    <main className="min-h-screen bg-alabaster dark:bg-dark-forest">
      <JsonLd data={organizationSchema} />
      <Navigation />

      {/* Editorial Opening - No Hero */}
      <section className="relative min-h-screen bg-dark-forest">
        {/* Full-screen founder photo as background */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dxztrqjft/image/upload/w_1200,h_800,c_fill/v1776275660/founder-portrait_pbo8m4.jpg"
            alt="Bivatsu Giri - Founder"
            fill
            className="object-cover object-top opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-forest/80 via-dark-forest/60 to-dark-forest" />
        </div>

        {/* Editorial typography overlay */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-20 py-32">
          <div className="max-w-4xl">
            <RevealOnScroll>
              {/* Drop cap style intro */}
              <p className="text-champagne-gold text-sm tracking-[0.3em] uppercase mb-6">
                The Story
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-none">
                The Man Who Left<br />
                <em className="text-champagne-gold">Ritz-Carlton</em><br />
                For Bhutan
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl">
                In 2014, Bivatsu Giri made a decision that puzzled his colleagues
                at the world's finest hotels. He walked away from luxury hospitality
                to build something different in the Himalayan Kingdom.
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <span className="text-white/60 text-sm uppercase tracking-wider">Scroll to read</span>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">Since 2014</p>
                <h2 className="text-4xl font-light mb-6 text-dark-forest dark:text-alabaster">
                  Our Philosophy: High-Value, Low-Volume
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Established in 2014 and fully registered with the Department of Tourism in Bhutan,
                  we have spent over a decade perfecting the art of the private tour.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  We believe that luxury and sustainability are two sides of the same coin.
                  By charging the Sustainable Development Fee (SDF), we contribute directly to
                  Bhutan's carbon-negative status and free healthcare/education systems.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  When you travel with us, your luxury is a force for global good.
                </p>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dxztrqjft/image/upload/w_800,h_600,c_fill/v1776291879/tiger-nest-close_rm2bee"
                  alt="Taktsang Palphug Monastery (Tiger's Nest)"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Why Bhutan? Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-alabaster dark:from-dark-forest dark:to-black">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-6">
                  Why Bhutan?
                </p>
                <h2 className="text-4xl md:text-5xl font-serif text-dark-forest dark:text-alabaster mb-8 leading-tight">
                  A Kingdom That Measures<br />
                  <em className="text-champagne-gold">Gross National Happiness</em>
                </h2>
              </div>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  In a world obsessed with GDP, Bhutan measures GNH — Gross National Happiness.
                  It's the only carbon-negative country on Earth. Where traffic lights don't exist,
                  but monks meditating in caves do.
                </p>
                <p>
                  This is where Bivatsu chose to build Himalayan Marvels. Not in Geneva, not
                  in Dubai — but in the Last Shangri-La, where every journey contributes to
                  a nation's vision of mindful development.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden order-2 md:order-1 bg-gradient-to-br from-champagne-gold/20 to-dark-forest">
                <Image
                  src="/founder-bivatsu.jpg"
                  alt="Bivatsu Giri - Founder & CEO"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
                  Founder & CEO
                </p>
                <h2 className="text-4xl font-light mb-3 text-dark-forest dark:text-alabaster">
                  Bivatsu <span className="italic font-serif">Giri</span>
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                  Global Hospitality Expert. Bhutanese Heart.
                </p>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Trust is the most important luxury. Himalayan Marvels was founded by
                    Bivatsu Giri, a hospitality visionary whose professional DNA was forged
                    in the world's most demanding luxury environments.
                  </p>
                  <p>
                    After elite training at <strong>Les Roches, Spain</strong> and the
                    <strong>International College of Hotel Management, Australia</strong>,
                    Bivatsu honed his craft within the leadership circles of global icons:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Ritz-Carlton</li>
                    <li>Hyatt</li>
                    <li>Kempinski</li>
                  </ul>
                  <p>
                    This background means that our service standards aren't just local;
                    they are world-class. When we promise "Bespoke," we mean the anticipatory
                    service of a five-star concierge applied to the rugged, spiritual landscape
                    of the Himalayas.
                  </p>
                  <p>
                    With an MBA from the <strong>University of Canberra</strong> and over
                    12 years of specialized experience, Bivatsu ensures that every itinerary
                    is a masterpiece of logistics and luxury.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-champagne-gold/10 rounded-lg border border-champagne-gold/20">
                    <p className="text-xs text-champagne-gold uppercase tracking-wider">Experience</p>
                    <p className="text-2xl font-light text-dark-forest dark:text-alabaster">12+ Years</p>
                  </div>
                  <div className="px-4 py-2 bg-champagne-gold/10 rounded-lg border border-champagne-gold/20">
                    <p className="text-xs text-champagne-gold uppercase tracking-wider">Guests Hosted</p>
                    <p className="text-2xl font-light text-dark-forest dark:text-alabaster">2,500+</p>
                  </div>
                  <div className="px-4 py-2 bg-champagne-gold/10 rounded-lg border border-champagne-gold/20">
                    <p className="text-xs text-champagne-gold uppercase tracking-wider">Rating</p>
                    <p className="text-2xl font-light text-dark-forest dark:text-alabaster">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
                The Marvels Team
              </p>
              <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-4">
                Meet Your Bhutanese Family
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our guides are more than just escorts. They are cultural ambassadors
                who have been hand-selected for their storytelling ability and their
                commitment to guest safety.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-alabaster dark:bg-black rounded-2xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne-gold to-amber-600 flex items-center justify-center">
                  <span className="text-4xl text-white font-light">PT</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-2">
                  Pema Tenzin
                </h3>
                <p className="text-champagne-gold text-sm uppercase tracking-wider mb-4">
                  Senior Guide
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  15+ years guiding experience. Specialist in Buddhist philosophy and
                  monastery traditions. Speaks fluent English, Dzongkha, and Tibetan.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-alabaster dark:bg-black rounded-2xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne-gold to-amber-600 flex items-center justify-center">
                  <span className="text-4xl text-white font-light">SN</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-2">
                  Sonam Norbu
                </h3>
                <p className="text-champagne-gold text-sm uppercase tracking-wider mb-4">
                  Cultural Ambassador
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Expert in Bhutanese festivals and masked dance traditions. Known for
                  his storytelling and deep knowledge of local folklore.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-alabaster dark:bg-black rounded-2xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne-gold to-amber-600 flex items-center justify-center">
                  <span className="text-4xl text-white font-light">SG</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-2">
                  Sagar Gurung
                </h3>
                <p className="text-champagne-gold text-sm uppercase tracking-wider mb-4">
                  Operations Manager
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Ensures every journey runs with Swiss precision. From airport transfers
                  to remote trek logistics, no detail is overlooked.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
              Licensed & Certified
            </p>
            <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-8">
              Official Credentials
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white dark:bg-black rounded-xl p-6 border border-champagne-gold/10">
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Tourism Council of Bhutan
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Licensed Tour Operator #20753
                </p>
              </div>

              <div className="bg-white dark:bg-black rounded-xl p-6 border border-champagne-gold/10">
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  ABTO Member
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Association of Bhutanese Tour Operators
                </p>
              </div>

              <div className="bg-white dark:bg-black rounded-xl p-6 border border-champagne-gold/10">
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Fully Insured
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive travel and medical insurance coverage
                </p>
              </div>

              <div className="bg-white dark:bg-black rounded-xl p-6 border border-champagne-gold/10">
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Carbon Negative Partner
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Contributing to Bhutan's carbon-negative vision
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-dark-forest">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Experience Bhutan Differently?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let our team craft your private journey to the Last Shangri-La.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/concierge"
                className="px-8 py-4 bg-champagne-gold text-dark-forest rounded-lg font-medium hover:bg-amber-400 transition-colors"
              >
                Speak With Our Concierge
              </Link>
              <Link
                href="https://wa.me/97577270465"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-champagne-gold text-champagne-gold rounded-lg font-medium hover:bg-champagne-gold/10 transition-colors"
              >
                WhatsApp Us
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      <Footer />
    </main>
  );
}
