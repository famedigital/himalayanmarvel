'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import RevealOnScroll from './ui/RevealOnScroll';

/**
 * DreamEscape Component
 * Emotional storytelling section that inspires visitors
 * Focuses on transformation and experience rather than features
 */
export default function DreamEscape() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A120A 0%, #0E140E 50%, #0A120A 100%)',
      }}
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0"
      >
        <img
          src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg"
          alt="Bhutan landscape - Taktsang Palphug Monastery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </motion.div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 104, 56, 0.3) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="container-premium relative z-10">
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto text-center">
            {/* Pre-heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-[0.2em] uppercase"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                Discover Your Inner Peace
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Escape the Ordinary.
              <br />
              <span className="italic" style={{ color: '#D4AF37' }}>
                Embrace the Extraordinary.
              </span>
            </motion.h2>

            {/* Emotional Copy */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-10"
            >
              In a world that never stops, Bhutan invites you to pause. To breathe. To rediscover what matters.
              This is not a vacation — it&apos;s a homecoming for your soul.
            </motion.p>

            {/* Transformation Points */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
            >
              {[
                { text: 'Find stillness in ancient monasteries', icon: '🙏' },
                { text: 'Reconnect with nature\'s rhythm', icon: '🏔️' },
                { text: 'Discover happiness as a way of life', icon: '✨' },
              ].map((point, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(28, 36, 28, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                  }}
                >
                  <span className="text-3xl">{point.icon}</span>
                  <p className="text-sm text-white/80 text-center leading-relaxed">
                    {point.text}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0, 104, 56, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex px-10 py-5 rounded-full text-white text-sm font-semibold tracking-[0.15em] uppercase items-center gap-3 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #006838 0%, #008c4d 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 104, 56, 0.3)',
                }}
              >
                <span>Begin Your Transformation</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>

              {/* Subtext */}
              <p className="text-white/50 text-sm mt-6 tracking-wide">
                No commitment required • Free itinerary within 24 hours
              </p>
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Bottom Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, #0E140E, transparent)' }}
      />
    </section>
  );
}
