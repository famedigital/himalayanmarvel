'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

// Individual FAQ Item with hover-to-expand
function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
  isDark,
}: {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: (index: number | null) => void;
  isDark: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RevealOnScroll key={index} delay={index * 0.06} className="mb-4">
      <motion.div
        ref={itemRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onHoverStart={() => {
          setIsHovered(true);
          if (!isOpen) onToggle(index);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
        }}
        onClick={() => onToggle(isOpen ? null : index)}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          backgroundColor: isDark
            ? 'rgba(20, 28, 20, 0.6)'
            : 'rgba(255, 255, 255, 0.7)',
          border: '1px solid transparent',
        }}
      >
        {/* Animated gradient border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
          animate={{
            opacity: isHovered || isOpen ? 1 : 0,
          }}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(0, 104, 56, 0.2) 50%, rgba(212, 175, 55, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(0, 104, 56, 0.2) 0%, rgba(212, 175, 55, 0.15) 50%, rgba(0, 104, 56, 0.2) 100%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Inner content */}
        <div className="relative z-10">
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{
              opacity: isHovered || isOpen ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: isDark
                ? 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15), transparent 70%)'
                : 'radial-gradient(circle at center, rgba(0, 104, 56, 0.1), transparent 70%)',
            }}
          />

          {/* Question */}
          <div className="py-6 px-6 md:px-8 flex items-center justify-between">
            <motion.span
              className="text-base md:text-lg pr-8"
              animate={{
                color: isDark
                  ? (isHovered || isOpen) ? '#F7F7F2' : 'rgba(247,247,242,0.7)'
                  : (isHovered || isOpen) ? '#1A1A1A' : 'rgba(26,26,26,0.7)',
                fontWeight: (isHovered || isOpen) ? 500 : 400,
              }}
              transition={{ duration: 0.3 }}
            >
              {faq.question}
            </motion.span>

            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: (isHovered || isOpen)
                  ? isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.1)'
                  : isDark ? 'rgba(247, 247, 242, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <Plus
                className="w-5 h-5"
                style={{
                  color: (isHovered || isOpen) ? '#D4AF37' : isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.3)',
                }}
              />
            </motion.div>
          </div>

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
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="p-5 rounded-xl"
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(14, 20, 14, 0.8)'
                        : 'rgba(247, 247, 242, 0.9)',
                      border: `1px solid ${
                        isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)'
                      }`,
                    }}
                  >
                    <p
                      className="leading-relaxed text-sm md:text-base"
                      style={{ color: isDark ? 'rgba(247,247,242,0.7)' : 'rgba(26,26,26,0.7)' }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}

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
      className="section-padding relative overflow-hidden py-24 px-4"
      style={{ backgroundColor: isDark ? '#0E140E' : '#F7F7F2' }}
    >
      {/* FAQ Schema for SEO */}
      <JsonLd data={faqSchema} />

      {/* Ambient animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 104, 56, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(0, 104, 56, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <RevealOnScroll className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="h-px rounded-full"
                style={{ backgroundColor: '#D4AF37' }}
              />
              <span
                className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
                style={{ color: '#D4AF37' }}
              >
                Questions
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="h-px rounded-full"
                style={{ backgroundColor: '#D4AF37' }}
              />
            </div>
            <h2
              className="text-4xl md:text-5xl font-light"
              style={{
                color: isDark ? '#F7F7F2' : '#1A1A1A',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              Frequently{' '}
              <span
                className="gradient-text"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #006838 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Asked
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-sm"
              style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
            >
              Hover over any question to reveal the answer
            </motion.p>
          </motion.div>
        </RevealOnScroll>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={setOpenIndex}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <RevealOnScroll delay={0.3} className="text-center mt-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm"
            style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.35)' }}
          >
            Still have questions?
          </motion.p>
          <motion.a
            href="/concierge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300"
            style={{
              backgroundColor: '#006838',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            Contact our team
          </motion.a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
