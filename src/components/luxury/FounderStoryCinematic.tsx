'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Quote, Award, Globe, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { LuxuryButton } from './LuxuryButton';

/**
 * FounderStoryCinematic — Emotional founder narrative video section
 *
 * Addresses ChatGPT's feedback: "Founder story is not strong enough"
 * "People trust people, especially for expensive travel"
 */
export function FounderStoryCinematic() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  const timeline = [
    {
      year: '2005',
      title: 'The Foundation',
      description: 'Elite hospitality training at Les Roches, Spain. Learning the art of luxury service from the best.',
      icon: Award,
    },
    {
      year: '2008',
      title: 'Luxury Leadership',
      description: 'Leading operations at The Ritz-Carlton, Hyatt, and Kempinski. Understanding what true excellence means.',
      icon: Globe,
    },
    {
      year: '2012',
      title: 'Coming Home',
      description: 'Returning to Bhutan with a vision: to bring world-class luxury service to the Kingdom.',
      icon: Quote,
    },
  ];

  return (
    <section ref={containerRef} className="section-luxury relative overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        >
          <source src="/founder-story/bivatsu-journey.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      <div className="container-luxury relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ opacity, y }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-champagne-gold" />
            <span className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-semibold">
              The Vision
            </span>
            <div className="w-12 h-px bg-champagne-gold" />
          </div>

          <h2 className="font-display text-display-hero text-white mb-6">
            Why Himalayan{' '}
            <span className="gradient-text">Marvels</span>
          </h2>

          <blockquote className="font-serif italic text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed mb-8">
            &ldquo;I realized that Bhutan needed more than just another tour company.
            It needed a travel experience that matched the magic of the Kingdom itself.&rdquo;
          </blockquote>

          <p className="text-white/60 text-lg">— Bivatsu Giri, Founder & CEO</p>
        </motion.div>

        {/* TIMELINE */}
        <div className="max-w-4xl mx-auto mb-20">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex items-start gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                  }}>
                    <Icon className="w-8 h-8 text-champagne-gold" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-champagne-gold text-2xl font-display font-bold mb-2">
                    {item.year}
                  </p>
                  <h3 className="text-white text-xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <p className="text-6xl font-display font-bold gradient-text mb-2">13+</p>
            <p className="text-white/60 text-sm uppercase tracking-wider">Years</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-display font-bold gradient-text mb-2">5K+</p>
            <p className="text-white/60 text-sm uppercase tracking-wider">Guests</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-display font-bold gradient-text mb-2">40+</p>
            <p className="text-white/60 text-sm uppercase tracking-wider">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-display font-bold gradient-text mb-2">4.9</p>
            <p className="text-white/60 text-sm uppercase tracking-wider">Rating</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6 text-lg">
            Let&apos;s craft your transformative journey together
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <LuxuryButton variant="primary" size="xl" href="#contact">
              Schedule Your Consultation
            </LuxuryButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
