'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Mountain, Star, Compass, Camera } from 'lucide-react';
import { useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776271223/tashichodzong_ddin28.mp4',
    icon: Camera,
    color: 'from-rose-500 to-pink-500',
  },
];

/**
 * CinematicScrollSection — Signature WOW moment with scroll-based storytelling
 *
 * Addresses ChatGPT's feedback: "No signature brand moment"
 * "Need something users remember"
 */
export function CinematicScrollSection() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1]);

  // CTA opacity at the end
  const ctaOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[300vh] bg-neutral-900 overflow-hidden"
    >
      {/* Fixed Background Image */}
      <div className="sticky top-0 h-screen w-full">
        <div className="absolute inset-0">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                // Simplified: show all backgrounds with overlay, no scroll-based opacity
                opacity: 1,
              }}
            >
              {chapter.id === 4 ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={chapter.image} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={chapter.image}
                  alt={chapter.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            className="min-h-screen flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-4xl"
              >
                {/* Chapter Number */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="text-8xl font-display font-bold text-white/10">
                    0{chapter.id}
                  </div>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${chapter.color})`,
                    boxShadow: `0 20px 60px ${chapter.color.split(' ')[0]}40`,
                  }}
                >
                  <chapter.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="font-display text-6xl md:text-8xl text-white mb-6 leading-tight"
                >
                  {chapter.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="font-serif italic text-2xl md:text-3xl text-champagne-gold mb-6"
                >
                  {chapter.subtitle}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="text-xl md:text-2xl text-white/80 leading-relaxed font-light"
                >
                  {chapter.description}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-5xl md:text-7xl text-white mb-8"
          >
            Your Journey{' '}
            <span className="gradient-text">Awaits</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
          >
            Every journey begins with a conversation. Share your vision, and we&apos;ll
            design an experience beyond imagination.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-full text-white font-semibold tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
              boxShadow: '0 16px 48px rgba(212, 175, 55, 0.4)',
            }}
          >
            Begin Your Transformation
            <Compass className="w-5 h-5" />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
