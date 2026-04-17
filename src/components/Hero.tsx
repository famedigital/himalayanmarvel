'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

        {/* Elegant dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative h-full flex items-center px-6 md:px-12 lg:px-20"
      >
        <div className="flex-1 flex items-center justify-end">
          {/* Left Side - Empty for breathability */}
          <div className="hidden lg:block flex-1" />

          {/* Right Side - Main Content */}
          <div className="max-w-[680px] ml-auto">
            {/* Main Headlines */}
            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-none text-white mb-6"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
            >
              Himalayan Marvels
            </motion.h1>

            {/* Tagline with Typewriter */}
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="text-xl md:text-2xl mb-4 font-light text-stone-200"
            >
              Experience
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="text-lg md:text-xl mb-4 max-w-xl leading-relaxed font-light text-stone-200"
            >
              Bhutan is not a destination. It&apos;s a shift in perspective.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="text-base md:text-lg mb-12 max-w-lg leading-relaxed text-stone-400"
            >
              Experience sacred landscapes, living traditions, and moments of stillness designed for deeper clarity.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
            >
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 rounded-full text-white text-sm font-medium tracking-wide flex items-center gap-3 transition-all"
                style={{ backgroundColor: '#8E261A' }}
              >
                Begin a conversation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
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
