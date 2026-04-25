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
        <div className="flex-1">
          {/* Centered Content */}
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              key={`logo-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72">
                <Image
                  src={heroLogo}
                  alt="Himalayan Marvels"
                  fill
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 240px, 288px"
                  className="object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 0 60px rgba(232, 185, 35, 0.3))' }}
                />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              key={`subtitle-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed text-stone-200"
            >
              {staticSubtitle}
              {rotatingParts.length > 0 && (
                <>
                  {staticSubtitle ? ', ' : ''}
                  <span className="text-amber-200">{typedDynamicPart}</span>
                </>
              )}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4 }}
                className="inline-block w-0.5 h-6 md:h-8 bg-amber-400/90 ml-1 align-middle rounded-full"
              />
            </motion.p>

            {/* CTA */}
            <motion.div
              key={`cta-${currentSlide?.id || 'default'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
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
