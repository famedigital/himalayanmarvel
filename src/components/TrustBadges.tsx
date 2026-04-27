'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import RevealOnScroll from './ui/RevealOnScroll';

interface TrustBadge {
  icon: any;
  label: string;
  description: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: Shield,
    label: 'Licensed & Insured',
    description: 'Tourism Council of Bhutan',
  },
  {
    icon: Award,
    label: 'ABTO Member',
    description: 'Association of Bhutanese Tour Operators',
  },
  {
    icon: Clock,
    label: '24/7 Support',
    description: 'Local team in Thimphu',
  },
  {
    icon: Lock,
    label: 'Secure Booking',
    description: 'Protected payments',
  },
];

/**
 * TrustBadges Component
 * Displays certifications, licenses, and trust indicators
 * Builds credibility with official credentials
 */
export default function TrustBadges() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? '#0E140E' : '#F7F7F2',
        }}
      />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container-premium relative z-10">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
              <span
                className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
                style={{ color: '#D4AF37' }}
              >
                Trust & Credentials
              </span>
              <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
            </div>
            <h2
              className="text-2xl md:text-3xl font-light"
              style={{
                color: isDark ? '#F7F7F2' : '#1A1A1A',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              Your Journey is{' '}
              <span className="italic" style={{ color: '#D4AF37' }}>
                Protected
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center p-6 rounded-2xl transition-all"
                  style={{
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)'}`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)',
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: '#D4AF37' }} />
                  </div>

                  {/* Label */}
                  <p
                    className="font-semibold text-sm mb-2"
                    style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                  >
                    {badge.label}
                  </p>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}
                  >
                    {badge.description}
                  </p>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Trust note */}
        <RevealOnScroll delay={0.4}>
          <div className="text-center mt-10">
            <p
              className="text-xs tracking-wide"
              style={{ color: isDark ? 'rgba(247, 247, 242, 0.35)' : 'rgba(26, 26, 26, 0.35)' }}
            >
              Registered with Tourism Council of Bhutan • Licensed Tour Operator • Fully Insured
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
