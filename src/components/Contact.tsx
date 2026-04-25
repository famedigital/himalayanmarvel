'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
          <Badge variant="outline" className="text-xs uppercase tracking-[0.25em] mb-4">
            Get in Touch
          </Badge>
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
              Let&apos;s plan your adventure
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
                  className="block"
                >
                  <Card className="flex items-start gap-4 p-5 border-2 dark:border-white/5 border-neutral-200 dark:hover:border-white/10 hover:border-neutral-300 transition-all group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500/15 to-purple-500/15">
                      <Icon className="w-5 h-5 dark:text-white/70 text-neutral-700 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="dark:text-white text-neutral-900 font-medium">{item.text}</p>
                    </div>
                  </Card>
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
            <Card className="p-6 dark:bg-white/5 bg-white dark:border-white/10 border-neutral-200">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Tell us about your dream trip..."
                    required
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-xl shadow-orange-500/30"
                  >
                    <span>Send Message</span>
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
