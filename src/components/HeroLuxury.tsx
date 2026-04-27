'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { LuxuryBadge } from '@/components/luxury/LuxuryBadge';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';

interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  logo?: string;
  subtitle?: string;
  link?: string;
  description?: string;
  keywords?: string[];
  experienceLabel?: string;
  ctaText?: string;
  isPrimary?: boolean;
}

/**
 * HeroLuxury — World-class luxury hero section
 *
 * Key Changes from Original:
 * - NO image carousel (single cinematic impact)
 * - Logo doubled in size (384px)
 * - Founder credentials badge prominent
 * - Exclusivity signaling ("48 journeys annually")
 * - Cinematic headline ("Bhutan. Reimagined.")
 * - Single primary CTA (not dual)
 * - Enlarged trust anchors
 * - WhatsApp concierge option
 */
export default function HeroLuxury() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const { theme, resolvedTheme } = useTheme();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchSlides = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hero_slides')
        .single();

      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        setSlides(data.value);
      } else {
        setSlides([{
          id: 'default',
          type: 'video',
          url: 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4',
          isPrimary: true
        }]);
      }
      setLoading(false);
    };

    fetchSlides();
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  // Get primary slide or use first slide
  const primarySlide = slides.find(s => s.isPrimary) || slides[0];
  const currentSlide = primarySlide;

  const heroLogo = currentSlide?.logo || 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png';
  const heroSubtitle = currentSlide?.subtitle || 'Where ancient wisdom meets modern luxury. Private journeys curated by insiders, not tours designed for tourists.';
  const heroLink = currentSlide?.link || '#contact';
  const heroMediaUrl = currentSlide?.url || 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4';
  const heroMediaType = currentSlide?.type || 'video';
  const heroCtaText = currentSlide?.ctaText || 'Request Private Consultation';

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[#0E140E]"
    >
      {/* BACKGROUND — Single video (NO carousel) */}
      <div className="absolute inset-0">
        {heroMediaType === 'video' ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src={heroMediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroMediaUrl}
            alt="Bhutan landscape"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          />
        )}

        {/* Cinematic single-layer overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* HERO CONTENT */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full flex items-center justify-center px-6 md:px-12"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* FOUNDER CREDENTIALS BADGE — NEW (Trust anchor) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <LuxuryBadge variant="gold" size="md">
              Founded by Ex-Ritz-Carlton Leadership
            </LuxuryBadge>
          </motion.div>

          {/* HERO LOGO — DOUBLED in size (384px) */}
          <motion.div
            key={`logo-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src={heroLogo}
                alt="Himalayan Marvels"
                fill
                sizes="(max-width: 768px) 320px, 384px"
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 0.4))' }}
              />
            </div>
          </motion.div>

          {/* EXCLUSIVITY INDICATOR — NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-champagne-gold text-sm md:text-base uppercase tracking-[0.3em] font-semibold">
              Limited to 48 Private Journeys Annually
            </p>
          </motion.div>

          {/* CINEMATIC HEADLINE — NEW positioning */}
          <motion.h1
            key={`heading-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-display text-display-hero text-white mb-8 leading-tight"
          >
            Bhutan. <em className="text-champagne-gold">Reimagined.</em>
          </motion.h1>

          {/* EMOTIONAL SUBHEADLINE */}
          <motion.p
            key={`subtitle-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
          >
            {heroSubtitle}
          </motion.p>

          {/* TRUST ANCHORS — ENLARGED (13+ Years, 4.9 Rating) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-8 md:gap-12 mb-12"
          >
            {/* Years */}
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-display font-bold text-champagne-gold">13+</p>
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">
                Years
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-16 bg-white/20" />

            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-5xl md:text-6xl font-display font-bold text-champagne-gold">4.9</p>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-champagne-gold text-champagne-gold" />
                  ))}
                </div>
              </div>
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">
                Rating
              </p>
            </div>
          </motion.div>

          {/* SINGLE PRIMARY CTA — Not dual */}
          <motion.div
            key={`cta-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            <LuxuryButton
              variant="primary"
              size="xl"
              href={heroLink}
              icon={true}
            >
              {heroCtaText}
            </LuxuryButton>

            {/* WhatsApp Concierge Option */}
            <motion.a
              href="https://wa.me/97577270465"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-light">WhatsApp Concierge</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 dark:hidden"
        style={{ background: 'linear-gradient(to top, #F7F7F2, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 hidden dark:block"
        style={{ background: 'linear-gradient(to top, #0E140E, transparent)' }}
      />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-20 rounded-full bg-champagne-gold/40"
        />
      </motion.div>
    </section>
  );
}
