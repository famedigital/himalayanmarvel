'use client';

import { motion } from 'framer-motion';
import { JourneyCard } from '@/components/luxury/JourneyCard';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TourCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price?: string;
  priceDetails?: string;
  badge?: string;
  highlights?: string[];
  availability?: string;
  link: string;
}

const defaultTours: TourCategory[] = [
  {
    id: '1',
    title: 'Cultural Journeys',
    subtitle: '7-14 Days',
    description: 'Private monastery visits, festival access, and authentic Bhutanese family experiences.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    price: 'From $5,997',
    badge: 'Exclusive',
    highlights: [
      'Private monastery visits',
      'Festival access',
      'Local family dinner',
      'Traditional hot stone bath',
    ],
    availability: 'Only 2 spots for October departure',
    link: '/tours?type=cultural',
  },
  {
    id: '2',
    title: 'Spiritual & Wellness',
    subtitle: '8-12 Days',
    description: 'Transformative meditation retreats, hot stone baths, and private monastery sessions.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    price: 'From $7,497',
    badge: 'Limited',
    highlights: [
      'Private meditation sessions',
      'Hot stone baths',
      'Monastery retreats',
      'Wellness consultations',
    ],
    availability: 'Limited to 6 journeys annually',
    link: '/tours?type=spiritual',
  },
  {
    id: '3',
    title: 'Himalayan Expeditions',
    subtitle: '12-21 Days',
    description: 'Legendary Snowman Trek through remote Himalayan wilderness with full support.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    price: 'From $9,997',
    badge: 'Exclusive',
    highlights: [
      'Snowman Trek route',
      'Professional guides',
      'Full camping support',
      'Altitude preparation',
    ],
    availability: 'Book early for permits',
    link: '/tours?type=trek',
  },
];

/**
 * JourneyCards — Luxury journey showcase
 * Replaces TourPackages with editorial, magazine-style presentation
 */
export default function JourneyCards() {
  const [tours, setTours] = useState<TourCategory[]>(defaultTours);
  const [loading, setLoading] = useState(true);

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
    <section id="journeys" className="section-luxury dark:bg-black bg-neutral-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dark:bg-black bg-neutral-50" />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-champagne-gold" />
            <span className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-semibold">
              Curated Experiences
            </span>
            <div className="w-12 h-px bg-champagne-gold" />
          </div>

          <h2 className="font-display text-display-section dark:text-white text-neutral-900 mb-6">
            Signature{' '}
            <span className="gradient-text">Private Journeys</span>
          </h2>

          <p className="text-lg dark:text-white/60 text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
            Each journey is privately curated — not a group tour, but a transformative experience
            designed exclusively for you.
          </p>
        </motion.div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {tours.map((tour, index) => (
            <JourneyCard
              key={tour.id}
              title={tour.title}
              subtitle={tour.subtitle}
              description={tour.description}
              image={tour.image}
              link={tour.link}
              badge={tour.badge}
              highlights={tour.highlights}
              scarcity={tour.availability}
              price={tour.price}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
