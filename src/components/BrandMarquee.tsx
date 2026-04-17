'use client';

import { motion } from 'framer-motion';

const partners = [
  { name: 'Drukair Royal Bhutan Airlines', logo: 'Drukair', tagline: 'Royal Bhutan Airlines' },
  { name: 'Bhutan Airlines', logo: 'BA', tagline: 'Premium Carrier' },
  { name: 'Tourism Council of Bhutan', logo: 'TCB', tagline: 'Official Tourism Board' },
  { name: 'Association of Bhutanese Tour Operators', logo: 'ABTO', tagline: 'Tour Operator Association' },
  { name: 'Hotel & Restaurant Association of Bhutan', logo: 'HRAB', tagline: 'Hospitality Industry' },
];

export default function BrandMarquee() {
  return (
    <section className="py-20 dark:bg-black bg-white dark:border-y border-y dark:border-white/5 border-neutral-200">
      <div className="container-premium">
        {/* Header - Professional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs dark:text-white/30 text-neutral-500 uppercase tracking-[0.2em]">
            Our Trusted Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-neutral-900 mt-4">
            Licensed &amp; Certified by{' '}
            <span className="gradient-text">Bhutan&apos;s finest</span>
          </h2>
        </motion.div>

        {/* Partners Grid - Professional */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              {/* Logo */}
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center dark:border border-white/10 border-neutral-200 dark:group-hover:border-white/20 group-hover:border-neutral-300 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(139, 92, 246, 0.1))',
                }}
              >
                <span className="text-2xl font-bold gradient-text">
                  {partner.logo}
                </span>
              </motion.div>

              {/* Name */}
              <h3 className="dark:text-white text-neutral-900 font-medium text-sm mb-1">
                {partner.name}
              </h3>

              {/* Tagline */}
              <p className="dark:text-white/30 text-neutral-500 text-xs">
                {partner.tagline}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certification Badge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full dark:border border-white/10 border-neutral-200 dark:bg-black/50 bg-white shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="dark:text-white/60 text-neutral-700 text-sm">
              Licensed Tour Operator • Department of Tourism, Bhutan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
