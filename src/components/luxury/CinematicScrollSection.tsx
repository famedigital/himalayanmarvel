'use client';

import { motion } from 'framer-motion';
import { Mountain, Star, Compass, Camera, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { LuxuryButton } from './LuxuryButton';

// Chapter data (defined outside component for hook rules)
const chapters = [
  {
    id: 1,
    title: 'The Call',
    subtitle: 'In a world that never stops',
    description: 'You feel disconnected. Overwhelmed. Yearning for something real.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    icon: Star,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 2,
    title: 'The Kingdom',
    subtitle: 'Bhutan awaits',
    description: 'Where time slows down. Where happiness is measured, not GDP. Where ancient wisdom lives.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    icon: Mountain,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 3,
    title: 'The Journey',
    subtitle: 'Curated for you',
    description: 'Private monasteries. Sacred festivals. Local families. Hot stone baths. Your way.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: Compass,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    title: 'The Return',
    subtitle: 'Forever changed',
    description: 'You\'re not the same person who arrived. You\'ve found stillness. Connection. Home.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: Camera,
    color: 'from-rose-500 to-pink-500',
  },
];

/**
 * CinematicScrollSection — 2x2 Grid Layout
 *
 * All chapters visible at once. No excessive scrolling.
 * Clean, scannable, immediate impact.
 */
export function CinematicScrollSection() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

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

      <div className="container-luxury relative z-10 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-champagne-gold" />
            <span className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-semibold">
              Your Story
            </span>
            <div className="w-12 h-px bg-champagne-gold" />
          </div>

          <h2 className="font-display text-display-section text-white mb-6">
            Four Chapters to{' '}
            <span className="gradient-text">Transformation</span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every great journey follows a path. Discover yours.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {chapters.map((chapter, index) => {
            const Icon = chapter.icon;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                }}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={chapter.image}
                    alt={chapter.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Chapter Number */}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-champagne-gold/20 backdrop-blur-sm border border-champagne-gold/30">
                      <span className="text-champagne-gold font-display font-bold text-lg">
                        0{chapter.id}
                      </span>
                    </div>
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${chapter.color})`,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2 group-hover:text-champagne-gold transition-colors">
                    {chapter.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-champagne-gold text-sm mb-3 font-medium">
                    {chapter.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${chapter.color.split(' ')[0]}15 0%, transparent 70%)`,
                  }}
                />
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
          className="text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            Your Journey{' '}
            <span className="gradient-text">Awaits</span>
          </h2>

          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Every journey begins with a conversation. Share your vision, and we&apos;ll
            design an experience beyond imagination.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <LuxuryButton variant="primary" size="xl" href="#contact" icon={true}>
              Begin Your Transformation
            </LuxuryButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
