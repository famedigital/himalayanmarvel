'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <>
      {/* Ultra Premium Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: isDark
            ? isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.85)'
            : isScrolled ? 'rgba(248, 244, 240, 0.98)' : 'rgba(248, 244, 240, 0.9)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Gold Accent Line - Subtle */}
        <div className="h-[0.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(232, 185, 35, 0.4), transparent)' }} />

        <div className="container-premium">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left */}
            <Link href="#">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-lg font-light tracking-[0.15em] hidden sm:block"
                  style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}
                >
                  HIMALAYAN MARVELS
                </motion.span>
              </motion.div>
            </Link>

            {/* Navigation Links - Center */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <span
                      className="text-xs font-light tracking-[0.2em] uppercase py-2 inline-block"
                      style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 26, 26, 0.88)' }}
                    >
                      {item.name}
                    </span>
                    {/* Underline animation */}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{ backgroundColor: '#E8B923', scaleX: 0, transformOrigin: 'left' }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Login */}
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="/admin/login"
                className="text-xs font-light tracking-[0.15em] hidden sm:block transition-colors"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.82)' : 'rgba(26, 26, 26, 0.82)' }}
              >
                LOGIN
              </motion.a>

              {/* Inquire Button - Premium */}
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="px-6 py-2.5 text-xs font-medium tracking-[0.15em] hidden sm:block transition-all rounded-sm"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#8E261A',
                }}
              >
                INQUIRE
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
                style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden"
            style={{
              backgroundColor: isDark ? 'rgba(10, 10, 10, 0.98)' : 'rgba(248, 244, 240, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="container-premium py-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xs font-light tracking-[0.2em] uppercase"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(26, 26, 26, 0.92)' }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="/admin/login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 mt-4 text-xs font-light tracking-[0.15em] uppercase"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.82)' : 'rgba(26, 26, 26, 0.82)' }}
              >
                Login
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
