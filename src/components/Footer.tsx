'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import RevealOnScroll from './ui/RevealOnScroll';

const footerLinks = {
  explore: ['Tour Packages', 'Destinations', 'Experiences', 'Travel Guide'],
  company: ['About Us', 'Our Story', 'Careers', 'Press Kit'],
  support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/himalayanmarvels.travel/' },
  { name: 'Facebook', href: 'https://www.facebook.com/himalayanmarvels/' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#0A120A' }}>
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* CTA Section */}
        <div className="container-premium py-32">
          <RevealOnScroll className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: '#D4AF37' }}
            >
              Begin Your Journey
            </p>
            <h3
              className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Let us craft your Bhutan story
            </h3>
            <p className="text-stone-300 text-xl leading-relaxed mb-4 max-w-xl mx-auto">
              Every journey begins with a conversation. Share your vision, and we&apos;ll design an experience tailored to your intentions.
            </p>
            <p
              className="text-sm italic mb-10"
              style={{ color: 'rgba(212, 175, 55, 0.35)', fontFamily: 'var(--font-playfair)' }}
            >
              &ldquo;Happiness is a place&rdquo; &mdash; Bhutanese proverb
            </p>
            <motion.a
              href="#contact"
              whileHover={{ y: -2, borderColor: 'rgba(212, 175, 55, 0.5)', backgroundColor: 'rgba(0, 104, 56, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-medium tracking-wide transition-all"
              style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}
            >
              Start a conversation
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </RevealOnScroll>
        </div>

        {/* Links Section */}
        <div className="container-premium py-20" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand Column */}
            <RevealOnScroll className="col-span-2">
              <p
                className="text-xl font-light text-white mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Himalayan Marvels
              </p>
              <p className="text-stone-400 text-base mb-6 leading-relaxed max-w-xs">
                Crafting transformative journeys through the mystical Kingdom of Bhutan since 2014.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-stone-400 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {social.name}
                  </motion.a>
                ))}
              </div>
            </RevealOnScroll>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links], index) => (
              <RevealOnScroll key={title} delay={index * 0.1}>
                <p className="text-white font-medium mb-5 capitalize text-sm tracking-wide">
                  {title}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 2 }}
                        className="text-stone-400 hover:text-[#D4AF37] transition-colors text-base inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="container-premium py-16" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Phone, text: '+975 77270465', label: 'Phone', href: 'tel:+97577270465' },
              { icon: Mail, text: 'info@himalayanmarvels.com', label: 'Email', href: 'mailto:info@himalayanmarvels.com' },
              { icon: MapPin, text: 'Changbangdu, Thimphu 11001', label: 'Location', href: '#' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={index} delay={index * 0.1}>
                  <motion.a
                    href={item.href}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-4 group"
                  >
                    <Icon className="w-5 h-5 text-stone-500 group-hover:text-[#D4AF37] transition-colors" />
                    <div>
                      <p className="text-sm text-stone-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-stone-300 text-base group-hover:text-white transition-colors">{item.text}</p>
                    </div>
                  </motion.a>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container-premium py-8" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-400 text-sm">
              &copy; 2026 Himalayan Marvels. Thimphu, Bhutan.
            </p>
            <motion.a
              href="https://famedigital.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              className="text-stone-400 hover:text-[#D4AF37] text-sm transition-colors"
            >
              design by famedigital
            </motion.a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              className="text-stone-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)' }} />
    </footer>
  );
}
