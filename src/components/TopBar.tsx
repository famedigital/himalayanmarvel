'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Mail, Phone, Globe, MessageCircle, Send, MapPin,
  Clock, Sparkles
} from 'lucide-react';

const socialLinks = [
  { icon: MessageCircle, href: 'https://www.instagram.com/himalayanmarvels.travel/', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://facebook.com/himalayanmarvels', label: 'Facebook' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: MessageCircle, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'YouTube' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  { icon: Send, href: 'mailto:info@himalayanmarvels.com', label: 'Email' },
  { icon: Phone, href: 'tel:+97577270465', label: 'Call' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MapPin, href: '#', label: 'Location' },
  { icon: Clock, href: '#', label: 'Hours' },
  { icon: Sparkles, href: '#', label: 'Reviews' },
];

// Glitch text effect
const useGlitchText = (text: string) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        return prev
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      iteration += 1 / 3;

      if (iteration >= text.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return displayText;
};

export default function TopBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const glitchedText = useGlitchText('innovates.bt');
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  return (
    <motion.div
      style={{ opacity }}
      className="relative z-50"
    >
      {/* Main Top Bar */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 48, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        }}
      >
        <div className="h-full">
          <div className="container-premium h-full">
            <div className="flex items-center justify-between h-full">
              {/* Left - Glitch Logo Text */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#E8B923' }} />
                <span className="text-sm font-mono font-bold tracking-wider" style={{
                  background: 'linear-gradient(90deg, #E8B923, #f4d03f, #E8B923)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}>
                  {glitchedText}
                </span>
              </motion.div>

              {/* Right - Impact Box */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative"
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
              >
                {/* Trigger Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-5 py-2 rounded-lg flex items-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232, 185, 35, 0.1), rgba(232, 185, 35, 0.05))',
                    border: '1px solid rgba(232, 185, 35, 0.3)',
                  }}
                >
                  <div className="flex gap-1.5">
                    {[MessageCircle, MessageCircle, Mail].map((Icon, i) => (
                      <Icon key={i} className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-stone-300">Connect</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </motion.div>
                </motion.button>

                {/* Expanded Panel - 12 Icons Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full right-0 mt-3 w-72"
                      style={{
                        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                        border: '1px solid rgba(232, 185, 35, 0.2)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(232, 185, 35, 0.1)',
                      }}
                    >
                      {/* Header */}
                      <div className="px-5 pt-4 pb-3 border-b border-stone-800/50">
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          Connect With Us
                        </p>
                      </div>

                      {/* 12 Icons Grid */}
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-2">
                          {socialLinks.map((social, index) => {
                            const Icon = social.icon;
                            return (
                              <motion.a
                                key={social.label}
                                href={social.href}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: index * 0.03,
                                  type: 'spring',
                                  stiffness: 200,
                                  damping: 15,
                                }}
                                whileHover={{ scale: 1.15, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group aspect-square rounded-xl flex items-center justify-center transition-all"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                }}
                              >
                                <Icon className="w-5 h-5 text-stone-400 group-hover:text-amber-400 transition-colors" />

                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{
                                    background: 'radial-gradient(circle at center, rgba(232, 185, 35, 0.15), transparent 70%)',
                                  }}
                                />

                                {/* Tooltip */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(232, 185, 35, 0.3)',
                                    color: '#E8B923',
                                  }}
                                >
                                  {social.label}
                                </div>
                              </motion.a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 pb-4 pt-2">
                        <p className="text-[10px] text-stone-500 text-center">
                          Available 24/7 for your journey
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated Gold Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-[1px] bottom-0 left-0 right-0"
          style={{
            background: 'linear-gradient(90deg, transparent, #E8B923, transparent)',
            transformOrigin: 'center',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
