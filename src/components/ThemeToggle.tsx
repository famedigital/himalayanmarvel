'use client';

import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force theme check
    const isDark = document.documentElement.classList.contains('dark');
    console.log('Current theme state:', { theme, resolvedTheme, isDark });
  }, [theme, resolvedTheme]);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10" />
    );
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    console.log('Switching theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" />
          ) : (
            <Sun className="w-4 h-4 text-neutral-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(139, 92, 246, 0.3))'
            : 'linear-gradient(135deg, rgba(249, 115, 22, 0.4), rgba(139, 92, 246, 0.4))',
        }}
      />
    </motion.button>
  );
}
