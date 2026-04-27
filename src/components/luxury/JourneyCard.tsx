'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface JourneyCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  badge?: string;
  highlights?: string[];
  scarcity?: string;
  price?: string;
  index: number;
}

/**
 * JourneyCard — Luxury journey card with editorial layout
 *
 * Key Changes from Original TourPackages:
 * - Portrait aspect ratio (3:4) not landscape (4:3)
 * - Full-bleed image with bottom gradient
 * - Exclusivity badge ("Exclusive", "Limited")
 * - Scarcity messaging ("Only 2 spots for October")
 * - Pricing hidden (reveals on hover)
 * - "Explore Experience" CTA (not "Plan My Journey")
 */
export function JourneyCard({
  title,
  subtitle,
  description,
  image,
  link,
  badge,
  highlights,
  scarcity,
  price,
  index,
}: JourneyCardProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -12 }}
      className="group relative h-full"
    >
      {/* Card Container — 3:4 Portrait Ratio */}
      <div
        className="relative rounded-3xl overflow-hidden h-full"
        style={{
          aspectRatio: '3/4',
          boxShadow: isDark
            ? '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.08)'
            : '0 24px 64px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.06)',
        }}
      >
        {/* Full-Bleed Image */}
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Exclusivity Badge — Top Right */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
            className="absolute top-6 right-6"
          >
            <div className="px-4 py-2 rounded-full backdrop-blur-md" style={{
              backgroundColor: 'rgba(212, 175, 55, 0.9)',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
            }}>
              <span className="text-xs uppercase tracking-wider font-semibold text-dark-forest">
                {badge}
              </span>
            </div>
          </motion.div>
        )}

        {/* Content — Bottom Aligned */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
            className="text-champagne-gold text-xs uppercase tracking-[0.25em] font-semibold mb-3"
          >
            {subtitle}
          </motion.p>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
            className="font-display text-display-card text-white mb-3 leading-tight"
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
            className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2"
          >
            {description}
          </motion.p>

          {/* Highlights — Mini list */}
          {highlights && highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
              className="space-y-1 mb-4"
            >
              {highlights.slice(0, 2).map((highlight, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-champagne-gold flex-shrink-0" />
                  <span className="text-xs text-white/60">{highlight}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Scarcity — NEW */}
          {scarcity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.7 }}
              className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <AlertCircle className="w-3 h-3 text-champagne-gold flex-shrink-0" />
              <span className="text-xs font-medium text-champagne-gold">
                {scarcity}
              </span>
            </motion.div>
          )}

          {/* CTA */}
          <motion.a
            href={link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.8 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold tracking-wide group-hover:text-champagne-gold transition-colors"
          >
            Explore Experience
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>

          {/* Pricing — Hidden, reveals on hover */}
          {price && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute top-6 left-6 px-4 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                backgroundColor: 'rgba(14, 20, 14, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <span className="text-xs font-semibold text-champagne-gold">{price}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
