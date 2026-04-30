'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import LeadCaptureForm from '@/components/LeadCaptureForm';

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
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Premium Bhutan images for carousel
  const heroImages = [
    'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    'https://res.cloudinary.com/dxztrqjft/image/upload/v1776271223/tashichodzong_ddin28.jpg',
  ];

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
          type: 'image',
          url: heroImages[0],
          isPrimary: true
        }]);
      }
      setLoading(false);
    };

    fetchSlides();
  }, []);

  // Auto-advance image carousel every 6 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  // Get primary slide or use first slide as fallback, then defaults
  const primarySlide = slides.find(s => s.isPrimary) || slides[0];
  const currentSlide = primarySlide;
  const heroLogo = currentSlide?.logo || '/logo/HMT-Logo.png';
  const heroSubtitle = currentSlide?.subtitle || 'Luxury cultural, spiritual, and trekking journeys designed from within Bhutan.';
  const heroLink = currentSlide?.link || '/contact';
  const heroMediaUrl = currentSlide?.url || 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4';
  const heroMediaType = currentSlide?.type || 'video';
  const heroCtaText = currentSlide?.ctaText || 'Design Your Journey';

  return (
    <section
      ref={ref}
      className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#0E140E]"
    >
      {/* Image/Video Carousel Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {slides[currentImageIndex]?.type === 'video' ? (
            <motion.video
              key={slides[currentImageIndex]?.id || currentImageIndex}
              src={slides[currentImageIndex]?.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ) : (
            <motion.img
              key={slides[currentImageIndex]?.id || currentImageIndex}
              src={slides[currentImageIndex]?.url || heroImages[0]}
              alt={slides[currentImageIndex]?.description || "Bhutan Landscape"}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

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

          {/* Rating Badge - Top Left */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 mb-6"
            style={{ color: '#D4AF37' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold">13+</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider">Years</span>
            </div>
            <div className="w-px h-5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold">4.9</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Cinematic Heading - Typography First */}
          <motion.h1
            key={`heading-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Private Bhutan Journeys Through{' '}
            <span className="italic" style={{ color: '#D4AF37' }}>
              Sacred Landscapes & Living Culture
            </span>
          </motion.h1>

          {/* Subtitle - Static, No Animation */}
          <motion.p
            key={`subtitle-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-6"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons - Side by Side */}
          <motion.div
            key={`cta-${currentSlide?.id || 'default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA - Green */}
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

            {/* Secondary CTA - Gold */}
            <motion.button
              onClick={() => {
                const formElement = document.querySelector('[data-lead-form]') as HTMLElement;
                formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              whileHover={{ x: 4, boxShadow: '0 8px 32px rgba(212, 175, 55, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex px-10 py-4 rounded-full text-white text-sm font-medium tracking-wide items-center gap-3 transition-all"
              style={{
                backgroundColor: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <span>Plan Your Trip</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Lead Capture Form - Hidden, shown when scrolling */}
          <div className="hidden">
            <LeadCaptureForm />
          </div>
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
