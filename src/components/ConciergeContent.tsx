'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import JsonLd from '@/components/seo/JsonLd';
import { getYearsOfServiceString } from '@/lib/utils/years-of-service';

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

export default function ConciergeContent() {
  // Auto-calculate years of service
  const yearsOfService = getYearsOfServiceString();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/concierge-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-alabaster dark:bg-dark-forest">
      <JsonLd data={serviceSchema} />
      <Navigation />

      {/* Premium Hero Section with Cinematic Image */}
      <section className="relative min-h-screen bg-dark-forest overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dxztrqjft/image/upload/w_1920,h_1080,c_fill,q_80/v1776291879/tiger-nest-close_rm2bee"
            alt="Bhutan landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-20 py-32">
          <div className="max-w-5xl">
            <RevealOnScroll>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-champagne-gold text-sm tracking-[0.3em] uppercase mb-6">
                  Bespoke Service
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-none">
                  Your Private<br />
                  <em className="text-champagne-gold">Concierge</em>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl mb-12">
                  Experience the luxury of having every detail curated by insiders who've spent {yearsOfService} years crafting journeys in the Last Shangri-La.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href="#inquiry"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 bg-champagne-gold text-dark-forest rounded-full font-medium text-center hover:bg-amber-400 transition-colors"
                  >
                    Start Planning Your Journey
                  </motion.a>
                  <motion.a
                    href="https://wa.me/97577270465"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 border-2 border-champagne-gold text-champagne-gold rounded-full font-medium text-center hover:bg-champagne-gold/10 transition-colors"
                  >
                    WhatsApp Concierge
                  </motion.a>
                </div>
              </motion.div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-20 rounded-full bg-champagne-gold/40"
          />
        </motion.div>
      </section>

      {/* Process Timeline - Sleek Apple Style */}
      <section className="py-12 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-champagne-gold text-xs tracking-[0.25em] uppercase font-medium mb-3">
                  The Process
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                  How We Craft Your Journey
                </h2>
              </motion.div>
            </div>

            {/* Process Steps - Clean Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  step: '01',
                  title: 'Share Your Vision',
                  description: 'Tell us what calls to you — spiritual retreat, cultural immersion, or adventure'
                },
                {
                  step: '02',
                  title: 'Consultation',
                  description: 'Our concierge calls to understand your preferences and pace'
                },
                {
                  step: '03',
                  title: 'Custom Design',
                  description: 'We craft your detailed day-by-day journey with curated experiences'
                },
                {
                  step: '04',
                  title: 'Experience',
                  description: 'Arrive in Bhutan and live your privately crafted journey'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute top-6 right-6 text-4xl font-semibold text-white/20 group-hover:text-neutral-900/20 transition-colors">
                      {item.step}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neutral-900 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-600 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
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
                  {yearsOfService} years of relationships mean we can open doors others can't. Private
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

      {/* Example Journeys */}
      <section className="py-16 px-4 bg-white dark:bg-dark-forest">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
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
                <div className="relative h-48">
                  <Image
                    src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee"
                    alt="Buddhist monastery"
                    fill
                    className="object-cover"
                  />
                </div>
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
                <div className="relative h-48">
                  <Image
                    src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler"
                    alt="Scenic Bhutan landscape"
                    fill
                    className="object-cover"
                  />
                </div>
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
                <div className="relative h-48">
                  <Image
                    src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41"
                    alt="Bhutan scenic view"
                    fill
                    className="object-cover"
                  />
                </div>
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
      <section className="py-16 px-4 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
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
      <section id="inquiry" className="py-16 px-4 bg-dark-forest">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Share your vision with our concierge. We'll craft something extraordinary.
            </p>

            {/* Social Proof Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-champagne-gold">★★★★★</span>
                <span className="text-white text-sm font-medium">4.9 rating</span>
                <span className="text-gray-400 text-sm">from 150+ travelers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-champagne-gold">✓</span>
                <span className="text-white text-sm font-medium">Licensed & Insured</span>
                <span className="text-gray-400 text-sm">#20753</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-champagne-gold">⏱</span>
                <span className="text-white text-sm font-medium">4-hour response time</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-dark-forest dark:text-alabaster mb-6">
                Tell Us About Your Trip
              </h3>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-3xl text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <h4 className="text-xl font-medium text-dark-forest dark:text-alabaster mb-2">
                    Thank You!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your inquiry has been received. Our concierge will contact you within 4 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 border border-champagne-gold text-champagne-gold rounded-lg hover:bg-champagne-gold/10 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-dark-forest dark:text-alabaster placeholder:text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-dark-forest dark:text-alabaster placeholder:text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-dark-forest dark:text-alabaster placeholder:text-gray-400"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your dream Bhutan journey..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-dark-forest dark:text-alabaster placeholder:text-gray-400 resize-none"
                  />

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-champagne-gold text-dark-forest rounded-lg font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Speak With Our Travel Concierge'}
                  </button>
                </form>
              )}

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
      <Footer />
    </main>
  );
}
