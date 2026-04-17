'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'Tours', href: '#tours' },
  { name: 'About', href: '#about' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
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
      {/* Elegant Thin Navigation - Bhutanese Luxury */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: isDark ? 'rgba(38, 38, 38, 0.9)' : 'rgba(248, 244, 240, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Bhutanese Gold Top Border - Sacred accent */}
        <div
          className="h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #E8B923, transparent)',
          }}
        />

        <div className="container-premium">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link href="#">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-11 h-11">
                  <Image
                    src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png"
                    alt="Himalayan Marvels"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-semibold tracking-wide hidden sm:block" style={{ color: '#262626' }}>
                  Himalayan Marvels
                </span>
              </motion.div>
            </Link>

            {/* Navigation Links - Center */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium tracking-wide relative py-1"
                    style={{ color: isDark ? '#F8F4F0' : '#262626' }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="scale-90">
                <ThemeToggle />
              </div>

              {/* Login - Admin Access */}
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="/hmterp/admin/login"
                className="relative px-4 py-2 text-xs font-medium tracking-wide hidden sm:block transition-all"
                style={{ color: isDark ? '#F8F4F0' : '#262626' }}
              >
                Login
              </motion.a>

              {/* Inquire - Subtle Luxury */}
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="relative px-5 py-2 text-xs font-medium tracking-wide hidden sm:block transition-all"
                style={{ color: isDark ? '#F8F4F0' : '#262626' }}
              >
                Inquire
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-8 h-8 flex items-center justify-center"
                style={{ color: isDark ? '#F8F4F0' : '#262626' }}
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
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{
              backgroundColor: isDark ? 'rgba(38, 38, 38, 0.98)' : 'rgba(248, 244, 240, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Bhutanese Gold Border Top */}
            <div
              className="h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #E8B923, transparent)' }}
            />

            <div className="container-premium py-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ color: isDark ? '#F8F4F0' : '#262626' }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-center text-sm font-medium"
                style={{ color: isDark ? '#F8F4F0' : '#262626' }}
              >
                Inquire
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
