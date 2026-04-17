'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  explore: ['Tour Packages', 'Destinations', 'Experiences', 'Travel Guide'],
  company: ['About Us', 'Our Story', 'Careers', 'Press Kit'],
  support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/himalayanmarvels' },
  { name: 'Facebook', href: 'https://facebook.com/himalayanmarvels' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/himalayanmarvels' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-stone-950 overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(#E8B923 1px, transparent 1px), linear-gradient(90deg, #E8B923 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Refined CTA Section */}
        <div className="container-premium py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500/80 mb-6">
              Begin Your Journey
            </p>
            <h3 className="text-4xl md:text-5xl font-semibold text-stone-100 mb-6 tracking-tight">
              Let us craft your Bhutan story
            </h3>
            <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Every journey begins with a conversation. Share your vision, and we'll design an experience tailored to your intentions.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-stone-100 text-sm font-medium tracking-wide transition-all border border-stone-700/50 hover:border-stone-600 hover:bg-stone-900/50"
            >
              Start a conversation
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>

        {/* Links Section */}
        <div className="container-premium py-20 border-t border-stone-800/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-2"
            >
              <p className="text-lg font-semibold text-stone-100 mb-4 tracking-tight">
                Himalayan Marvels
              </p>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed max-w-xs">
                Crafting transformative journeys through the mystical Kingdom of Bhutan since 2014.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                  >
                    {social.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <p className="text-stone-400 font-medium mb-5 capitalize text-xs tracking-wide">
                  {title}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 2 }}
                        className="text-stone-500 hover:text-stone-300 transition-colors text-sm inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="container-premium py-16 border-t border-stone-800/50">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Phone, text: '+975 77270465', label: 'Phone', href: 'tel:+97577270465' },
              { icon: Mail, text: 'info@himalayanmarvels.com', label: 'Email', href: 'mailto:info@himalayanmarvels.com' },
              { icon: MapPin, text: 'Changbangdu, Thimphu 11001', label: 'Location', href: '#' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-4 group"
                >
                  <Icon className="w-4 h-4 text-stone-600 group-hover:text-amber-500/80 transition-colors" />
                  <div>
                    <p className="text-xs text-stone-600 uppercase tracking-wider">{item.label}</p>
                    <p className="text-stone-400 text-sm group-hover:text-stone-300 transition-colors">{item.text}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container-premium py-8 border-t border-stone-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-sm">
              © 2026 Himalayan Marvels. Thimphu, Bhutan.
            </p>
            <motion.a
              href="https://famedigital.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              className="text-stone-600 hover:text-amber-500/80 text-sm transition-colors"
            >
              design by famedigital
            </motion.a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              className="text-stone-600 hover:text-stone-400 text-sm flex items-center gap-2 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </footer>
  );
}
