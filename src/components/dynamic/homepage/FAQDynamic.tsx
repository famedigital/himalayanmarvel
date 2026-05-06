'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import JsonLd from '@/components/seo/JsonLd';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQDynamicProps {
  content: {
    items?: FAQItem[];
    sectionTitle?: string;
  };
}

export function FAQDynamic({ content }: FAQDynamicProps) {
  const { items = [], sectionTitle = 'Frequently Asked Questions' } = content;
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate FAQ schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Individual FAQ Item
  function FAQItemDynamic({
    faq,
    index,
  }: {
    faq: FAQItem;
    index: number;
  }) {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isOpen = openIndex === index;

    return (
      <RevealOnScroll key={index} delay={index * 0.06} className="mb-4">
        <motion.div
          ref={itemRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onHoverStart={() => {
            setIsHovered(true);
            if (!isOpen) setOpenIndex(index);
          }}
          onHoverEnd={() => {
            setIsHovered(false);
          }}
          onClick={() => setOpenIndex(isOpen ? null : index)}
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
                    ? isHovered || isOpen ? '#F7F7F2' : 'rgba(247,247,242,0.7)'
                    : isHovered || isOpen ? '#1A1A1A' : 'rgba(26,26,26,0.7)',
                  fontWeight: isHovered || isOpen ? 500 : 400,
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
                  backgroundColor: isHovered || isOpen
                    ? isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.1)'
                    : isDark ? 'rgba(247, 247, 242, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                }}
              >
                <Plus
                  className="w-5 h-5"
                  style={{
                    color: isHovered || isOpen ? '#D4AF37' : isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.3)',
                  }}
                />
              </motion.div>
            </div>

            {/* Answer - Expandable */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </RevealOnScroll>
    );
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <section className="py-20 bg-alabaster dark:bg-dark-forest">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              {sectionTitle}
            </h2>
            {items.map((faq, index) => (
              <FAQItemDynamic key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
