'use client';

import { motion } from 'framer-motion';
import { Mountain, Gem, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import RevealOnScroll from './ui/RevealOnScroll';

const features = [
  {
    icon: Mountain,
    title: 'Designed from within Bhutan',
    description: 'Authentic experiences crafted by locals who know every sacred path and hidden valley of the Kingdom.',
  },
  {
    icon: Gem,
    title: 'Private, curated journeys',
    description: 'Thoughtfully designed itineraries tailored to your intentions, with meticulous attention to every detail.',
  },
  {
    icon: Sparkles,
    title: 'Authentic cultural access',
    description: 'Deep spiritual connections to living traditions and sacred sites rarely accessible to visitors.',
  },
];

export default function WhyTravelWithUs() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#0E140E' : '#FFFFFF' }}
    >
      <div className="container-premium relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#006838' }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#006838' }}
            >
              The Difference
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#006838' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-light mb-6"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Why Travel With Us
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: isDark ? 'rgba(247,247,242,0.45)' : 'rgba(26,26,26,0.45)' }}
          >
            We don&apos;t offer tours. We design journeys that transform.
          </p>
        </RevealOnScroll>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <RevealOnScroll key={feature.title} delay={index * 0.12}>
                <div className="h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                    style={{ backgroundColor: '#006838' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-xl font-medium mb-4"
                    style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="leading-relaxed"
                    style={{ color: isDark ? 'rgba(247,247,242,0.45)' : 'rgba(26,26,26,0.5)' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
