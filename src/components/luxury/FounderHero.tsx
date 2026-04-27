'use client';

import { motion } from 'framer-motion';
import { Shield, Award } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { LuxuryBadge } from './LuxuryBadge';
import { cn } from '@/lib/utils';

/**
 * FounderHero — Trust authority section positioned immediately after hero
 * Establishes founder credentials as primary trust signal
 *
 * Key Elements:
 * - Founder portrait with luxury styling
 * - Credentials prominently displayed
 * - Quote emphasizing transformation over tours
 * - Luxury brand background (Ritz-Carlton, Hyatt, Kempinski)
 */
export function FounderHero() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <section className="section-luxury relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0, 104, 56, 0.04) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main Image */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  boxShadow: isDark
                    ? '0 32px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)'
                    : '0 32px 80px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(212, 175, 55, 0.08)',
                }}
              >
                <Image
                  src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776275660/founder-portrait_pbo8m4.jpg"
                  alt="Bivatsu Giri - Founder & CEO"
                  width={600}
                  height={750}
                  className="w-full aspect-[4/5] object-cover"
                  priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/80" />
              </div>

              {/* Experience Badge - Floating */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-8 -right-8 px-8 py-6 rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-neutral-900/95 border border-emerald-100 dark:border-champagne-gold/15 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <p className="text-5xl font-display font-bold gradient-text">13+</p>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.2em] font-semibold mt-2 text-neutral-600 dark:text-white/60"
                  )}
                >
                  Years Creating Magic
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            {/* Badge */}
            <LuxuryBadge variant="gold" size="md" className="mb-6">
              Founder & CEO
            </LuxuryBadge>

            {/* Name */}
            <h2 className="font-display text-display-section mb-2 leading-tight text-neutral-900 dark:text-white">
              Bivatsu
            </h2>
            <h2 className="font-display text-display-section mb-8 leading-tight bg-gradient-to-r from-champagne-gold to-amber-400 bg-clip-text text-transparent">
              Giri
            </h2>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-10"
            >
              <div
                className="absolute -left-4 -top-2 text-8xl font-display font-bold opacity-10"
                style={{ color: '#D4AF37' }}
              >
                "
              </div>
              <p className="font-editorial text-2xl md:text-3xl leading-relaxed pl-8 text-neutral-800 dark:text-neutral-100">
                We don&apos;t sell tours. We curate <span className="text-champagne-gold">transformations</span>.
              </p>
            </motion.blockquote>

            {/* Credentials */}
            <div className="space-y-6 mb-10">
              {/* Education */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3 text-neutral-400 dark:text-neutral-500">
                  Education
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Les Roches (Spain)', 'ICHM (Australia)', 'MBA — University of Canberra'].map((cred, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-champagne-gold/20"
                    >
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        {cred}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Luxury Leadership */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
                  <Award className="w-4 h-4 text-champagne-gold" />
                  Luxury Leadership
                </p>
                <div className="flex flex-wrap gap-4">
                  {['The Ritz-Carlton', 'Hyatt', 'Kempinski'].map((brand, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="text-lg font-display font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      {brand}
                      {index < 2 && (
                        <span className="mx-3 text-champagne-gold/30 dark:text-champagne-gold/40">
                          •
                        </span>
                      )}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-50 dark:bg-neutral-800/50 border border-emerald-100 dark:border-champagne-gold/20"
            >
              <Shield className="w-5 h-5 text-champagne-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Licensed & Insured
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tourism Council of Bhutan • ABTO Member
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
