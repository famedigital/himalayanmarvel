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
      <div className="absolute inset-0 bg-alabaster dark:bg-dark-forest" />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
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
                <div
                  className="absolute inset-0"
                  style={{
                    background: isDark
                      ? 'linear-gradient(to top, rgba(14, 20, 14, 0.6) 0%, transparent 60%)'
                      : 'linear-gradient(to top, rgba(26, 26, 26, 0.15) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Experience Badge - Floating */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-8 -right-8 px-8 py-6 rounded-2xl backdrop-blur-xl"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
                  boxShadow: isDark
                    ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                    : '0 20px 60px rgba(0, 0, 0, 0.08)',
                }}
              >
                <p className="text-5xl font-display font-bold gradient-text">13+</p>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.2em] font-semibold mt-2",
                    isDark ? "text-white/60" : "text-charcoal/60"
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
            <h2
              className="font-display text-display-section mb-2 leading-tight"
              style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
            >
              Bivatsu
            </h2>
            <h2
              className="font-display text-display-section mb-8 leading-tight gradient-text"
            >
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
              <p
                className="font-editorial text-2xl md:text-3xl leading-relaxed pl-8"
                style={{ color: isDark ? 'rgba(247, 247, 242, 0.9)' : 'rgba(26, 26, 26, 0.9)' }}
              >
                We don&apos;t sell tours. We curate <span className="text-champagne-gold">transformations</span>.
              </p>
            </motion.blockquote>

            {/* Credentials */}
            <div className="space-y-6 mb-10">
              {/* Education */}
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}
                >
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
                      className="px-5 py-2.5 rounded-full"
                      style={{
                        backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(247, 247, 242, 0.9)',
                        border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)'}`,
                      }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(26, 26, 26, 0.8)' }}
                      >
                        {cred}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Luxury Leadership */}
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}
                >
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
                      className="text-lg font-display font-semibold"
                      style={{ color: isDark ? 'rgba(247, 247, 242, 0.7)' : 'rgba(26, 26, 26, 0.7)' }}
                    >
                      {brand}
                      {index < 2 && (
                        <span
                          className="mx-3"
                          style={{ color: isDark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 104, 56, 0.2)' }}
                        >
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
              className="flex items-center gap-3 px-6 py-4 rounded-xl"
              style={{
                backgroundColor: isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(0, 104, 56, 0.05)',
                border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)'}`,
              }}
            >
              <Shield className="w-5 h-5 text-champagne-gold flex-shrink-0" />
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                >
                  Licensed & Insured
                </p>
                <p
                  className="text-xs"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}
                >
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
