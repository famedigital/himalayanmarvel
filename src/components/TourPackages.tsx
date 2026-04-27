'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TourCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
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
    description: 'Discover ancient monasteries, sacred festivals, and timeless Bhutanese traditions in comfort.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    price: 'From $2,499',
    priceDetails: 'Per person, based on 2 travelers',
    badge: 'Recommended',
    highlights: [
      'Private monastery visits',
      'Festival access',
      'Local family dinner',
      'Traditional hot stone bath',
    ],
    availability: 'Limited spots for Spring Festival',
    link: '/tours',
  },
  {
    id: '2',
    title: 'Spiritual & Wellness Journeys',
    subtitle: '8-12 Days',
    description: 'Transformative experiences with meditation, hot stone baths, and private monastery visits.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    price: 'From $3,199',
    priceDetails: 'Per person, based on 2 travelers',
    highlights: [
      'Private meditation sessions',
      'Hot stone baths',
      'Monastery retreats',
      'Wellness consultations',
    ],
    link: '/tours',
  },
  {
    id: '3',
    title: 'Himalayan Treks & Expeditions',
    subtitle: '12-21 Days',
    description: 'Challenge yourself on legendary routes like Snowman Trek through remote Himalayan wilderness.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    price: 'From $4,499',
    priceDetails: 'Per person, based on 2 travelers',
    highlights: [
      'Snowman Trek route',
      'Professional guides',
      'Full camping support',
      'Altitude preparation',
    ],
    availability: 'Book early for permits',
    link: '/tours',
  },
];

export default function TourPackages() {
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
    <section id="tours" className="section-padding dark:bg-black bg-neutral-50">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="text-xs uppercase tracking-[0.25em] mb-4">
            Journeys
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mt-4">
            Choose Your{' '}
            <span className="gradient-text">Path to Bhutan</span>
          </h2>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -12 }}
              className="group"
            >
              <Card className="h-full overflow-hidden border-2 dark:border-white/10 border-neutral-200 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                  <div className="absolute inset-0 dark:bg-gradient-to-t bg-gradient-to-t dark:from-black/80 from-neutral-900/80 to-transparent" />
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  {/* Badge */}
                  {tour.badge && (
                    <div className="mb-3">
                      <span
                        className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #D4AF37 0%, #C9A227 100%)',
                          color: '#0E140E',
                        }}
                      >
                        {tour.badge}
                      </span>
                    </div>
                  )}

                  <Badge variant="secondary" className="text-xs uppercase tracking-wider mb-2">
                    {tour.subtitle}
                  </Badge>

                  <h3 className="text-xl font-semibold dark:text-white text-neutral-900 mt-2 mb-1">
                    {tour.title}
                  </h3>

                  <p className="text-sm dark:text-white/50 text-neutral-600 mb-4">
                    {tour.description}
                  </p>

                  {/* Highlights */}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {tour.highlights.slice(0, 3).map((highlight, index) => (
                        <li
                          key={index}
                          className="text-xs flex items-center gap-2"
                          style={{ color: 'rgba(247, 247, 242, 0.6)' }}
                        >
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: '#D4AF37' }}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Availability Notice */}
                  {tour.availability && (
                    <div className="mb-4">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          color: '#D4AF37',
                        }}
                      >
                        {tour.availability}
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="text-lg font-bold dark:text-white text-neutral-900 block">
                        {tour.price}
                      </span>
                      {tour.priceDetails && (
                        <span className="text-xs dark:text-white/40 text-neutral-500">
                          {tour.priceDetails}
                        </span>
                      )}
                    </div>
                    <a
                      href={tour.link}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: '#006838',
                      }}
                    >
                      Plan My {tour.title.split(' ')[0]} Journey
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
