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
      {/* Subtle background texture with Bhutanese colors */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #E8B923 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #8E261A 0%, transparent 70%)' }} />
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
              background: 'linear-gradient(135deg, #8E261A, #E8B923)',
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
            style={{ color: '#262626' }}
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
                <div className="rounded-2xl p-8 h-full transition-all duration-500 relative overflow-hidden border"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'rgba(232, 185, 35, 0.2)',
                  }}
                >
                  {/* Subtle gold border on hover */}
                  <div className="absolute inset-0 transition-all duration-700" style={{ border: '1px solid rgba(232, 185, 35, 0)' }} />
                  <div className="absolute inset-0 transition-all duration-700 group-hover:border group-hover:rounded-2xl" style={{ borderColor: '#E8B923' }} />

                  <div className="relative z-10">
                    {/* Icon - Bhutanese Red */}
                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: '#8E261A' }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#262626' }}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="leading-relaxed" style={{ color: 'rgba(38, 38, 38, 0.7)' }}>
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
