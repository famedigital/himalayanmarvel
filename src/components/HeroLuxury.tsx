'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { LuxuryBadge } from '@/components/luxury/LuxuryBadge';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';

// Typewriter text component
function TypewriterText({ text, className, delay = 0, speed = 30 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      timeout = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          startTyping();
        }
      }, speed);
    };

    const initialDelay = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, delay, speed]);

  return <span className={className}>{displayedText}</span>;
}

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

  const heroLogo = currentSlide?.logo || '/logo/HMT-Logo.png';

  // EMOTIONAL, CINEMATIC COPY — Not functional description
  const heroSubtitle = currentSlide?.subtitle || 'Private cultural journeys, festival experiences, and Himalayan adventures — designed around your travel style by the team who\'s hosted 2,500+ guests since 2014.';
  const heroLink = currentSlide?.link || '#contact';
  const heroMediaUrl = currentSlide?.url || 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4';
  const heroMediaType = currentSlide?.type || 'video';
  const heroCtaText = currentSlide?.ctaText || 'Design Your Custom Journey';

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
            alt="Tashichho Dzong fortress at sunset with traditional Bhutanese architecture, Thimphu"
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

      {/* LOGO - Top right corner - Badge positioned below logo */}
      <div className="absolute top-12 right-4 md:right-8 z-40 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-36 h-36 md:w-44 md:h-44 lg:w-56 lg:h-56"
        >
          <Image
            src={heroLogo}
            alt="Himalayan Marvels"
            fill
            sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 224px"
            className="object-contain"
            style={{ filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))' }}
          />
        </motion.div>

        {/* Founder Badge - Below logo, aligned to right of logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2"
        >
          <LuxuryBadge variant="gold" size="sm">
            <span className="hidden md:inline">Founded by Ex-Ritz-Carlton Leadership</span>
            <span className="md:hidden">Ex-Ritz-Carlton Leadership</span>
          </LuxuryBadge>
        </motion.div>
      </div>

      {/* HERO CONTENT - All on left side, center empty for building view */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full px-4 md:px-12"
      >
        {/* LEFT SIDE - Headline, Subheadline - Mobile: Below floating menu */}
        <div className="absolute left-4 md:left-8 top-28 md:top-24 max-w-md z-10">
          {/* CINEMATIC HEADLINE with Typewriter - Much larger mobile font */}
          <motion.h1
            key={`heading-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-display text-4xl md:text-3xl lg:text-5xl text-white mb-3 md:mb-4 leading-snug md:leading-tight"
          >
            <span className="block">Private Luxury</span>
            <span className="block">Bhutan Tours</span>
            <TypewriterText text="by Local Experts" className="text-champagne-gold" delay={800} speed={50} />
          </motion.h1>

          {/* EMOTIONAL SUBHEADLINE with Typewriter - Show on mobile with shorter text */}
          <motion.p
            key={`subtitle-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-sm md:text-sm lg:text-base text-white/90 leading-relaxed font-light md:mb-6 max-w-xs"
          >
            <TypewriterText text="Experience sacred landscapes, living culture, and journeys that stay with you." delay={1500} speed={25} />
          </motion.p>
        </div>
      </motion.div>

      {/* CTA BUTTONS - Bottom Left - Higher position */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="absolute bottom-28 md:bottom-24 left-4 md:left-8 flex flex-col items-start gap-2 md:gap-3 z-20"
      >
        <LuxuryButton
          variant="primary"
          size="lg"
          href={heroLink}
          icon={true}
        >
          <span className="text-sm md:text-base">{heroCtaText}</span>
        </LuxuryButton>

        {/* WhatsApp Concierge Option */}
        <motion.a
          href="https://wa.me/97577270465"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs md:text-sm"
        >
          <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
          <span className="font-light">WhatsApp Concierge</span>
        </motion.a>

        {/* Trust line below CTA - Hide some items on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-2 md:mt-4 flex items-center justify-start gap-2 md:gap-4 text-[10px] md:text-xs text-white/60 uppercase tracking-[0.1em] md:tracking-[0.15em]"
        >
          <span className="hidden md:inline">Licensed Operator #1030624</span>
          <span className="md:hidden">Licensed #1030624</span>
          <span className="w-px h-3 md:h-4 bg-white/20" />
          <span>4.9★ Rating</span>
        </motion.div>
      </motion.div>

      {/* TRUST ANCHORS - 13+ Years, 4.9 Rating - Bottom Right - Visible on mobile too */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-28 right-4 md:right-8 flex items-center gap-3 md:gap-6"
      >
        {/* Years */}
        <div className="text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-champagne-gold">13+</p>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.15em] text-white/60 font-semibold mt-1">
            Years
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-6 md:h-10 bg-white/20" />

        {/* Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 md:gap-1">
            <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-champagne-gold">4.9</p>
            <div className="flex gap-0.5 mb-0.5 md:mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2 h-2 md:w-3 md:w-4 md:h-4 fill-champagne-gold text-champagne-gold" />
              ))}
            </div>
          </div>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.15em] text-white/60 font-semibold mt-1">
            Rating
          </p>
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
