'use client';

import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import RevealOnScroll from './ui/RevealOnScroll';

interface AboutContent {
  name: string;
  subtitle: string;
  bio: string;
  credentials: string;
  brands: string;
  stats: string;
  image: string;
}

export default function FounderDynamic() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'about_content')
        .single();

      if (data?.value) {
        setContent(data.value);
      } else {
        setContent({
          name: 'Bivatsu',
          subtitle: 'Founder & CEO',
          bio: 'A hospitality visionary whose professional DNA was forged in the world\'s most demanding luxury environments. After elite training at Les Roches (Spain) and International College of Hotel Management (Australia), Bivatsu honed his craft within the leadership circles of global icons.',
          credentials: 'Les Roches (Spain), ICHM (Australia), MBA - University of Canberra',
          brands: 'The Ritz-Carlton, Hyatt, Kempinski',
          stats: '12+|5,000+|50+|4.9',
          image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776275660/founder-portrait_pbo8m4.jpg',
        });
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading || !content) {
    return (
      <section id="about" className="section-padding" style={{ backgroundColor: isDark ? '#0E140E' : '#FFFFFF' }}>
        <div className="container-premium flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
        </div>
      </section>
    );
  }

  const nameParts = content.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || 'Giri';

  const credentialsList = content.credentials.split(',').map(c => c.trim());
  const brandsList = content.brands.split(',').map(b => b.trim());
  const statsList = content.stats.split('|');

  return (
    <section id="about" className="section-padding" style={{ backgroundColor: isDark ? '#0E140E' : '#FFFFFF' }}>
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <RevealOnScroll direction="left" className="order-2 lg:order-1">
            <div className="relative">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.4)' : '0 24px 64px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={content.image}
                  alt={content.name}
                  className="w-full aspect-[4/5] object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isDark
                      ? 'linear-gradient(to top, rgba(14,20,14,0.4) 0%, transparent 50%)'
                      : 'linear-gradient(to top, rgba(26,26,26,0.15) 0%, transparent 50%)',
                  }}
                />
              </div>

              {/* Experience Badge */}
              {statsList[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.9)' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0, 104, 56, 0.08)'}`,
                    boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <p className="text-3xl font-bold gradient-text">{statsList[0]}</p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
                  >
                    Years Experience
                  </p>
                </motion.div>
              )}
            </div>
          </RevealOnScroll>

          {/* Content */}
          <RevealOnScroll direction="right" delay={0.15} className="order-1 lg:order-2">
            <span
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: isDark ? 'rgba(247,247,242,0.35)' : 'rgba(26,26,26,0.35)' }}
            >
              {content.subtitle}
            </span>

            <h2
              className="text-5xl md:text-6xl font-light mt-4 mb-2 tracking-tight"
              style={{
                color: isDark ? '#F7F7F2' : '#1A1A1A',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              {firstName}
            </h2>
            <h2
              className="text-5xl md:text-6xl font-light mb-8 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="gradient-text">{lastName}</span>
            </h2>

            <p
              className="text-lg leading-relaxed mb-8 max-w-md"
              style={{ color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)' }}
            >
              {content.bio}
            </p>

            {/* Credentials */}
            {credentialsList.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {credentialsList.map((cred, index) => {
                  const parts = cred.split('(');
                  const label = parts[0]?.trim() || cred;
                  const detail = parts[1]?.replace(')', '').trim() || '';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="px-4 py-2 rounded-full"
                      style={{
                        backgroundColor: isDark ? 'rgba(28, 36, 28, 0.6)' : 'rgba(247, 247, 242, 0.8)',
                        border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                      }}
                    >
                      <p className="text-xs" style={{ color: isDark ? 'rgba(247,247,242,0.7)' : 'rgba(26,26,26,0.6)' }}>
                        <span className="font-semibold">{label}</span>
                        {detail && <span style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}> — {detail}</span>}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Luxury Brands */}
            {brandsList.length > 0 && (
              <div className="mb-8">
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{ color: isDark ? 'rgba(247,247,242,0.3)' : 'rgba(26,26,26,0.3)' }}
                >
                  Leadership at
                </p>
                <div className="flex flex-wrap gap-4">
                  {brandsList.map((brand, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-sm font-medium"
                      style={{ color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.6)' }}
                    >
                      {brand}
                      {index < brandsList.length - 1 && (
                        <span style={{ color: isDark ? 'rgba(247,247,242,0.2)' : 'rgba(26,26,26,0.2)' }} className="mx-2">•</span>
                      )}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {statsList.slice(1).map((stat, index) => {
                const statParts = stat.trim().split(/[\s,]+/);
                const value = statParts[0] || '-';
                const label = statParts.slice(1).join(' ') || (index === 0 ? 'Travelers' : index === 1 ? 'Tours' : 'Rating');

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold gradient-text">{value}</p>
                    <p
                      className="text-xs uppercase tracking-wider mt-2"
                      style={{ color: isDark ? 'rgba(247,247,242,0.3)' : 'rgba(26,26,26,0.35)' }}
                    >
                      {label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
