'use client';

import { motion } from 'framer-motion';
import { Shield, Star, CheckCircle, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import RevealOnScroll from './ui/RevealOnScroll';

const partners = [
  { name: 'Drukair', logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332392/drukair_ua8y4s.png' },
  { name: 'Bhutan Airlines', logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332392/bhutanairline_ajwkle.png' },
  { name: 'Dept. of Tourism', logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332392/tcb_flypxm.jpg' },
  { name: 'ABTO', logo: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332392/ABTO-logo_i2t3pu.png' },
];

export default function TrustSection() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <section
      className="py-20 relative"
      style={{ backgroundColor: isDark ? '#111811' : '#FFFFFF' }}
    >
      <div className="container-premium">
        {/* Google Reviews + Stats */}
        <RevealOnScroll className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          {/* Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-current"
                  style={{ color: '#D4AF37' }}
                />
              ))}
            </div>
            <p
              className="text-3xl font-light"
              style={{ color: isDark ? '#F7F7F2' : '#1A1A1A', fontFamily: 'var(--font-playfair)' }}
            >
              4.9{' '}
              <span
                className="text-base font-normal"
                style={{ color: isDark ? 'rgba(247,247,242,0.5)' : 'rgba(26,26,26,0.5)' }}
              >
                on Google
              </span>
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.4)' }}
            >
              15 Google reviews
            </p>
            <a
              href="https://share.google/iK0uDjvJ81zAlRAwb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium transition-colors"
              style={{ color: '#006838' }}
            >
              See all reviews on Google
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            {[
              { value: '12+', label: 'Years of Excellence' },
              { value: '100%', label: 'Satisfaction Rate' },
              { value: '2,500+', label: 'Guests Hosted' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-2xl md:text-3xl font-light"
                  style={{ color: '#006838', fontFamily: 'var(--font-playfair)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs uppercase tracking-[0.15em] mt-1"
                  style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.4)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Certification */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: isDark ? 'rgba(0, 104, 56, 0.15)' : 'rgba(0, 104, 56, 0.1)' }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: '#006838' }} />
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
              >
                Licensed Tour Operator
              </p>
              <p
                className="text-xs"
                style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
              >
                Tourism Council of Bhutan
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Partner Logos - Horizontal scroll */}
        <RevealOnScroll delay={0.2}>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-default"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.5)',
                  border: '1px solid rgba(212, 175, 55, 0.08)',
                }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 w-auto object-contain"
                />
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)' }}
                >
                  {partner.name}
                </span>
              </motion.div>
            ))}

            {/* Shield icon at end */}
            <div className="flex-shrink-0 flex items-center gap-2 px-6 py-4">
              <Shield className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: isDark ? 'rgba(247,247,242,0.25)' : 'rgba(26,26,26,0.3)' }}
              >
                Trusted & Verified
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
