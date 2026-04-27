import { Metadata } from 'next';
import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Travel Concierge Service | Custom Bhutan Journeys by Himalayan Marvels',
  description: 'Experience anticipatory service with our luxury travel concierge. Custom Bhutan itineraries crafted around your vision. 4-hour response time, private consultations, and seamless journey planning.',
  keywords: ['Bhutan travel concierge', 'custom Bhutan tours', 'private journey planning', 'luxury travel service Bhutan', 'Bhutan itinerary design'],
  openGraph: {
    title: 'Travel Concierge Service | Custom Bhutan Journeys',
    description: 'Experience anticipatory service with our luxury travel concierge. Custom Bhutan itineraries crafted around your vision.',
    url: 'https://himalayanmarvel.vercel.app/concierge',
    siteName: 'Himalayan Marvels',
    type: 'website',
  },
};

// Service Schema for Concierge page
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Himalayan Marvels Concierge Service',
  description: 'Luxury travel concierge service for custom Bhutan journeys. Private consultations, custom itinerary design, and anticipatory service throughout your journey.',
  url: 'https://himalayanmarvel.vercel.app/concierge',
  telephone: '+975-77270465',
  email: 'info@himalayanmarvels.com',
  areaServed: {
    '@type': 'Country',
    name: 'Bhutan',
  },
  priceRange: '$$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150',
  },
};

