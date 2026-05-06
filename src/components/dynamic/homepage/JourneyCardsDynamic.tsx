'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

interface JourneyCard {
  title: string;
  description: string;
  image: string;
  ctaText: string;
  slug?: string;
}

interface JourneyCardsDynamicProps {
  content: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    cards?: JourneyCard[];
  };
}

export function JourneyCardsDynamic({ content }: JourneyCardsDynamicProps) {
  const {
    sectionTitle = 'Curated Journeys',
    sectionSubtitle = 'Discover Bhutan through experiences designed for the discerning traveler',
    cards = [],
  } = content;

  if (cards.length === 0) return null;

  return (
    <section className="py-20 bg-alabaster dark:bg-dark-forest">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                    {card.description}
                  </p>

                  <Link
                    href={card.slug || `/tours`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:from-amber-600 hover:to-pink-600 transition-all duration-200 group"
                  >
                    {card.ctaText || 'Explore'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
