'use client';

import { motion, type TargetAndTransition } from 'framer-motion';
import { type ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

function getVariants(direction: string): { hidden: TargetAndTransition; visible: TargetAndTransition } {
  switch (direction) {
    case 'left':
      return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
    case 'right':
      return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
    case 'fade':
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    default:
      return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
  }
}

export default function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className,
}: RevealOnScrollProps) {
  const variants = getVariants(direction);

  return (
    <motion.div
      initial={variants.hidden}
      whileInView={variants.visible}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
