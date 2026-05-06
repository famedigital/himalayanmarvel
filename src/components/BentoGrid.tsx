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
      className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-slate-950 via-neutral-900 to-slate-950"
    >
      <div className="container-luxury max-w-6xl mx-auto">
        {/* Compact header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-amber-500/20 bg-amber-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
              Journeys
            </span>
          </div>

          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
            Curated{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>

          <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto">
            Every path through the Kingdom is a story waiting to unfold.
          </p>
        </motion.div>

        {/* Compact bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {tours.map((tour, index) => {
            const isHero = index === 0;

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={isHero ? 'md:col-span-2 md:row-span-2' : ''}
              >
                <motion.a
                  href={tour.link}
                  className="group relative block w-full h-full min-h-[200px] md:min-h-[280px] rounded-xl md:rounded-2xl overflow-hidden"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                  </div>

                  {/* Content */}
                  <div className={`relative h-full flex flex-col justify-end p-4 md:p-6 ${isHero ? 'lg:p-8' : ''}`}>
                    {/* Badge */}
                    <div className="mb-2 md:mb-3">
                      <span className="inline-block px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.15em] rounded-full bg-emerald-600/90 backdrop-blur-sm text-white">
                        {tour.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-display font-bold text-white mb-1 md:mb-2 ${isHero ? 'text-xl md:text-3xl lg:text-4xl' : 'text-base md:text-xl lg:text-2xl'}`}>
                      {tour.title}
                    </h3>

                    {/* Description - hero only */}
                    {isHero && (
                      <p className="text-white/70 text-xs md:text-sm mb-3 md:mb-4 max-w-md leading-relaxed line-clamp-2">
                        {tour.description}
                      </p>
                    )}

                    {/* Price + Arrow */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-400 text-xs md:text-sm">
                        {tour.price}
                      </span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)',
                    }}
                  />
                </motion.a>
              </motion.div>
            );
          })}
          )}
        </div>
      </div>
    </section>
  );
}
