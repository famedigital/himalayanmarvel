'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const keywords = [
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

  const [mounted, setMounted] = useState(false);
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use dark theme by default during SSR to match server-rendered HTML
  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  useEffect(() => {
    const currentKeyword = keywords[currentKeywordIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const delayAfterTyping = isDeleting ? 0 : 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentKeyword.length) {
          setDisplayText(currentKeyword.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayAfterTyping);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentKeyword.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentKeywordIndex((prev) => (prev + 1) % keywords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentKeywordIndex]);

  const gradients = [
    'from-bhutan-red via-bhutan-gold to-bhutan-indigo',
    'from-bhutan-indigo via-bhutan-gold to-bhutan-red',
    'from-bhutan-red via-bhutan-indigo to-bhutan-gold',
    'from-bhutan-gold via-bhutan-red to-bhutan-indigo',
    'from-bhutan-indigo via-bhutan-red to-bhutan-gold',
  ];
  const currentGradient = gradients[currentKeywordIndex];

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-stone-950"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4"
            type="video/mp4"
          />
        </video>

        {/* 10% Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Premium gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r dark:from-black/60 dark:via-black/20 dark:to-black/50" style={isDark ? {} : { background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1))' }} />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 75% 50%, rgba(142, 38, 26, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 25% 50%, rgba(232, 185, 35, 0.1) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full flex items-center px-6 md:px-12 lg:px-20"
      >
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Minimal Premium Price Tag */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 space-y-3 max-w-[280px]"
          >
            {/* New for 2025 Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex justify-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border transition-all text-white" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.3)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-700 to-amber-600 animate-pulse" />
                <span className="text-xs uppercase tracking-wider">New for 2025</span>
              </span>
            </motion.div>

            {/* Ultra Minimal Price Button */}
            <motion.a
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              href="#tours"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Subtle Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 via-transparent to-amber-600/20" />
              </div>

              {/* Price */}
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-xs font-medium text-white/80">USD</span>
                <motion.span
                  className="text-2xl font-bold"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    background: 'linear-gradient(135deg, rgb(181 138 48), rgb(20 83 45), rgb(34 107 57))',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  2,200
                </motion.span>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/25" />

              {/* Booking Code */}
              <div className="relative z-10">
                <p className="text-[9px] uppercase tracking-wider text-white/60">Code</p>
                <motion.p
                  className="text-sm font-semibold tracking-widest text-white"
                  animate={{
                    textShadow: [
                      '0 0 8px rgba(20, 83, 45, 0.6)',
                      '0 0 12px rgba(181, 138, 48, 0.6)',
                      '0 0 8px rgba(20, 83, 45, 0.6)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  DECO
                </motion.p>
              </div>

              {/* Arrow */}
              <motion.div
                className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center relative z-10 bg-white/15"
                whileHover={{ rotate: -45, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </motion.div>
            </motion.a>

            {/* Minimal Download Button */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              href="/Himalayan Marvels - Bhutan Luxury Journeys.pdf"
              download
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg backdrop-blur-xl transition-all relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgb(20 83 45), rgb(181 138 48), rgb(34 107 57))',
                backgroundSize: '200% 100%',
              }}
            >
              {/* Animated Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'linear',
                }}
              />
              <Download className="w-3.5 h-3.5 text-white relative z-10" />
              <span className="text-xs font-medium text-white relative z-10">Catalogue</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 0.3 }}
                className="ml-auto relative z-10"
              >
                <ArrowRight className="w-3 h-3 text-white" />
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Right Side - Main Content */}
          <div className="order-1 lg:order-2 max-w-[680px] ml-auto">
            {/* Main Headlines */}
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none text-white"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.3)' }}
            >
              Himalayan
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 leading-none"
            >
              <motion.span
                className={`bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Marvels
              </motion.span>
            </motion.h1>

            {/* Tagline with Typewriter */}
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl mb-4 font-normal text-white"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              Experience
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-16 mb-10"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <motion.span
                  className={`bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  {displayText}
                </motion.span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.6 }}
                  className="inline-block w-1 h-12 md:h-14 bg-white ml-1 align-middle rounded-full"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg mb-3 max-w-lg leading-loose font-light text-stone-100"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}
            >
              Bhutan is not a destination. It&apos;s a shift in perspective.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="text-base md:text-lg mb-10 max-w-lg leading-loose font-light text-stone-200"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}
            >
              Experience sacred landscapes, living traditions, and moments of stillness designed for deeper clarity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center sm:items-start gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 rounded-full text-base font-semibold flex items-center gap-3 shadow-2xl"
                style={{
                  backgroundColor: '#8E261A',
                  color: 'white',
                  boxShadow: '0 8px 30px rgba(142, 38, 26, 0.4)',
                }}
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Supporting Line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-sm text-stone-200 font-light tracking-wide"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
              >
                Private, thoughtfully designed journeys through Bhutan.
              </motion.p>
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
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
