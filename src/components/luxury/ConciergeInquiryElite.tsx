'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { LuxuryButton } from './LuxuryButton';

/**
 * ConciergeInquiryElite — Premium concierge inquiry system
 *
 * Addresses ChatGPT's feedback: "CTA language is too generic"
 * "Contact Us" → "Speak With Our Travel Concierge"
 * Reduced to 3 fields for higher conversion
 */
export function ConciergeInquiryElite() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    travelers: '',
    passportCountry: '',
    travelMonth: '',
    vision: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Concierge inquiry:', formData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', whatsapp: '', travelers: '', passportCountry: '', travelMonth: '', vision: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="section-luxury relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-alabaster" style={{ backgroundColor: isDark ? '#0E140E' : undefined }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 104, 56, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT: Concierge Message */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-champagne-gold" />
              <span className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-semibold">
                Your Personal Concierge
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-display-section mb-6" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
              Speak With Our{' '}
              <span className="gradient-text">Travel Concierge</span>
            </h2>

            {/* Message */}
            <p className="text-lg leading-relaxed mb-8" style={{ color: isDark ? 'rgba(247, 247, 242, 0.7)' : 'rgba(26, 26, 26, 0.7)' }}>
              Every journey begins with a conversation, not a form. Share your vision,
              and we&apos;ll craft a private Bhutan experience that exceeds your imagination.
            </p>

            {/* Quote */}
            <blockquote className="relative p-8 rounded-2xl mb-8" style={{
              backgroundColor: isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
            }}>
              <div className="absolute top-4 left-4 text-6xl font-display font-bold opacity-10" style={{ color: '#D4AF37' }}>
                &ldquo;
              </div>
              <p className="font-serif italic text-xl leading-relaxed" style={{ color: isDark ? 'rgba(247, 247, 242, 0.8)' : 'rgba(26, 26, 26, 0.8)' }}>
                We don&apos;t sell tours. We curate transformative encounters with a kingdom
                that measures wealth in happiness.
              </p>
            </blockquote>

            {/* Contact Options */}
            <div className="space-y-4 mb-8">
              <a
                href="tel:+97577270465"
                className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: isDark ? 'rgba(0, 104, 56, 0.15)' : 'rgba(0, 104, 56, 0.1)',
                }}>
                  <Phone className="w-5 h-5" style={{ color: '#006838' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                    Call Direct
                  </p>
                  <p className="font-semibold" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                    +975 77 270 465
                  </p>
                </div>
              </a>

              <a
                href="mailto:info@himalayanmarvels.com"
                className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: isDark ? 'rgba(0, 104, 56, 0.15)' : 'rgba(0, 104, 56, 0.1)',
                }}>
                  <Mail className="w-5 h-5" style={{ color: '#006838' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                    Email Concierge
                  </p>
                  <p className="font-semibold" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                    info@himalayanmarvels.com
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/97577270465"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                }}>
                  <MessageCircle className="w-5 h-5" style={{ color: '#25D366' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                    WhatsApp
                  </p>
                  <p className="font-semibold" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                    Instant Response
                  </p>
                </div>
              </a>
            </div>

            {/* Response Time */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{
              backgroundColor: isDark ? 'rgba(28, 36, 28, 0.4)' : 'rgba(0, 104, 56, 0.05)',
              border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 104, 56, 0.08)'}`,
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#006838' }} />
              <p className="text-sm" style={{ color: isDark ? 'rgba(247, 247, 242, 0.6)' : 'rgba(26, 26, 26, 0.6)' }}>
                Typically responds within 4 hours
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Success Message */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-3xl text-center"
                style={{
                  backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `2px solid rgba(212, 175, 55, 0.3)`,
                  boxShadow: isDark ? '0 24px 64px rgba(0, 0, 0, 0.4)' : '0 24px 64px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{
                  backgroundColor: 'rgba(0, 104, 56, 0.1)',
                }}>
                  <Calendar className="w-8 h-8" style={{ color: '#006838' }} />
                </div>
                <h3 className="font-display text-2xl mb-4" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                  Thank You
                </h3>
                <p className="text-lg mb-6" style={{ color: isDark ? 'rgba(247, 247, 242, 0.7)' : 'rgba(26, 26, 26, 0.7)' }}>
                  Your concierge will contact you within 4 hours.
                </p>
                <p className="text-sm" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                  In the meantime, feel free to reach us directly:
                </p>
                <div className="space-y-2 mt-4">
                  <a href="tel:+97577270465" className="text-sm font-semibold" style={{ color: '#006838' }}>
                    📞 +975 77 270 465
                  </a>
                  <br />
                  <a href="https://wa.me/97577270465" className="text-sm font-semibold" style={{ color: '#25D366' }}>
                    💬 WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Card */}
                <div className="p-8 md:p-10 rounded-3xl" style={{
                  backgroundColor: isDark ? 'rgba(20, 28, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 104, 56, 0.1)'}`,
                  boxShadow: isDark
                    ? '0 24px 64px rgba(0, 0, 0, 0.4)'
                    : '0 24px 64px rgba(0, 0, 0, 0.06)',
                }}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="font-display text-2xl mb-3" style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}>
                      Begin Your Transformation
                    </h3>
                    <p className="text-sm" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.5)' }}>
                      Share your vision. We&apos;ll handle the rest.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    />
                  </div>

                  {/* Vision */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Your Vision
                    </label>
                    <textarea
                      value={formData.vision}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                      placeholder="Describe your dream Bhutan experience..."
                      required
                      rows={4}
                      className="w-full bg-transparent outline-none text-lg py-4 border-b resize-none transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                      👉 Helps you qualify instantly
                    </p>
                  </div>

                  {/* Number of Travelers */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Number of Travelers
                    </label>
                    <select
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      required
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors appearance-none cursor-pointer"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    >
                      <option value="" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>Select travelers</option>
                      <option value="1" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>1 Traveler (Solo)</option>
                      <option value="2" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>2 Travelers (Couple)</option>
                      <option value="3-4" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>3-4 Travelers (Small Group)</option>
                      <option value="5-8" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>5-8 Travelers (Family/Group)</option>
                      <option value="9+" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>9+ Travelers (Large Group)</option>
                    </select>
                    <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(247, 247, 242, 0.4)' : 'rgba(26, 26, 26, 0.4)' }}>
                      👉 Key for pricing
                    </p>
                  </div>

                  {/* Country of Passport */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Country of Passport
                    </label>
                    <input
                      type="text"
                      value={formData.passportCountry}
                      onChange={(e) => setFormData({ ...formData, passportCountry: e.target.value })}
                      placeholder="e.g., United States, United Kingdom, India"
                      required
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    />
                  </div>

                  {/* Travel Month */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: isDark ? 'rgba(247, 247, 242, 0.5)' : 'rgba(26, 26, 26, 0.4)' }}>
                      Month of Travel
                    </label>
                    <select
                      value={formData.travelMonth}
                      onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                      required
                      className="w-full bg-transparent outline-none text-lg py-4 border-b transition-colors appearance-none cursor-pointer"
                      style={{
                        color: isDark ? '#F7F7F2' : '#1A1A1A',
                        borderColor: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.borderBottomWidth = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 104, 56, 0.2)';
                        e.currentTarget.style.borderBottomWidth = '1px';
                      }}
                    >
                      <option value="" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>Select month</option>
                      <option value="January" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>January</option>
                      <option value="February" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>February</option>
                      <option value="March" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>March</option>
                      <option value="April" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>April</option>
                      <option value="May" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>May</option>
                      <option value="June" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>June</option>
                      <option value="July" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>July</option>
                      <option value="August" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>August</option>
                      <option value="September" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>September</option>
                      <option value="October" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>October</option>
                      <option value="November" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>November</option>
                      <option value="December" style={{ color: '#1A1A1A', background: '#FFFFFF' }}>December</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-5 rounded-full text-white font-semibold tracking-wider uppercase flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #006838 0%, #004D29 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      boxShadow: '0 12px 40px rgba(0, 104, 56, 0.3)',
                    }}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <span>Request Consultation</span>
                        <MapPin className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {/* Privacy Note */}
                  <p className="text-center text-xs mt-4" style={{ color: isDark ? 'rgba(247, 247, 242, 0.3)' : 'rgba(26, 26, 26, 0.3)' }}>
                    Your information is held in the strictest confidence
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
