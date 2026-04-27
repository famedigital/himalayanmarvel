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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <>
      {/* Floating Dock Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto"
      >
        <div
          className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-3 rounded-2xl transition-all duration-500"
          style={{
            backgroundColor: isDark
              ? isScrolled ? 'rgba(14, 20, 14, 0.92)' : 'rgba(14, 20, 14, 0.8)'
              : isScrolled ? 'rgba(247, 247, 242, 0.95)' : 'rgba(247, 247, 242, 0.82)',
            backdropFilter: isScrolled ? 'blur(32px) saturate(180%)' : 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: isScrolled ? 'blur(32px) saturate(180%)' : 'blur(24px) saturate(180%)',
            border: '1px solid rgba(212, 175, 55, 0.12)',
            boxShadow: isScrolled
              ? isDark
                ? '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.05)'
                : '0 8px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.08)'
              : isDark
                ? '0 4px 24px rgba(0, 0, 0, 0.3)'
                : '0 4px 24px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center mr-2 md:mr-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="text-[0.7rem] md:text-xs font-semibold tracking-[0.2em] uppercase whitespace-nowrap"
                style={{
                  color: isDark ? '#F7F7F2' : '#1A1A1A',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                HIMALAYAN MARVELS
              </span>
            </motion.div>
          </Link>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-4 mx-2"
            style={{ backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.12)' }}
          />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <span
                    className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase py-1 inline-block transition-colors"
                    style={{ color: isDark ? 'rgba(247, 247, 242, 0.9)' : 'rgba(0, 104, 56, 0.85)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = isDark ? '#F7F7F2' : '#006838';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = isDark ? 'rgba(247, 247, 242, 0.9)' : 'rgba(0, 104, 56, 0.85)';
                    }}
                  >
                    {item.name}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ backgroundColor: '#D4AF37', scaleX: 0, transformOrigin: 'left' }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-4 mx-2"
            style={{ backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.12)' }}
          />

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            <motion.a
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="/admin/login"
              className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase hidden md:block transition-colors"
              style={{ color: isDark ? 'rgba(247, 247, 242, 0.7)' : 'rgba(0, 104, 56, 0.6)' }}
            >
              Login
            </motion.a>

            <motion.a
              whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0, 104, 56, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              className="px-5 py-2 text-[0.65rem] font-semibold tracking-[0.15em] uppercase hidden md:block rounded-full transition-all"
              style={{
                color: '#FFFFFF',
                backgroundColor: '#006838',
              }}
            >
              Inquire
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1"
              style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDark ? 'rgba(14, 20, 14, 0.98)' : 'rgba(247, 247, 242, 0.98)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(212, 175, 55, 0.12)',
              boxShadow: isDark
                ? '0 16px 48px rgba(0, 0, 0, 0.5)'
                : '0 16px 48px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="px-6 py-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors border-b last:border-b-0"
                  style={{
                    color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(0, 104, 56, 0.7)',
                    borderColor: isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)',
                  }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                className="pt-4 flex gap-3"
              >
                <a
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[0.6rem] font-medium tracking-[0.15em] uppercase"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(0, 104, 56, 0.45)' }}
                >
                  Login
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-1.5 text-[0.6rem] font-medium tracking-[0.15em] uppercase rounded-full"
                  style={{ color: '#FFFFFF', backgroundColor: '#006838' }}
                >
                  Inquire
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
