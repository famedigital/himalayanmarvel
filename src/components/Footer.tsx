'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight, Heart, Globe, Star } from 'lucide-react';

const footerLinks = {
  explore: ['Tour Packages', 'Destinations', 'Experiences', 'Travel Guide'],
  company: ['About Us', 'Our Story', 'Careers', 'Press Kit'],
  support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'],
};

// Premium Custom SVG icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  { name: 'Facebook', icon: <FacebookIcon />, href: 'https://facebook.com/himalayanmarvels', color: 'hover:bg-blue-500/20' },
  { name: 'Instagram', icon: <InstagramIcon />, href: 'https://instagram.com/himalayanmarvels', color: 'hover:bg-pink-500/20' },
  { name: 'Twitter', icon: <TwitterIcon />, href: 'https://twitter.com/himalayanmarvels', color: 'hover:bg-white/10' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative dark:bg-black bg-neutral-900 overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))' }}
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.15))' }}
        />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Premium CTA Section */}
        <div className="container-premium py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative max-w-4xl mx-auto text-center"
          >
            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-rose-500/20 to-orange-500/20 rounded-3xl blur-3xl"
            />

            <div className="relative p-12 md:p-16 rounded-3xl dark:border border-white/10 border-white/10 overflow-hidden">
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                  background: [
                    'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)',
                    'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                  ],
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              />

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)',
                }}
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready for your{' '}
                <motion.span
                  className="gradient-text"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  Bhutan adventure?
                </motion.span>
              </h3>

              <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
                Let our experts craft your perfect journey through the mystical Kingdom of Bhutan.
              </p>

              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-full text-white font-semibold flex items-center gap-3 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ec4899)',
                    boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#tours"
                  className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                  <span>View Tours</span>
                  <Star className="w-5 h-5" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Premium Links Section */}
        <div className="container-premium py-16 dark:border-t border-t dark:border-white/5 border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="col-span-2"
            >
              <motion.div
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-xl font-bold gradient-text mb-4"
                style={{ backgroundSize: '200% 100%' }}
              >
                Himalayan Marvels
              </motion.div>

              <p className="dark:text-white/60 text-white/70 text-sm mb-6 leading-relaxed max-w-xs">
                Crafting transformative journeys through the mystical Kingdom of Bhutan since 2014.
              </p>

              {/* Social Links - Premium */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center dark:text-white/60 text-white/70 transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h5 className="dark:text-white/90 text-white font-medium mb-5 capitalize text-sm">
                  {title}
                </h5>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 3 }}
                        className="dark:text-white/50 text-white/70 hover:text-white transition-colors text-sm inline-block"
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

        {/* Premium Contact Info */}
        <div className="container-premium py-12 dark:border-t border-t dark:border-white/5 border-white/10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, text: '+975 77270465', label: 'Call Us', href: 'tel:+97577270465' },
              { icon: Mail, text: 'info@himalayanmarvels.com', label: 'Email', href: 'mailto:info@himalayanmarvels.com' },
              { icon: MapPin, text: 'Changbangdu, Thimphu 11001', label: 'Visit', href: '#' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-4 p-4 rounded-2xl dark:bg-white/5 bg-white/5 border dark:border-white/5 border-white/10 dark:hover:border-white/10 hover:border-white/20 transition-all group"
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(139, 92, 246, 0.2))',
                    }}
                  >
                    <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </motion.div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.text}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar - Premium */}
        <div className="container-premium py-8 dark:border-t border-t dark:border-white/5 border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/30 text-sm flex items-center gap-2"
            >
              © 2025 Himalayan Marvels. Crafted with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-flex"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </motion.span>
              {' '}in Bhutan.
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Terms
              </a>

              <motion.button
                onClick={scrollToTop}
                whileHover={{ y: -2 }}
                className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <span>Back to top</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <motion.div
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), transparent)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </footer>
  );
}
