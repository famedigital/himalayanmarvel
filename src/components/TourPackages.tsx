'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const tours = [
  {
    id: 1,
    title: 'Cultural Heartland',
    subtitle: '7 Days',
    description: 'Ancient monasteries and sacred festivals.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    price: '$2,499',
  },
  {
    id: 2,
    title: 'Trekking Adventure',
    subtitle: '12 Days',
    description: 'Pristine Himalayan landscapes.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    price: '$3,999',
  },
  {
    id: 3,
    title: 'Photography Expedition',
    subtitle: '10 Days',
    description: 'Capturing Bhutan\'s hidden gems.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    price: '$3,499',
  },
];

export default function TourPackages() {
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
          <span className="text-xs dark:text-white/30 text-neutral-500 uppercase tracking-[0.25em]">
            Our Experiences
          </span>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mt-4">
            Which tour is{' '}
            <span className="gradient-text">right for you?</span>
          </h2>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <motion.a
              key={tour.id}
              href="#"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -12 }}
              className="group relative rounded-3xl overflow-hidden dark:bg-white/5 bg-white border dark:border-white/10 border-neutral-200 dark:hover:border-white/20 hover:border-neutral-300 transition-all duration-500 shadow-lg hover:shadow-2xl"
            >
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
              <div className="p-6">
                <span className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider">
                  {tour.subtitle}
                </span>
                <h3 className="text-xl font-semibold dark:text-white text-neutral-900 mt-2 mb-1">
                  {tour.title}
                </h3>
                <p className="text-sm dark:text-white/50 text-neutral-600 mb-4">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between pt-4 dark:border-t border-t dark:border-white/10 border-neutral-200">
                  <span className="text-lg font-bold dark:text-white text-neutral-900">
                    {tour.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm dark:text-white/50 text-neutral-600 dark:group-hover:text-white group-hover:text-neutral-900 transition-colors">
                    Learn more
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
