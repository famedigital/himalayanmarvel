'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import RevealOnScroll from './ui/RevealOnScroll';
import JsonLd from './seo/JsonLd';

const faqs = [
  {
    question: 'Do I need a visa to visit Bhutan?',
    answer: 'Yes, all international tourists require a visa to enter Bhutan. We handle all visa processing as part of our tour packages. The visa is pre-processed and you will receive a clearance letter before travel.',
  },
  {
    question: 'What is the daily tariff in Bhutan?',
    answer: 'Bhutan has a Daily Sustainable Development Fee (SDF) of $100 per person per night for guests from countries other than India and Bangladesh. This fee covers your accommodation, meals, licensed tour guide, internal transportation, and camping equipment if needed.',
  },
  {
    question: 'When is the best time to visit Bhutan?',
    answer: 'The best times to visit are spring (March-May) and autumn (September-November). These seasons offer clear skies, pleasant temperatures, and vibrant festivals. The spring months bring blooming rhododendrons, while autumn offers stunning mountain views.',
  },
  {
    question: 'How do I reach Bhutan?',
    answer: 'You can fly to Paro International Airport via Drukair (Royal Bhutan Airlines) or Bhutan Airlines from several connecting cities including Bangkok, Singapore, Kathmandu, Delhi, and Kolkata. Alternatively, you can enter overland through Phuentsholing from India.',
  },
  {
    question: 'Can I customize my itinerary?',
    answer: 'Absolutely! All our tour packages can be tailored to your preferences. Whether you want to focus on cultural sites, trekking adventures, photography, or spiritual experiences, we create personalized itineraries that match your interests.',
  },
];

// Generate FAQ schema for SEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <section
      id="faq"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#0E140E' : '#F7F7F2' }}
    >
      {/* FAQ Schema for SEO */}
      <JsonLd data={faqSchema} />
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(0, 104, 56, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 104, 56, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container-premium relative z-10">
        {/* Header */}
        <RevealOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Questions
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-light"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Frequently{' '}
            <span className="gradient-text">Asked</span>
          </h2>
        </RevealOnScroll>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <RevealOnScroll key={index} delay={index * 0.06} className="mb-3">
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: isOpen
                      ? isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(255, 255, 255, 0.95)'
                      : isDark ? 'rgba(20, 28, 20, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                    border: isOpen
                      ? '1px solid rgba(212, 175, 55, 0.15)'
                      : '1px solid rgba(212, 175, 55, 0.06)',
                    boxShadow: isOpen
                      ? isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.04)'
                      : 'none',
                  }}
                >
                  {/* Question */}
                  <button
                    className="w-full py-6 px-6 md:px-8 flex items-center justify-between text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span
                      className="text-base md:text-lg pr-8 transition-all duration-500"
                      style={{
                        color: isOpen
                          ? isDark ? '#F7F7F2' : '#1A1A1A'
                          : isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)',
                        fontWeight: isOpen ? 500 : 400,
                      }}
                    >
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500"
                      style={{
                        backgroundColor: isOpen
                          ? isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.08)'
                          : isDark ? 'rgba(247, 247, 242, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <Plus
                        className="w-5 h-5"
                        style={{ color: isOpen ? '#D4AF37' : isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.3)' }}
                      />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.3, delay: 0.1 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 px-6 md:px-8">
                          <div
                            className="p-4 md:p-5 rounded-xl"
                            style={{
                              backgroundColor: isDark ? 'rgba(14, 20, 14, 0.6)' : 'rgba(247, 247, 242, 0.8)',
                              border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.06)'}`,
                            }}
                          >
                            <p
                              className="leading-relaxed text-sm md:text-base"
                              style={{ color: isDark ? 'rgba(247,247,242,0.65)' : 'rgba(26,26,26,0.6)' }}
                            >
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Contact CTA */}
        <RevealOnScroll delay={0.3} className="text-center mt-16">
          <p
            className="mb-6 text-sm"
            style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.35)' }}
          >
            Still have questions?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 104, 56, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm tracking-wide"
            style={{
              backgroundColor: '#006838',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.15)',
            }}
          >
            Contact our team
          </motion.a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
