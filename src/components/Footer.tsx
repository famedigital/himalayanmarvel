'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import RevealOnScroll from './ui/RevealOnScroll';

export type FooterContent = {
  companyName?: string;
  tagline?: string;
  copyright?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: Array<{ platform?: string; name?: string; url?: string; href?: string }>;
  quickLinks?: Array<{ label?: string; name?: string; href: string }>;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaQuote?: string;
  ctaEmail?: string;
};

const DEFAULT_FOOTER: Required<
  Pick<
    FooterContent,
    | 'companyName'
    | 'tagline'
    | 'copyright'
    | 'ctaEyebrow'
    | 'ctaTitle'
    | 'ctaBody'
    | 'ctaQuote'
  >
> & {
  contact: { email: string; phone: string; address: string };
  socialLinks: Array<{ name: string; href: string }>;
  explore: Array<{ name: string; href: string }>;
  company: Array<{ name: string; href: string }>;
  legal: Array<{ name: string; href: string }>;
} = {
  companyName: 'Himalayan Marvels',
  tagline: 'Crafting transformative journeys through the mystical Kingdom of Bhutan since 2014.',
  copyright: `© ${new Date().getFullYear()} Himalayan Marvels. Thimphu, Bhutan.`,
  contact: {
    email: 'info@himalayanmarvels.com',
    phone: '+975 77270465',
    address: 'Changbangdu, Thimphu 11001',
  },
  socialLinks: [
    { name: 'Instagram', href: 'https://www.instagram.com/himalayanmarvels.travel/' },
    { name: 'Facebook', href: 'https://www.facebook.com/himalayanmarvels/' },
  ],
  explore: [
    { name: 'Cultural Journeys', href: '/tours?type=cultural' },
    { name: 'Spiritual Journeys', href: '/tours?type=spiritual' },
    { name: 'Himalayan Treks & Expeditions', href: '/tours?type=trek' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Concierge Service', href: '/concierge' },
    { name: 'Journal', href: '/blog' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  ctaEyebrow: 'Design Your Journey',
  ctaTitle: 'Let us craft your Bhutan story',
  ctaBody:
    "Every journey begins with a conversation. Share your vision, and we'll design an experience tailored to your intentions.",
  ctaQuote: '"Happiness is a place" — Bhutanese proverb',
};

interface FooterProps {
  content?: FooterContent | null;
}

export default function Footer({ content }: FooterProps) {
  const companyName = content?.companyName || DEFAULT_FOOTER.companyName;
  const tagline = content?.tagline || DEFAULT_FOOTER.tagline;
  const copyright = content?.copyright || DEFAULT_FOOTER.copyright;
  const contact = {
    email: content?.contact?.email || DEFAULT_FOOTER.contact.email,
    phone: content?.contact?.phone || DEFAULT_FOOTER.contact.phone,
    address: content?.contact?.address || DEFAULT_FOOTER.contact.address,
  };
  const socialLinks =
    content?.socialLinks?.map((s) => ({
      name: s.name || s.platform || 'Social',
      href: s.href || s.url || '#',
    })) || DEFAULT_FOOTER.socialLinks;

  const quickFromCms = content?.quickLinks?.map((l) => ({
    name: l.label || l.name || 'Link',
    href: l.href,
  }));

  const footerLinks = {
    explore: DEFAULT_FOOTER.explore,
    company: quickFromCms?.length ? quickFromCms : DEFAULT_FOOTER.company,
    legal: DEFAULT_FOOTER.legal,
  };

  const ctaEyebrow = content?.ctaEyebrow || DEFAULT_FOOTER.ctaEyebrow;
  const ctaTitle = content?.ctaTitle || DEFAULT_FOOTER.ctaTitle;
  const ctaBody = content?.ctaBody || DEFAULT_FOOTER.ctaBody;
  const ctaQuote = content?.ctaQuote || DEFAULT_FOOTER.ctaQuote;
  const ctaEmail = content?.ctaEmail || contact.email;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#0A120A' }}>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10">
        <div className="container-premium py-32">
          <RevealOnScroll className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: '#D4AF37' }}
            >
              {ctaEyebrow}
            </p>
            <h3
              className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {ctaTitle}
            </h3>
            <p className="text-stone-300 text-xl leading-relaxed mb-4 max-w-xl mx-auto">
              {ctaBody}
            </p>
            <p
              className="text-sm italic mb-10"
              style={{ color: 'rgba(212, 175, 55, 0.35)', fontFamily: 'var(--font-playfair)' }}
            >
              {ctaQuote}
            </p>
            <motion.a
              href={`mailto:${ctaEmail}`}
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

        <div className="container-premium py-20" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            <RevealOnScroll className="col-span-2">
              <p
                className="text-xl font-light text-white mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {companyName}
              </p>
              <p className="text-stone-400 text-base mb-6 leading-relaxed max-w-xs">
                {tagline}
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

            {Object.entries(footerLinks).map(([title, links], index) => (
              <RevealOnScroll key={title} delay={index * 0.1}>
                <p className="text-white font-medium mb-5 capitalize text-sm tracking-wide">
                  {title === 'legal' ? 'Legal' : title}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 2 }}
                        className="text-stone-400 hover:text-[#D4AF37] transition-colors text-base inline-block"
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="container-premium py-16" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Phone, text: contact.phone, label: 'Phone', href: `tel:${contact.phone.replace(/\s/g, '')}` },
              { icon: Mail, text: contact.email, label: 'Email', href: `mailto:${contact.email}` },
              { icon: MapPin, text: contact.address, label: 'Location', href: '#' },
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

        <div className="container-premium py-8" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-400 text-sm">{copyright}</p>
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

      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)' }} />
    </footer>
  );
}
