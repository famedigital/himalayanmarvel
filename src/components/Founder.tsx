'use client';

import { motion } from 'framer-motion';

export default function Founder() {
  const credentials = [
    { label: 'Les Roches', detail: 'Spain' },
    { label: 'ICHM', detail: 'Australia' },
    { label: 'MBA', detail: 'Univ. of Canberra' },
  ];

  const brands = ['The Ritz-Carlton', 'Hyatt', 'Kempinski'];

  return (
    <section id="about" className="section-padding dark:bg-neutral-900 bg-white">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image - Clean Professional */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              {/* Subtle frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776275660/founder-portrait_pbo8m4.jpg"
                  alt="Bivatsu Giri"
                  className="w-full aspect-[4/5] object-cover"
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 dark:bg-gradient-to-t bg-gradient-to-t dark:from-black/40 from-neutral-900/30 to-transparent" />
              </div>

              {/* Experience badge - Minimal */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-xl dark:bg-neutral-900 bg-white dark:border border-white/10 border-neutral-200"
              >
                <p className="text-3xl font-bold gradient-text">12+</p>
                <p className="text-xs dark:text-white/50 text-neutral-600 uppercase tracking-wider">Years Experience</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content - Professional */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 lg:order-2"
          >
            {/* Label */}
            <span className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-[0.2em]">
              Founder & CEO
            </span>

            {/* Name - Clean */}
            <h2 className="text-5xl md:text-6xl font-bold dark:text-white text-neutral-900 mt-4 mb-2 tracking-tight">
              Bivatsu
            </h2>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              <span className="gradient-text">Giri</span>
            </h2>

            {/* Bio */}
            <p className="dark:text-white/70 text-neutral-700 text-lg leading-relaxed mb-6 max-w-md">
              A hospitality visionary whose professional DNA was forged in the world's most demanding luxury environments. After elite training at <strong>Les Roches (Spain)</strong> and <strong>International College of Hotel Management (Australia)</strong>, Bivatsu honed his craft within the leadership circles of global icons.
            </p>

            <p className="dark:text-white/70 text-neutral-700 text-lg leading-relaxed mb-8 max-w-md">
              With an MBA from the <strong>University of Canberra</strong> and over 12 years of specialized experience, Bivatsu ensures that every itinerary is a masterpiece of logistics and luxury.
            </p>

            {/* Credentials */}
            <div className="flex flex-wrap gap-3 mb-8">
              {credentials.map((cred, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="px-4 py-2 rounded-full dark:bg-white/5 bg-neutral-100 dark:border border-white/10 border-neutral-200"
                >
                  <p className="text-xs dark:text-white/80 text-neutral-700">
                    <span className="font-semibold">{cred.label}</span>
                    <span className="dark:text-white/50 text-neutral-500"> — {cred.detail}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Luxury Brands */}
            <div className="mb-8">
              <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mb-3">Leadership at</p>
              <div className="flex flex-wrap gap-4">
                {brands.map((brand, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-sm dark:text-white/70 text-neutral-700 font-medium"
                  >
                    {brand}
                    {index < brands.length - 1 && <span className="dark:text-white/30 text-neutral-400 mx-2">•</span>}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Stats - Clean */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '5,000+', label: 'Travelers' },
                { value: '50+', label: 'Tours' },
                { value: '4.9', label: 'Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
