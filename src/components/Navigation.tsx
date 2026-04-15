'use client';

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'Tours', href: '#tours' },
  { name: 'About', href: '#about' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      x.set(deltaX * strength * 0.4);
      y.set(deltaY * strength * 0.4);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <>
      {/* Floating Pill Navigation - Ultra Luxury with Magnetic Effect */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <MagneticButton>
          <motion.div
            animate={{
              scale: isScrolled ? 0.95 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="relative backdrop-blur-xl rounded-2xl border overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              boxShadow: isScrolled
                ? '0 15px 50px rgba(0, 0, 0, 0.15)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Animated Gradient Line at Top */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.8), rgba(236, 72, 153, 0.8), rgba(139, 92, 246, 0.8), transparent)',
              }}
              animate={{
                opacity: isScrolled ? 1 : 0.7,
                scale: isScrolled ? 1 : 0.95,
              }}
              transition={{ duration: 0.3 }}
            />

            <div className="flex items-center gap-2 px-2 py-2.5 sm:px-4 sm:py-3">
              {/* Logo - Left */}
              <MagneticButton>
                <motion.a
                  href="#"
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
                    }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Globe className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="text-sm font-bold gradient-text hidden sm:block dark:text-white text-neutral-900">
                    Himalayan Marvels
                  </span>
                </motion.a>
              </MagneticButton>

              {/* Divider */}
              <div className="w-px h-6 dark:bg-gradient-to-b bg-gradient-to-b dark:from-white/20 from-neutral-300 dark:via-white/10 via-neutral-200 to-transparent hidden md:block" />

              {/* Navigation Links - Center with Magnetic Effect */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <MagneticButton key={item.name}>
                    <Link href={item.href}>
                      <motion.div
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        <span className="relative z-10 text-sm font-medium transition-colors" style={{ color: isDark ? 'white' : '' }}>
                          {item.name}
                        </span>

                        {/* Magnetic Hover Background */}
                        <AnimatePresence>
                          {hoveredItem === item.name && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 dark:bg-white/10 bg-neutral-200/50 rounded-xl backdrop-blur-sm"
                            />
                          )}
                        </AnimatePresence>

                        {/* Active Indicator Dot with Spring */}
                        <AnimatePresence>
                          {hoveredItem === item.name && (
                            <motion.div
                              layoutId="navIndicator"
                              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 25
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </MagneticButton>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1 hidden md:block" />

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <MagneticButton>
                  <div className="scale-90">
                    <ThemeToggle />
                  </div>
                </MagneticButton>

                {/* Book Now CTA with Stronger Magnetic Effect */}
                <MagneticButton>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#tours"
                    className="relative px-5 py-2.5 rounded-xl text-white text-sm font-semibold overflow-hidden group hidden sm:block"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                      boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Book Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: 'linear',
                      }}
                    />
                  </motion.a>
                </MagneticButton>

                {/* Mobile Menu Button */}
                <MagneticButton>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMobileMenuOpen ? (
                        <X className="w-5 h-5 dark:text-white text-neutral-900" />
                      ) : (
                        <Menu className="w-5 h-5 dark:text-white text-neutral-900" />
                      )}
                    </motion.div>
                  </motion.button>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </MagneticButton>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden"
          >
            <motion.div
              className="backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl transition-all"
                    style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#374151' }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.a
                  href="#tours"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-center font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                  }}
                >
                  Book Now
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