export default function ConciergePage() {
  return (
    <main className="min-h-screen bg-alabaster dark:bg-dark-forest">
      <JsonLd data={serviceSchema} />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-forest via-dark-forest to-black">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dxztrqjft/image/upload/w_1200,h_800,c_fill/v1776291877/dochula_r3uler')] bg-cover bg-center opacity-20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealOnScroll>
            <p className="text-champagne-gold text-sm tracking-[0.3em] uppercase mb-4">
              Concierge Service
            </p>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6">
              Your Vision.<br />Our Expertise.
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tell us about your dream journey to Bhutan, and we'll craft a
              private experience tailored exclusively for you.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
                Not Your Typical Travel Agency
              </p>
              <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-4">
                What Makes Our Concierge Different
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We don't book packages. We design journeys.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-alabaster dark:bg-black rounded-2xl p-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                  <span className="text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-3">
                  Anticipatory Service
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Trained in Ritz-Carlton hospitality, we don't just respond to requests—
                  we anticipate needs. From your dietary preferences to your ideal daily pace,
                  we plan before you ask.
                </p>
              </div>

              <div className="bg-alabaster dark:bg-black rounded-2xl p-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                  <span className="text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-3">
                  Private, Not Group
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every journey we design is exclusively yours. No stranger groups. No
                  fixed schedules. Your private guide, your private vehicle, your Bhutan.
                </p>
              </div>

              <div className="bg-alabaster dark:bg-black rounded-2xl p-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                  <span className="text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-3">
                  Inside Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  12+ years of relationships mean we can open doors others can't. Private
                  audiences with high lamas, exclusive festival viewing, hidden monastery visits.
                </p>
              </div>

              <div className="bg-alabaster dark:bg-black rounded-2xl p-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                  <span className="text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-light text-dark-forest dark:text-alabaster mb-3">
                  Rapid Response
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your time is valuable. We respond to all inquiries within 4 hours during
                  business hours. Urgent matters? Reach us directly via WhatsApp.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
                The Process
              </p>
              <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-4">
                How We Craft Your Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Four simple steps to your private Bhutan experience
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-gold text-dark-forest flex items-center justify-center text-2xl font-light">
                  1
                </div>
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Share Your Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Tell us what calls to you—spiritual retreat, cultural immersion, or
                  Himalayan adventure. No detail too small.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-gold text-dark-forest flex items-center justify-center text-2xl font-light">
                  2
                </div>
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Our concierge schedules a call to understand your preferences, pace, and
                  any special requirements.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-gold text-dark-forest flex items-center justify-center text-2xl font-light">
                  3
                </div>
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Custom Itinerary
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We design a detailed day-by-day journey with accommodations, experiences,
                  and logistics—all curated for you.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-gold text-dark-forest flex items-center justify-center text-2xl font-light">
                  4
                </div>
                <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-2">
                  Journey of a Lifetime
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Arrive in Bhutan and experience your private journey. Our team supports
                  you every step of the way.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Example Journeys */}
      <section className="py-24 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-champagne-gold text-sm tracking-[0.2em] uppercase mb-4">
                Custom Journeys We've Crafted
              </p>
              <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-4">
                Recent Private Experiences
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Real journeys designed for real travelers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-alabaster dark:bg-black rounded-2xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-amber-600 to-champagne-gold" />
                <div className="p-6">
                  <p className="text-champagne-gold text-xs uppercase tracking-wider mb-2">
                    Spiritual Journey
                  </p>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-3">
                    12-Day Buddhist Philosophy Retreat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    For a philosophy professor from California. Included private sessions
                    with high lamas, meditation cave visits, and astrology readings.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    October 2024 • Solo traveler
                  </p>
                </div>
              </div>

              <div className="bg-alabaster dark:bg-black rounded-2xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald-600 to-teal-500" />
                <div className="p-6">
                  <p className="text-champagne-gold text-xs uppercase tracking-wider mb-2">
                    Family Journey
                  </p>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-3">
                    10-Day Multi-Generational Trip
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    For a family of four (ages 8-76). Balanced cultural activities with
                    gentle pacing, kid-friendly experiences, and luxury accommodations.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    August 2024 • Family of 4
                  </p>
                </div>
              </div>

              <div className="bg-alabaster dark:bg-black rounded-2xl overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-600 to-indigo-500" />
                <div className="p-6">
                  <p className="text-champagne-gold text-xs uppercase tracking-wider mb-2">
                    Celebration Journey
                  </p>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-3">
                    8-Day Honeymoon in Paradise
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    For a couple from London. Included hot stone baths for two, private
                    picnics in valleys, and boutique luxury lodges.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    September 2024 • Couple
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Service Guarantee */}
      <section className="py-24 px-4 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-dark-forest dark:text-alabaster mb-4">
                Our Service Guarantee
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 rounded-full bg-champagne-gold flex-shrink-0 flex items-center justify-center">
                  <span className="text-dark-forest text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-1">
                    4-Hour Response Time
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All inquiries answered within 4 hours during business days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 rounded-full bg-champagne-gold flex-shrink-0 flex items-center justify-center">
                  <span className="text-dark-forest text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-1">
                    Licensed & Insured
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fully registered with Tourism Council of Bhutan (#20753) and comprehensively insured
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 rounded-full bg-champagne-gold flex-shrink-0 flex items-center justify-center">
                  <span className="text-dark-forest text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-1">
                    Transparent Pricing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    No hidden fees. All costs detailed upfront. SDF contribution clearly stated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 rounded-full bg-champagne-gold flex-shrink-0 flex items-center justify-center">
                  <span className="text-dark-forest text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-1">
                    24/7 Journey Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    From touchdown to departure, our team is available around the clock
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 mt-1 rounded-full bg-champagne-gold flex-shrink-0 flex items-center justify-center">
                  <span className="text-dark-forest text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-dark-forest dark:text-alabaster mb-1">
                    Satisfaction Commitment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We work with you until your itinerary is perfect. No pressure to book.
                  </p>
                </div>
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
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Share your vision with our concierge. We'll craft something extraordinary.
            </p>

            <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-dark-forest dark:text-alabaster mb-6">
                Tell Us About Your Trip
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                />
                <textarea
                  placeholder="Tell us about your dream Bhutan journey..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-champagne-gold text-dark-forest rounded-lg font-medium hover:bg-amber-400 transition-colors"
                >
                  Speak With Our Travel Concierge
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Typically responds within 4 hours • Your information is held in strict confidence
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/97577270465"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-champagne-gold text-champagne-gold rounded-lg hover:bg-champagne-gold/10 transition-colors"
              >
                WhatsApp: +975 77270465
              </Link>
              <a
                href="tel:+97577270465"
                className="px-6 py-3 border border-champagne-gold text-champagne-gold rounded-lg hover:bg-champagne-gold/10 transition-colors"
              >
                Call Us Directly
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
