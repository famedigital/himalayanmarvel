'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'Journeys',
    href: '/tours',
    hasDropdown: true,
    children: [
      { name: 'Cultural Immersion', href: '/tours?type=cultural' },
      { name: 'Spiritual Wellness', href: '/tours?type=spiritual' },
      { name: 'Himalayan Expeditions', href: '/tours?type=trek' },
    ],
  },
  { name: 'Journal', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Concierge', href: '/concierge' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

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
              <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : undefined}>
                {item.hasDropdown ? (
                  <>
                    <motion.button
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                      className="relative flex items-center gap-1 group"
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      onMouseEnter={() => setOpenDropdown(item.name)}
                    >
                      <span
                        className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase py-1 inline-block transition-colors"
                        style={{ color: isDark ? 'rgba(247, 247, 242, 0.9)' : 'rgba(0, 104, 56, 0.85)' }}
                      >
                        {item.name}
                      </span>
                      <ChevronDown
                        className="w-3 h-3 transition-transform duration-200"
                        style={{
                          color: isDark ? 'rgba(247, 247, 242, 0.6)' : 'rgba(0, 104, 56, 0.6)',
                          transform: openDropdown === item.name ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-[1px]"
                        style={{ backgroundColor: '#D4AF37', scaleX: openDropdown === item.name ? 1 : 0, transformOrigin: 'left' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openDropdown === item.name && item.children && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 mt-2 min-w-[200px] rounded-xl overflow-hidden"
                          style={{
                            backgroundColor: isDark ? 'rgba(14, 20, 14, 0.98)' : 'rgba(247, 247, 242, 0.98)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            border: '1px solid rgba(212, 175, 55, 0.12)',
                            boxShadow: isDark
                              ? '0 16px 48px rgba(0, 0, 0, 0.4)'
                              : '0 16px 48px rgba(0, 0, 0, 0.08)',
                          }}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-5 py-3 text-[0.65rem] font-semibold tracking-[0.15em] uppercase transition-colors border-b last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5"
                              style={{
                                color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(0, 104, 56, 0.7)',
                                borderColor: isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)',
                              }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <span
                        className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase py-1 inline-block transition-colors focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-2 rounded"
                        style={{ color: isDark ? 'rgba(247, 247, 242, 0.9)' : 'rgba(0, 104, 56, 0.85)' }}
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
                )}
              </div>
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
              href="/concierge"
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
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
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
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors border-b"
                        style={{
                          color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(0, 104, 56, 0.7)',
                          borderColor: isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)',
                        }}
                      >
                        {item.name}
                        <ChevronDown
                          className="w-3 h-3 transition-transform duration-200"
                          style={{
                            transform: openDropdown === item.name ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </motion.button>

                      <AnimatePresence>
                        {openDropdown === item.name && item.children && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child, childIndex) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                                className="block pl-4 py-3 text-[0.65rem] font-medium tracking-[0.15em] uppercase transition-colors border-b last:border-b-0"
                                style={{
                                  color: isDark ? 'rgba(247, 247, 242, 0.6)' : 'rgba(0, 104, 56, 0.55)',
                                  borderColor: isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.04)',
                                }}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="block py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors border-b last:border-b-0"
                        style={{
                          color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(0, 104, 56, 0.7)',
                          borderColor: isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)',
                        }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  )}
                </div>
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
                  href="/concierge"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-5 py-2 text-[0.6rem] font-medium tracking-[0.15em] uppercase rounded-full"
                  style={{ color: '#FFFFFF', backgroundColor: '#006838', border: '1px solid rgba(212, 175, 55, 0.2)' }}
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
