'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

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

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const { theme, resolvedTheme } = useTheme();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [typedDynamicPart, setTypedDynamicPart] = useState('');
  const [dynamicIndex, setDynamicIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);

    // Fetch hero slides from settings
    const fetchSlides = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hero_slides')
        .single();

      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        setSlides(data.value);
      } else {
        // Set default slide if no data exists
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

  // Get primary slide or use first slide as fallback, then defaults
  const primarySlide = slides.find(s => s.isPrimary) || slides[0];
  const currentSlide = primarySlide;
  const heroLogo = currentSlide?.logo || 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png';
  const heroSubtitle = currentSlide?.subtitle || 'Experience sacred landscapes, living traditions, and moments of stillness.';
  const heroLink = currentSlide?.link || '/contact';
  const heroMediaUrl = currentSlide?.url || 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4';
  const heroMediaType = currentSlide?.type || 'video';
  const heroCtaText = currentSlide?.ctaText || 'Begin a conversation';

  useEffect(() => {
    setTypedDynamicPart('');
    setDynamicIndex(0);
    setIsDeleting(false);
  }, [heroSubtitle, currentSlide?.id]);

  const subtitleParts = heroSubtitle
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const staticSubtitle = subtitleParts[0] || '';
  const rotatingParts = subtitleParts.slice(1);
  const activeDynamicText = rotatingParts.length
    ? rotatingParts[dynamicIndex % rotatingParts.length]
    : '';

  useEffect(() => {
    if (!rotatingParts.length) return;

    const typingSpeed = isDeleting ? 45 : 70;
    const pauseDuration = isDeleting ? 350 : 1400;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedDynamicPart.length < activeDynamicText.length) {
          setTypedDynamicPart(activeDynamicText.slice(0, typedDynamicPart.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else if (typedDynamicPart.length > 0) {
        setTypedDynamicPart(activeDynamicText.slice(0, typedDynamicPart.length - 1));
      } else {
        setIsDeleting(false);
        setDynamicIndex((prev) => (prev + 1) % rotatingParts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [activeDynamicText, isDeleting, rotatingParts.length, typedDynamicPart]);

  return (
    <section
      ref={ref}
      className="relative h-[75vh] md:h-screen w-full overflow-hidden bg-[#0E140E]"
    >
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        {heroMediaType === 'video' ? (
          <video
            key={heroMediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover img-editorial"
          >
            <source src={heroMediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroMediaUrl}
            alt="Hero background"
            className="w-full h-full object-cover img-editorial"
          />
        )}

        {/* Cinematic dual-layer overlay */}
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full flex items-center justify-center px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo - Elegant smaller placement */}
          <motion.div
            key={`logo-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mb-10 flex justify-center"
          >
            <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48">
              <Image
                src={heroLogo}
                alt="Himalayan Marvels"
                fill
                sizes="(max-width: 768px) 144px, 192px"
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.25))' }}
              />
            </div>
          </motion.div>

          {/* Cinematic Heading - Typography First */}
          <motion.h1
            key={`heading-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            The Last{' '}
            <span className="italic" style={{ color: '#D4AF37' }}>
              Shangri-La
            </span>
          </motion.h1>

          {/* Subtitle with typing effect */}
          <motion.p
            key={`subtitle-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-base md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(247, 247, 242, 0.8)' }}
          >
            {staticSubtitle}
            {rotatingParts.length > 0 && (
              <>
                {staticSubtitle ? ', ' : ''}
                <span style={{ color: '#D4AF37' }}>{typedDynamicPart}</span>
              </>
            )}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4 }}
              className="inline-block w-0.5 h-5 md:h-7 ml-1 align-middle rounded-full"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.7)' }}
            />
          </motion.p>

          {/* CTA Button */}
          <motion.div
            key={`cta-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <motion.a
              href={heroLink}
              whileHover={{ x: 4, boxShadow: '0 8px 32px rgba(0, 104, 56, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex px-10 py-4 rounded-full text-white text-sm font-medium tracking-wide items-center gap-3 transition-all"
              style={{
                backgroundColor: '#006838',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              {heroCtaText}
              <ArrowRight className="w-4 h-4" />
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-16 rounded-full"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }}
        />
      </motion.div>
    </section>
  );
}
