'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import RevealOnScroll from './ui/RevealOnScroll';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const contactDetails = [
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
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? '#0A120A' : '#F7F7F2',
        }}
      />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 104, 56, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container-premium relative z-10">
        {/* Header */}
        <RevealOnScroll className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: '#D4AF37' }}
            />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Begin Your Journey
            </span>
            <div
              className="w-8 h-px"
              style={{ backgroundColor: '#D4AF37' }}
            />
          </div>
          <h2
            className="text-4xl md:text-6xl font-light mb-6"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Craft Your{' '}
            <em style={{ color: '#D4AF37' }}>Sacred</em>
            <br />
            Himalayan Experience
          </h2>
          <p
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.45)' }}
          >
            Every journey begins with a conversation. Share your vision, and we&apos;ll design an experience beyond imagination.
          </p>
        </RevealOnScroll>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left: Contact Info & Editorial */}
          <div className="lg:col-span-2 space-y-6">
            <RevealOnScroll direction="left">
              {/* Editorial card */}
              <div
                className="rounded-2xl p-8 mb-6"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Compass
                  className="w-5 h-5 mb-6"
                  style={{ color: '#D4AF37' }}
                />
                <p
                  className="text-lg md:text-xl font-light leading-relaxed mb-6 italic"
                  style={{
                    color: isDark ? 'rgba(247, 247, 242, 0.75)' : 'rgba(26, 26, 26, 0.7)',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  &ldquo;We don&apos;t sell tours. We curate transformative encounters with a kingdom that measures wealth in happiness.&rdquo;
                </p>
                <div
                  className="w-12 h-px mb-4"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }}
                />
                <p
                  className="text-xs tracking-[0.15em] uppercase font-semibold"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.35)' }}
                >
                  Himalayan Marvels Team
                </p>
              </div>
            </RevealOnScroll>

            {/* Contact details */}
            <div className="space-y-3">
              {contactDetails.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll key={index} direction="left" delay={0.1 * (index + 1)}>
                    <motion.a
                      href={item.href}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4 p-4 rounded-xl group cursor-pointer transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(255, 255, 255, 0.6)';
                        (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          backgroundColor: isDark ? 'rgba(0, 104, 56, 0.12)' : 'rgba(0, 104, 56, 0.08)',
                        }}
                      >
                        <Icon
                          className="w-4 h-4 transition-colors"
                          style={{ color: '#006838' }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[0.6rem] uppercase tracking-[0.2em] mb-0.5"
                          style={{ color: isDark ? 'rgba(247, 247, 242, 0.3)' : 'rgba(26, 26, 26, 0.3)' }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: isDark ? 'rgba(247, 247, 242, 0.85)' : 'rgba(26, 26, 26, 0.8)' }}
                        >
                          {item.text}
                        </p>
                      </div>
                    </motion.a>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* Response time badge */}
            <RevealOnScroll direction="left" delay={0.4}>
              <div
                className="flex items-center gap-3 pt-4"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#006838', boxShadow: '0 0 8px rgba(0, 104, 56, 0.4)' }}
                />
                <span
                  className="text-[0.65rem] tracking-[0.15em] uppercase font-semibold"
                  style={{ color: isDark ? 'rgba(247, 247, 242, 0.35)' : 'rgba(26, 26, 26, 0.3)' }}
                >
                  Typically responds within 4 hours
                </span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <RevealOnScroll direction="right">
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{
                  backgroundColor: isDark ? 'rgba(20, 28, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: isDark
                    ? '0 24px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(247, 247, 242, 0.03)'
                    : '0 24px 64px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase block"
                      style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.35)' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full bg-transparent outline-none text-sm md:text-base py-3 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)',
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#D4AF37';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)';
                      }}
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase block"
                      style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.35)' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-transparent outline-none text-sm md:text-base py-3 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)',
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#D4AF37';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)';
                      }}
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase block"
                      style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.35)' }}
                    >
                      Your Vision
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      placeholder="Describe your dream Himalayan experience..."
                      required
                      className="w-full bg-transparent outline-none text-sm md:text-base py-3 border-b resize-none transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)',
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = '#D4AF37';
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.1)';
                      }}
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{
                        scale: 1.01,
                        boxShadow: '0 12px 40px rgba(0, 104, 56, 0.35)',
                      }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 rounded-full text-white text-[0.7rem] font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all cursor-pointer"
                      style={{
                        backgroundColor: '#006838',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                      }}
                    >
                      <span>Begin the Conversation</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Privacy note */}
                  <p
                    className="text-center text-[0.6rem] tracking-wider pt-2"
                    style={{ color: isDark ? 'rgba(247, 247, 242, 0.2)' : 'rgba(26, 26, 26, 0.2)' }}
                  >
                    Your information is held in the strictest confidence
                  </p>
                </form>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
