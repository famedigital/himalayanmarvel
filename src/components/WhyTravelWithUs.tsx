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
    <section className="section-padding bg-stone-50 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, rgb(20 83 45), rgb(181 138 48))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why Travel With Us
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgb(71 85 105)' }}
          >
            We don&apos;t offer tours. We design journeys that transform.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/50 hover:border-amber-200/50 relative overflow-hidden">
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-transparent to-emerald-50/0 group-hover:from-amber-50/30 group-hover:to-emerald-50/20 transition-all duration-700" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        background: 'linear-gradient(135deg, rgb(20 83 45), rgb(34 107 57))',
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgb(71 85 105)' }}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="leading-relaxed" style={{ color: 'rgb(71 85 105 / 0.7)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
