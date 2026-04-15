'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Sarah & James Mitchell',
    location: 'Sydney, Australia',
    text: 'The Menchu hot stone bath experience was exactly what our exhausted souls needed. Bivatsu and his team crafted a journey that felt like a true recalibration of our nervous system. This is quiet luxury at its finest.',
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    location: 'Mumbai, India',
    text: 'The 9-day Spiritual & Meditation Tour transformed me. Private sessions with high-ranking lamas and the serenity of Phobjikha Valley—Bhutan truly touched my soul like nowhere else. The service standards rival any five-star property.',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    text: 'From the private festival viewing to the Snowman Trek preparation, every detail was flawless. The anticipatory service here reminds me of The Ritz-Carlton, but with Himalayan soul. Already planning my return.',
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="section-padding dark:bg-gradient-to-b bg-gradient-to-b dark:from-black from-neutral-100 dark:to-neutral-950 to-neutral-200">
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
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mt-4">
            What our{' '}
            <span className="gradient-text">travelers say</span>
          </h2>
        </motion.div>

        {/* Review Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 100 : -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="text-center p-8 md:p-12 rounded-3xl dark:bg-white/5 bg-white border dark:border-white/10 border-neutral-200 shadow-2xl backdrop-blur-sm">
                <Quote className="w-10 h-10 dark:text-white/30 text-neutral-400 mx-auto mb-6" />

                <p className="text-xl md:text-2xl dark:text-white/90 text-neutral-700 leading-relaxed mb-8">
                  {reviews[currentIndex].text}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="dark:text-white text-neutral-900 font-medium">{reviews[currentIndex].name}</p>
                <p className="dark:text-white/60 text-neutral-600 text-sm">{reviews[currentIndex].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="w-10 h-10 rounded-full dark:border border-white/10 border-neutral-300 flex items-center justify-center dark:hover:bg-white/5 hover:bg-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 dark:text-white/70 text-neutral-700" />
            </motion.button>

            <div className="flex items-center gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 dark:bg-white bg-neutral-900'
                      : 'w-2 dark:bg-white/20 bg-neutral-300 dark:hover:bg-white/40 hover:bg-neutral-500'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 rounded-full dark:border border-white/10 border-neutral-300 flex items-center justify-center dark:hover:bg-white/5 hover:bg-neutral-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 dark:text-white/70 text-neutral-700" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[
            { value: '12+', label: 'Years Excellence' },
            { value: '4.9', label: 'Avg. Rating' },
            { value: '100%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs dark:text-white/60 text-neutral-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
