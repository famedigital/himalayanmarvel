'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Do I need a visa to visit Bhutan?',
    answer: 'Yes, all international tourists require a visa to enter Bhutan. We handle all visa processing as part of our tour packages. The visa is pre-processed and you will receive a clearance letter before travel.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    question: 'What is the daily tariff in Bhutan?',
    answer: 'Bhutan has a Daily Sustainable Development Fee (SDF) of $100 per person per night for guests from countries other than India and Bangladesh. This fee covers your accommodation, meals, licensed tour guide, internal transportation, and camping equipment if needed.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    question: 'When is the best time to visit Bhutan?',
    answer: 'The best times to visit are spring (March-May) and autumn (September-November). These seasons offer clear skies, pleasant temperatures, and vibrant festivals. The spring months bring blooming rhododendrons, while autumn offers stunning mountain views.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    question: 'How do I reach Bhutan?',
    answer: 'You can fly to Paro International Airport via Drukair (Royal Bhutan Airlines) or Bhutan Airlines from several connecting cities including Bangkok, Singapore, Kathmandu, Delhi, and Kolkata. Alternatively, you can enter overland through Phuentsholing from India.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    question: 'Can I customize my itinerary?',
    answer: 'Absolutely! All our tour packages can be tailored to your preferences. Whether you want to focus on cultural sites, trekking adventures, photography, or spiritual experiences, we create personalized itineraries that match your interests.',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding dark:bg-black bg-neutral-50 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 dark:opacity-30 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 dark:bg-gradient-to-r bg-gradient-to-r dark:from-amber-500/20 from-amber-400/30 dark:to-orange-500/20 to-orange-400/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 dark:bg-gradient-to-r bg-gradient-to-r dark:from-violet-500/20 from-violet-400/30 dark:to-purple-500/20 to-purple-400/30 rounded-full blur-[150px]" />
      </div>

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs dark:text-white/30 text-neutral-500 uppercase tracking-[0.25em]">
            Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mt-4">
            Frequently{' '}
            <span className="gradient-text">asked</span>
          </h2>
        </motion.div>

        {/* FAQ Items - Premium Luxury Feel with Heavy Smooth Animations */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="relative mb-4"
              >
                {/* Premium glow on hover/open */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`absolute -inset-1 rounded-3xl blur-xl`}
                      style={{
                        background: `linear-gradient(135deg, ${faq.gradient.split('-')[1].split(' ')[0]}30, ${faq.gradient.split('-')[2]}30)`,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Card */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden dark:bg-white/5 bg-white border dark:border-white/5 border-neutral-200 shadow-sm hover:shadow-xl transition-shadow duration-500"
                  animate={{
                    borderColor: isOpen ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Gradient accent line */}
                  <motion.div
                    className={`absolute left-0 top-0 bottom-0 w-1 dark:bg-gradient-to-b bg-gradient-to-b ${faq.gradient}`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isOpen ? 1 : 0.4 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ transformOrigin: 'top' }}
                  />

                  {/* Question */}
                  <button
                    className="w-full py-6 px-6 md:px-8 flex items-center justify-between text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span
                      className={`text-base md:text-lg pr-8 transition-all duration-500 ${
                        isOpen ? 'dark:text-white text-neutral-900 font-medium' : 'dark:text-white/60 text-neutral-700'
                      }`}
                    >
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                        isOpen ? 'dark:bg-white/20 bg-neutral-200' : 'dark:bg-white/5 bg-neutral-100'
                      }`}
                    >
                      <Plus className="w-5 h-5 dark:text-white/60 text-neutral-600" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.4, delay: 0.1 }
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                          className="pb-6 px-6 md:px-8"
                        >
                          <div className="p-4 md:p-5 rounded-xl dark:bg-white/5 bg-neutral-50 dark:border border-white/10 border-neutral-200">
                            <p className="dark:text-white/70 text-neutral-700 leading-relaxed text-sm md:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mt-16"
        >
          <p className="dark:text-white/40 text-neutral-600 mb-6 text-sm">Still have questions?</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full dark:bg-white bg-neutral-900 dark:text-black text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Contact our team
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
