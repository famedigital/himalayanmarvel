'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import RevealOnScroll from './ui/RevealOnScroll';

interface TourCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  link: string;
}

const defaultTours: TourCategory[] = [
  {
    id: '1',
    title: 'Cultural Journeys',
    subtitle: '7-14 Days',
    description: 'Discover ancient monasteries, sacred festivals, and timeless Bhutanese traditions in comfort.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    price: 'From $2,499',
    link: '/tours',
  },
  {
    id: '2',
    title: 'Spiritual & Wellness',
    subtitle: '8-12 Days',
    description: 'Transformative experiences with meditation, hot stone baths, and private monastery visits.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    price: 'From $3,199',
    link: '/tours',
  },
  {
    id: '3',
    title: 'Himalayan Treks',
    subtitle: '12-21 Days',
    description: 'Challenge yourself on legendary routes like Snowman Trek through remote Himalayan wilderness.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    price: 'From $4,499',
    link: '/tours',
  },
];

export default function BentoGrid() {
  const [tours, setTours] = useState<TourCategory[]>(defaultTours);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'tour_categories')
        .single();

      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        setTours(data.value);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <section
      id="tours"
      className="section-padding"
      style={{ backgroundColor: isDark ? '#0E140E' : '#F7F7F2' }}
    >
      <div className="container-premium">
        {/* Section Header */}
        <RevealOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Journeys
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Curated{' '}
            <span className="gradient-text">Destinations</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: isDark ? 'rgba(247,247,242,0.45)' : 'rgba(26,26,26,0.5)' }}
          >
            Every path through the Kingdom is a story waiting to unfold.
          </p>
        </RevealOnScroll>

        {/* Bento Grid - horizontal scroll on mobile, grid on desktop */}
        <div className="scroll-snap-x flex md:grid md:grid-cols-3 md:auto-rows-[minmax(280px,auto)] gap-4 -mx-4 md:mx-0 px-4 md:px-0 pb-4 md:pb-0">
          {tours.map((tour, index) => {
            const isHero = index === 0;
            const isWide = index === 1 && tours.length > 2;

            return (
              <RevealOnScroll
                key={tour.id}
                delay={index * 0.1}
                className={`
                  flex-shrink-0 w-[85vw] md:w-auto
                  ${isHero ? 'md:col-span-2 md:row-span-2' : ''}
                  ${isWide ? 'md:col-span-1' : ''}
                  snap-start
                `}
              >
                <motion.a
                  href={tour.link}
                  className="group relative block w-full h-full min-h-[240px] md:min-h-[280px] rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.08)',
                  }}
                >
                  {/* Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover img-editorial transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className={`relative h-full flex flex-col justify-end ${isHero ? 'p-8 md:p-10' : 'p-6'}`}>
                    {/* Badge */}
                    <div className="mb-3">
                      <span
                        className="inline-block px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] rounded-full"
                        style={{
                          backgroundColor: 'rgba(0, 104, 56, 0.8)',
                          color: '#F7F7F2',
                        }}
                      >
                        {tour.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-medium text-white mb-2 ${isHero ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl'}`}
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {tour.title}
                    </h3>

                    {/* Description */}
                    {isHero && (
                      <p className="text-white/60 text-sm md:text-base mb-4 max-w-lg leading-relaxed">
                        {tour.description}
                      </p>
                    )}

                    {/* Price + Arrow */}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="font-semibold text-sm md:text-base"
                        style={{ color: '#D4AF37' }}
                      >
                        {tour.price}
                      </span>
                      <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                        style={{ backgroundColor: 'rgba(0, 104, 56, 0.8)' }}
                        whileHover={{ backgroundColor: '#006838' }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover border accent */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    style={{
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 104, 56, 0.15)',
                    }}
                  />
                </motion.a>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
