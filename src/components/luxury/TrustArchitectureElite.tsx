'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Shield, Award, Globe, Users, Star, Quote, MessageCircle, CheckCircle2, Gem, Sparkles, Share2, Image as ImageIcon, MapPin, Hand } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

/**
 * TrustArchitectureElite — Anchor & Wings Layout
 *
 * Premium editorial design where journey packages are the HERO content.
 * Center stage packages with supporting "wings" and "basement" content.
 */

// Animated counter
function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '', decimals = 0 }: { end: number; duration?: number; suffix?: string; prefix?: string; decimals?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentCount = easeOut * end;
        setCount(parseFloat(currentCount.toFixed(decimals)));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, decimals]);

  return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
}

// Premium card component
function PremiumCard({
  children,
  className = '',
  featured = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  delay?: number;
}) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const maskImage = useMotionValue(`radial-gradient(250px at 0px 0px, white, transparent)`);

  useEffect(() => {
    if (featured) {
      const unsubscribeX = mouseX.on('change', (latest) => {
        const newMask = `radial-gradient(300px at ${latest}px ${mouseY.get()}px, white, transparent)`;
        maskImage.set(newMask);
      });
      const unsubscribeY = mouseY.on('change', (latest) => {
        const newMask = `radial-gradient(300px at ${mouseX.get()}px ${latest}px, white, transparent)`;
        maskImage.set(newMask);
      });
      return () => {
        unsubscribeX?.();
        unsubscribeY?.();
      };
    }
  }, [mouseX, mouseY, maskImage, featured]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: featured ? -8 : -4,
        scale: featured ? 1.02 : 1.01,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-3xl transition-shadow duration-500',
        featured && 'group/card',
        className
      )}
      style={{
        background: isDark
          ? featured
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)'
          : featured
            ? 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)'
            : 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
        boxShadow: isDark
          ? featured
            ? '0 1px 3px rgba(0, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.15)'
            : '0 1px 3px rgba(0, 0, 0, 0.2), 0 10px 25px rgba(0, 0, 0, 0.1)'
          : featured
            ? '0 1px 3px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.03)'
            : '0 1px 3px rgba(0, 0, 0, 0.04), 0 10px 25px rgba(0, 0, 0, 0.02)',
      }}
    >
      {featured && (
        <>
          {/* Subtle brightness overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
            }}
          />

          {/* Very subtle gold accent border - minimal */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 rounded-3xl opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent 50%, rgba(212, 175, 55, 0.05))',
            }}
          />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function TrustArchitectureElite() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  // Inclusions list
  const inclusions = [
    { icon: '🚗', text: 'Private Driver' },
    { icon: '🏨', text: 'Luxury Stays' },
    { icon: '✈️', text: 'Visa Handling' },
    { icon: '📱', text: '24/7 Support' },
  ];

  // Stats for basement
  const stats = [
    { value: 500, suffix: '+', label: 'Travelers' },
    { value: 4.9, suffix: '/5', label: 'Rating' },
    { value: 100, suffix: '%', label: 'Happy' },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Section background - ensure solid background in dark mode */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? '#0E140E'
            : 'transparent',
        }}
      />

      {/* Ambient gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(14, 20, 14, 0.6) 0%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(247, 247, 242, 0.3) 0%, transparent 100%)',
        }}
      />

      <div className="container-luxury relative z-10">

        {/* EDITORIAL HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))'
                : 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.03))',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Gem className="w-3.5 h-3.5 text-champagne-gold" />
            <span className="text-champagne-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
              Signature Journeys
            </span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            <span style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
              Curated by
            </span>
            <span className="gradient-text">Bhutanese Insiders</span>
          </h1>

          <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: isDark ? 'rgba(247, 247, 242, 0.7)' : 'rgba(26, 26, 26, 0.7)' }}>
            Two transformative journeys designed by those who know every hidden path, every sacred tradition.
          </p>
        </motion.header>

        {/* ANCHOR & WINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">

          {/* LEFT WING - Social Card (Vertical) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:row-span-2 p-6 flex flex-col justify-center rounded-3xl relative overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)'
                : 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
              boxShadow: isDark
                ? '0 1px 3px rgba(0, 0, 0, 0.2), 0 15px 30px rgba(0, 0, 0, 0.1)'
                : '0 1px 3px rgba(0, 0, 0, 0.04), 0 15px 30px rgba(0, 0, 0, 0.02)',
            }}
          >
            {/* Animated Gradient Border */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(45deg, #D4AF37, #F5D76E, #D4AF37, #B8960E)',
                backgroundSize: '300% 300%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Inner content with padding from border */}
            <div className="relative z-10 text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] uppercase tracking-[0.2em] text-champagne-gold mb-8"
              >
                Follow Our Journey
              </motion.p>

              {/* Social Icons with 3D Flip & Name Reveal */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    name: 'Instagram',
                    url: 'https://www.instagram.com/himalayanmarvels.travel/',
                    bgGradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  },
                  {
                    name: 'Facebook',
                    url: 'https://www.facebook.com/himalayanmarvels/',
                    bgGradient: '#1877F2',
                  },
                  {
                    name: 'Google',
                    url: 'https://share.google/KxrxzG5cNAOAN4qRB',
                    bgGradient: '#4285F4',
                  },
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => {
                      // Trigger name reveal - position below icon
                      document.querySelectorAll(`[data-social-name="${social.name}"]`).forEach((el: Element) => {
                        const htmlEl = el as HTMLElement;
                        htmlEl.style.opacity = '1';
                        htmlEl.style.transform = 'translateY(0px)';
                      });
                    }}
                    onHoverEnd={() => {
                      // Hide name
                      document.querySelectorAll(`[data-social-name="${social.name}"]`).forEach((el: Element) => {
                        const htmlEl = el as HTMLElement;
                        htmlEl.style.opacity = '0';
                        htmlEl.style.transform = 'translateY(-8px)';
                      });
                    }}
                    className="group/icon relative flex items-center justify-center p-5 rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                      background: isDark
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid transparent',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  >
                    {/* Hover glow background */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${social.bgGradient}15, transparent 70%)`,
                      }}
                    />

                    {/* Icon with 3D flip */}
                    <motion.div
                      className="relative z-10"
                      style={{ perspective: '1000px' }}
                      whileHover={{
                        rotateY: 360,
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
                        style={{ background: social.bgGradient }}
                      >
                        {social.name === 'Instagram' && (
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        )}
                        {social.name === 'Facebook' && (
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                        )}
                        {social.name === 'Google' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                      </div>
                    </motion.div>

                    {/* Name - Clean reveal on hover */}
                    <span
                      data-social-name={social.name}
                      className="absolute text-sm font-semibold tracking-wide whitespace-nowrap z-20 pointer-events-none transition-all duration-300 ease-out"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        opacity: 0,
                        transform: 'translateY(-8px)',
                        bottom: '8px',
                      }}
                    >
                      {social.name}
                    </span>

                    {/* Sparkle particles on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            background: social.bgGradient,
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            y: [0, -20, -40],
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Card-level hover glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
              whileHover={{ opacity: 1 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08), transparent 70%)',
              }}
            />
          </motion.div>

          {/* CENTER STAGE - Cultural Journey (HERO) */}
          <PremiumCard delay={0.15} featured className="md:col-span-2 p-0 group/journey">
            <a href="/tours?type=cultural" className="block relative aspect-[4/3] md:aspect-[3/2] rounded-3xl overflow-hidden bg-neutral-900">
              <div className="absolute inset-0">
                <Image
                  src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg"
                  alt="Cultural Journey"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover/journey:scale-105"
                  priority={false}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Overlapping Featured Badge */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-1.5 rounded-full" style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(184, 134, 11, 0.95))',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                }}>
                  <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                    ⭐ Featured
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {/* Micro Typography */}
                <p className="text-[8px] md:text-[9px] text-champagne-gold uppercase tracking-[0.3em] mb-2">
                  L U X U R Y &nbsp;&nbsp; P A C K A G E
                </p>
                <p className="text-champagne-gold text-[10px] uppercase tracking-wider font-semibold mb-2">
                  Cultural Immersion
                </p>
                <p className="text-white font-display text-2xl md:text-3xl font-bold mb-2">
                  Cultural Journeys
                </p>
                <p className="text-white/70 text-xs md:text-sm mb-4">
                  7-14 Days • Festivals • Monasteries • Local Life
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'linear-gradient(135deg, #006838 0%, #004D29 100%)',
                    boxShadow: '0 4px 16px rgba(0, 104, 56, 0.3)',
                  }}
                >
                  <span>Explore Journey</span>
                  <span>→</span>
                </motion.div>
              </div>
            </a>
          </PremiumCard>

          {/* CENTER STAGE - Spiritual Journey (HERO) */}
          <PremiumCard delay={0.2} featured className="md:col-span-2 p-0 group/journey">
            <a href="/tours?type=spiritual" className="block relative aspect-[4/3] md:aspect-[3/2] rounded-3xl overflow-hidden bg-neutral-900">
              <div className="absolute inset-0">
                <Image
                  src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg"
                  alt="Spiritual Journey"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover/journey:scale-105"
                  priority={false}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Overlapping Featured Badge */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-1.5 rounded-full" style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(184, 134, 11, 0.95))',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                }}>
                  <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                    ⭐ Featured
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {/* Micro Typography */}
                <p className="text-[8px] md:text-[9px] text-champagne-gold uppercase tracking-[0.3em] mb-2">
                  T R A N S F O R M A T I V E
                </p>
                <p className="text-champagne-gold text-[10px] uppercase tracking-wider font-semibold mb-2">
                  Inner Awakening
                </p>
                <p className="text-white font-display text-2xl md:text-3xl font-bold mb-2">
                  Spiritual Journeys
                </p>
                <p className="text-white/70 text-xs md:text-sm mb-4">
                  8-12 Days • Meditation • Astrology • Sacred Sites
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'linear-gradient(135deg, #006838 0%, #004D29 100%)',
                    boxShadow: '0 4px 16px rgba(0, 104, 56, 0.3)',
                  }}
                >
                  <span>Explore Journey</span>
                  <span>→</span>
                </motion.div>
              </div>
            </a>
          </PremiumCard>

          {/* RIGHT WING - Inclusions Card (Vertical) */}
          <PremiumCard delay={0.25} className="md:row-span-2 p-5">
            <div className="mb-4">
              <p className="text-sm uppercase tracking-wider font-semibold gradient-text text-center">
                Always Included
              </p>
            </div>
            <div className="space-y-4">
              {inclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.08)' }}>
              <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(247, 247, 242, 0.6)' : 'rgba(26, 26, 26, 0.6)' }}>
                Every detail handled. You simply arrive and experience.
              </p>
            </div>
          </PremiumCard>

          {/* BASEMENT ROW - Square cards below */}

          {/* Official Tour Operator Badge */}
          <PremiumCard delay={0.35} className="p-4 text-center">
            <a
              href="https://services.bhutan.travel/search/tour-operator/himalayan-marvels"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2" style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
              }}>
                <Shield className="w-5 h-5 text-champagne-gold" />
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                Official Operator
              </p>
              <p className="text-[10px]" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                TCB #20753
              </p>
            </a>
          </PremiumCard>

          {/* Founder's Promise */}
          <PremiumCard delay={0.4} className="md:col-span-2 p-5 flex items-center gap-4">
            <Quote className="w-8 h-8 text-champagne-gold/30 flex-shrink-0" />
            <div>
              <p className="font-serif text-sm md:text-base leading-relaxed" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                We don&apos;t sell tours. We curate <span className="text-champagne-gold italic">transformative encounters</span> with a kingdom that measures wealth in happiness.
              </p>
            </div>
          </PremiumCard>

        </div>

        {/* GUARANTEE BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-center py-6 md:py-7 px-6 rounded-3xl max-w-2xl mx-auto mt-6"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
            boxShadow: isDark
              ? '0 1px 3px rgba(0, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.12)'
              : '0 1px 3px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.025)',
          }}
        >
          <Shield className="w-8 h-8 text-champagne-gold mx-auto mb-3" />
          <p className="font-display text-xl md:text-3xl font-bold mb-2" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
            100% Satisfaction Guarantee
          </p>
          <p className="text-sm md:text-base mb-4" style={{ color: isDark ? 'rgba(247, 247, 242, 0.6)' : 'rgba(26, 26, 26, 0.6)' }}>
            If your journey doesn&apos;t exceed expectations, we&apos;ll make it right.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              { icon: CheckCircle2, text: 'Free Rescheduling' },
              { icon: CheckCircle2, text: '24/7 Concierge' },
              { icon: CheckCircle2, text: 'Best Price' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <item.icon className="w-3 h-3 text-forest-green flex-shrink-0" />
                </div>
                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(26, 26, 26, 0.8)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
