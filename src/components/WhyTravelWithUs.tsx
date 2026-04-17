'use client';

import { motion } from 'framer-motion';
import { Mountain, Gem, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Mountain,
    title: 'Designed from within Bhutan',
    description: 'Authentic experiences crafted by locals who know every sacred path and hidden valley of the Kingdom.',
  },
  {
    icon: Gem,
    title: 'Private, curated journeys',
    description: 'Thoughtfully designed itineraries tailored to your intentions, with meticulous attention to every detail.',
  },
  {
    icon: Sparkles,
    title: 'Authentic cultural access',
    description: 'Deep spiritual connections to living traditions and sacred sites rarely accessible to visitors.',
  },
];

export default function WhyTravelWithUs() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ backgroundColor: '#F8F4F0' }}>
      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700/70 mb-4">
            The Difference
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6" style={{ color: '#262626' }}>
            Why Travel With Us
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(38, 38, 38, 0.65)' }}>
            We don&apos;t offer tours. We design journeys that transform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                    style={{ backgroundColor: '#8E261A' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-medium mb-4" style={{ color: '#262626' }}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="leading-relaxed" style={{ color: 'rgba(38, 38, 38, 0.6)' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
