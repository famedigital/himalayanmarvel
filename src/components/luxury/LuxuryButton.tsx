'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size?: 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: boolean;
}

/**
 * LuxuryButton — Premium CTA buttons with luxury interactions
 *
 * Variants:
 * - primary: Forest green with gold border (main conversions)
 * - secondary: Champagne gold (exploration)
 * - ghost: Transparent with underline (informational)
 * - whatsapp: WhatsApp-style for direct concierge access
 */
export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  onClick,
  href,
  icon = true,
}: ButtonProps) {
  const variants = {
    primary: 'bg-forest-green text-white border-champagne-gold/25 hover:shadow-[0_8px_32px_rgba(0,104,56,0.4)]',
    secondary: 'bg-champagne-gold text-dark-forest border-champagne-gold/30 hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)]',
    ghost: 'bg-transparent text-forest-green hover:text-champagne-gold underline underline-offset-4',
    whatsapp: 'bg-[#25D366] text-white border-white/20 hover:shadow-[0_8px_32px_rgba(37,211,102,0.4)]',
  };

  const sizes = {
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-sm',
    xl: 'px-12 py-5 text-base',
  };

  const buttonContent = (
    <>
      <span className="tracking-wider uppercase font-semibold">{children}</span>
      {icon && variant !== 'ghost' && (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
      {variant === 'whatsapp' && (
        <MessageCircle className="w-4 h-4" />
      )}
    </>
  );

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-3 rounded-full font-medium transition-all duration-300',
    'group',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ x: 4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={baseClasses}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={baseClasses}
    >
      {buttonContent}
    </motion.button>
  );
}
