'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="section-padding dark:bg-black bg-neutral-50 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 dark:opacity-20 opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] bg-gradient-to-r from-orange-500/30 via-rose-500/30 to-purple-500/30" />
      </div>

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs dark:text-white/30 text-neutral-500 uppercase tracking-[0.25em]">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-900 mt-4">
            Start your{' '}
            <span className="gradient-text">Bhutan journey</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-8">
              Let's plan your adventure
            </h3>

            {[
              {
                icon: Phone,
                text: '+975 77270465',
                label: 'Call us directly',
                href: 'tel:+97577270465',
              },
              {
                icon: Mail,
                text: 'info@himalayanmarvels.com',
                label: 'Send us an email',
                href: 'mailto:info@himalayanmarvels.com',
              },
              {
                icon: MapPin,
                text: 'Changbangdu, Thimphu, 11001',
                label: 'Visit our office',
                href: '#',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-5 rounded-2xl dark:bg-white/5 bg-white border dark:border-white/5 border-neutral-200 dark:hover:border-white/10 hover:border-neutral-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(139, 92, 246, 0.15))',
                  }}>
                    <Icon className="w-5 h-5 dark:text-white/70 text-neutral-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="dark:text-white text-neutral-900 font-medium">{item.text}</p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm dark:text-white/60 text-neutral-600 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl dark:bg-white/5 bg-white dark:border border-white/10 border-neutral-200 dark:text-white text-neutral-900 dark:placeholder:text-white/30 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm dark:text-white/60 text-neutral-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl dark:bg-white/5 bg-white dark:border border-white/10 border-neutral-200 dark:text-white text-neutral-900 dark:placeholder:text-white/30 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm dark:text-white/60 text-neutral-600 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                  placeholder="Tell us about your dream trip..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 rounded-full text-white font-semibold flex items-center justify-center gap-3 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                  boxShadow: '0 10px 40px rgba(249, 115, 22, 0.3)',
                }}
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
