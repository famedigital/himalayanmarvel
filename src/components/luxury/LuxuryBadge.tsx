'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'forest' | 'exclusive' | 'trust';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LuxuryBadge — Premium badge component for trust signals and exclusivity
 *
 * Variants:
 * - gold: Champagne gold accent (default)
 * - forest: Forest green primary
 * - exclusive: Gradient gold with glow
 * - trust: Subtle outline style
 */
export function LuxuryBadge({
  children,
  variant = 'gold',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    gold: 'bg-champagne-gold/10 text-champagne-gold border-champagne-gold/20',
    forest: 'bg-forest-green/10 text-forest-green border-forest-green/20',
    exclusive: 'bg-gradient-to-r from-champagne-gold/20 to-champagne-gold/5 text-champagne-gold border-champagne-gold/30 shadow-lg',
    trust: 'bg-transparent text-white/60 border-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border uppercase tracking-wider font-semibold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {variant === 'exclusive' && (
        <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold animate-pulse" />
      )}
      {children}
    </motion.div>
  );
}
