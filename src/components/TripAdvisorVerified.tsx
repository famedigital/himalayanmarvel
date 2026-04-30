'use client';

import { motion } from 'framer-motion';
import { Star, ExternalLink, Award } from 'lucide-react';
import Link from 'next/link';

/**
 * TripAdvisorVerified — Display verified Google rating
 *
 * Shows:
 * - Overall rating (4.9/5)
 * - Review count
 * - Link to Google reviews
 * - Verified badge
 */
export function TripAdvisorVerified() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-alabaster to-white dark:from-dark-forest dark:to-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 104, 56, 0.1), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Award className="w-5 h-5 text-champagne-gold" />
            <span className="text-sm font-semibold tracking-[0.15em] uppercase text-champagne-gold">
              Verified Excellence
            </span>
          </motion.div>

          {/* Rating */}
          <div className="mb-8">
            <p className="text-7xl md:text-8xl font-display font-bold text-neutral-900 dark:text-white mb-4">
              4.9
              <span className="text-3xl md:text-4xl text-neutral-400 dark:text-neutral-600">/5</span>
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 md:w-8 md:h-8 fill-champagne-gold text-champagne-gold" />
              ))}
            </div>

            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Based on 15 verified reviews on Google
            </p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="https://share.google/jcfuEHOacCjzAmGaM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-semibold tracking-wide hover:shadow-lg transition-all duration-300"
            >
              <span>Read reviews on Google</span>
              <ExternalLink className="w-5 h-5" />
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-4">
              Official Google Profile — Himalayan Marvels Bhutan
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
