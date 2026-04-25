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
  title?: string;
  subtitle?: string;
  link?: string;
  description?: string;
  keywords?: string[];
  experienceLabel?: string;
  ctaText?: string;
  isPrimary?: boolean;
}

const defaultKeywords = [
  'Sacred Landscapes',
  'Living Traditions',
  'Moments of Stillness',
  'Deeper Clarity',
  'A Shift in Perspective',
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const { theme, resolvedTheme } = useTheme();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
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
  const heroTitle = currentSlide?.title || 'Himalayan Marvels';
  const heroSubtitle = currentSlide?.subtitle || 'Experience sacred landscapes, living traditions, and moments of stillness.';
  const heroDescription = currentSlide?.description || 'Bhutan is not a destination. It\'s a shift in perspective.';
  const heroLink = currentSlide?.link || '/contact';
  const heroMediaUrl = currentSlide?.url || 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4';
  const heroMediaType = currentSlide?.type || 'video';
  const heroKeywords = currentSlide?.keywords || defaultKeywords;
  const heroExperienceLabel = currentSlide?.experienceLabel || 'Experience';
  const heroCtaText = currentSlide?.ctaText || 'Begin a conversation';

  // Typewriter effect for keywords
  useEffect(() => {
    const currentKeyword = heroKeywords[currentKeywordIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseDuration = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentKeyword.length) {
          setDisplayText(currentKeyword.slice(0, displayText.length + 1));
        } else {
          // Finished typing, pause then delete
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentKeyword.slice(0, displayText.length - 1));
        } else {
          // Finished deleting, move to next keyword
          setIsDeleting(false);
          setCurrentKeywordIndex((prev) => (prev + 1) % heroKeywords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentKeywordIndex, heroKeywords]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-stone-950"
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
            className="w-full h-full object-cover"
          >
            <source src={heroMediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroMediaUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        )}

        {/* Elegant dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full flex items-center px-6 md:px-12 lg:px-20"
      >
        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="max-w-xl">
            {/* Main Headlines */}
            <motion.h1
              key={`title-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-none text-white mb-6"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
            >
              {heroTitle}
            </motion.h1>

            {/* Tagline with Typewriter */}
            <motion.p
              key={`label-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-xl md:text-2xl mb-4 font-light text-stone-200"
            >
              {heroExperienceLabel}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="h-16 mb-10"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-100">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.8 }}
                  className="inline-block w-1 h-12 md:h-14 bg-amber-500/80 ml-1 align-middle rounded-full"
                />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              key={`description-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-lg md:text-xl mb-4 max-w-xl leading-relaxed font-light text-stone-200"
            >
              {heroDescription}
            </motion.p>

            <motion.p
              key={`desc-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-base md:text-lg mb-12 max-w-lg leading-relaxed text-stone-400"
            >
              {heroSubtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              key={`cta-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              <motion.a
                href={heroLink}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex px-10 py-4 rounded-full text-white text-sm font-medium tracking-wide items-center gap-3 transition-all"
                style={{ backgroundColor: '#8E261A' }}
              >
                {heroCtaText}
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Side - Large Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png"
                alt="Himalayan Marvels"
                fill
                className="object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 60px rgba(232, 185, 35, 0.3))' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F4F0] to-transparent" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-16 bg-white/30"
        />
      </motion.div>
    </section>
  );
}
