'use client';

import { motion } from 'framer-motion';
import { Mountain, Star, Compass, Camera, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Image from 'next/image';
import { LuxuryButton } from './LuxuryButton';

// Chapter data (defined outside component for hook rules)
const chapters = [
  {
    id: 1,
    title: 'The Call',
    subtitle: 'In a world that never stops',
    description: 'You feel disconnected. Overwhelmed. Yearning for something real...',
    quote: 'The journey of a thousand miles begins with a single step into the unknown.',
    quoteSource: 'Lao Tzu',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    icon: Star,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 2,
    title: 'The Kingdom',
    subtitle: 'Bhutan awaits',
    description: 'Where time slows down. Where happiness is measured, not GDP. Where ancient wisdom lives.',
    quote: 'In the Himalayas, time is not measured in hours but in moments of stillness.',
    quoteSource: 'Bhutanese Proverb',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    icon: Mountain,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 3,
    title: 'The Journey',
    subtitle: 'Curated for you',
    description: 'Private monasteries. Sacred festivals. Local families. Hot stone baths. Your way.',
    quote: 'Travel is the only thing you buy that makes you richer.',
    quoteSource: 'Anonymous',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: Compass,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    title: 'The Return',
    subtitle: 'Forever changed',
    description: 'You\'re not the same person who arrived. You\'ve found stillness. Connection. Home.',
    quote: 'A journey of a thousand miles must begin with a single step.',
    quoteSource: 'Lao Tzu',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: Camera,
    color: 'from-rose-500 to-pink-500',
  },
];

/**
 * CinematicScrollSection — Ultra-Premium Journey Line Layout
 *
 * Features:
 * - Vertical journey line connecting all chapters
 * - Full-width cinematic cards with parallax images
 * - Premium serif typography with drop caps
 * - Scroll-triggered reveals and animations
 * - Chapter quotes for emotional depth
 * - Progress indicator dots
 */
export function CinematicScrollSection() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const [activeChapter, setActiveChapter] = useState(0);

  // Scroll to chapter function
  const scrollToChapter = (index: number) => {
    const element = document.getElementById(`chapter-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="section-luxury relative bg-neutral-900 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />

      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Progress indicator (fixed on desktop) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeChapter === i
                ? 'bg-champagne-gold scale-150 shadow-[0_0_15px_rgba(212,175,55,0.8)]'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to ${chapter.title}`}
          />
        ))}
      </div>

      <div className="container-luxury relative z-10 py-16 md:py-24 px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-32"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 md:w-12 h-px bg-champagne-gold" />
            <span className="text-champagne-gold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold">
              Your Story
            </span>
            <div className="w-8 md:w-12 h-px bg-champagne-gold" />
          </div>

          <h2 className="font-display text-3xl md:text-display-section text-white mb-4 md:mb-6">
            Four Chapters to{' '}
            <span className="gradient-text">Transformation</span>
          </h2>

          <p className="text-sm md:text-lg text-white/60 max-w-2xl mx-auto">
            Every great journey follows a path. Discover yours.
          </p>
        </motion.div>

        {/* Journey Line - Full Width Chapters */}
        <div className="space-y-16 md:space-y-32 relative">
          {/* Vertical journey line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-champagne-gold/30 to-transparent hidden md:block" />

          {chapters.map((chapter, index) => {
            const Icon = chapter.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={chapter.id}
                id={`chapter-${index}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                onViewportEnter={() => setActiveChapter(index)}
                className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-20`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.15 }}
                  className="w-full md:flex-1 relative"
                >
                  {/* Large chapter number - Hidden on mobile */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.15, type: 'spring' }}
                    className="absolute -top-12 -left-4 md:-top-16 md:-left-8 text-[120px] md:text-[180px] font-serif text-champagne-gold/5 font-bold leading-none pointer-events-none select-none hidden md:block"
                  >
                    0{chapter.id}
                  </motion.div>

                  {/* Parallax image container */}
                  <motion.div
                    whileInView={{ y: [50, 0] }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-2xl md:rounded-3xl"
                  >
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-3 right-3 md:top-6 md:right-6 w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${chapter.color})`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
                  className="w-full md:flex-1"
                >
                  {/* Glass morphism card */}
                  <div className="relative backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 border border-white/10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      boxShadow: '0 15px 40px -12px rgba(0,0,0,0.5)',
                    }}
                  >
                    {/* Subtle noise texture overlay */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E")',
                      }}
                    />

                    <div className="relative z-10">
                      {/* Chapter number badge */}
                      <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-champagne-gold/20 backdrop-blur-sm border border-champagne-gold/30 mb-4 md:mb-6">
                        <span className="text-champagne-gold font-display font-bold text-base md:text-lg">
                          0{chapter.id}
                        </span>
                      </div>

                      {/* Title - Serif headline */}
                      <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-2 md:mb-4 leading-tight">
                        {chapter.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-champagne-gold text-xs md:text-sm mb-3 md:mb-6 font-medium">
                        {chapter.subtitle}
                      </p>

                      {/* Description with drop cap first letter - Simplified on mobile */}
                      <p className="font-serif text-sm md:text-lg lg:text-xl text-white/80 leading-relaxed mb-4 md:mb-8">
                        <span className="text-champagne-gold font-bold text-2xl md:text-5xl float-left mr-2 md:mr-3 mt-[-4px] md:mt-[-8px]">
                          {chapter.description[0]}
                        </span>
                        {chapter.description.slice(1)}
                      </p>

                      {/* Quote - Hidden on very small screens */}
                      <blockquote className="relative pl-4 md:pl-8 border-l-2 border-champagne-gold/50 my-4 md:my-6">
                        <p className="font-serif text-sm md:text-lg lg:text-xl text-white/90 italic mb-2 md:mb-3 leading-relaxed">
                          &ldquo;{chapter.quote}&rdquo;
                        </p>
                        <cite className="text-champagne-gold text-[10px] md:text-sm not-italic">
                          — {chapter.quoteSource}
                        </cite>
                      </blockquote>
                    </div>
                  </div>
                </motion.div>

                {/* Journey line connector dot - Desktop only */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-champagne-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] md:shadow-[0_0_20px_rgba(212,175,55,0.6)] z-10 hidden md:block"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-champagne-gold/30"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16 md:mt-32"
        >
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
            Your Journey{' '}
            <span className="gradient-text">Awaits</span>
          </h2>

          <p className="text-xs md:text-lg text-white/60 mb-6 md:mb-8 max-w-2xl mx-auto">
            Every journey begins with a conversation. Share your vision, and we&apos;ll
            design an experience beyond imagination.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <LuxuryButton variant="primary" size="lg" href="#contact" icon={true}>
              <span className="text-sm md:text-base">Design Your Custom Journey</span>
            </LuxuryButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
