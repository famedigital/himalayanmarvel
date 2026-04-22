'use client';

import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
        // Default content if not set
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
      <section id="about" className="section-padding dark:bg-neutral-900 bg-white">
        <div className="container-premium flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
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
    <section id="about" className="section-padding dark:bg-neutral-900 bg-white">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={content.image}
                  alt={content.name}
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 dark:bg-gradient-to-t bg-gradient-to-t dark:from-black/40 from-neutral-900/30 to-transparent" />
              </div>

              {/* Experience Badge */}
              {statsList[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-xl dark:bg-neutral-900 bg-white dark:border border-white/10 border-neutral-200"
                >
                  <p className="text-3xl font-bold gradient-text">{statsList[0]}</p>
                  <p className="text-xs dark:text-white/50 text-neutral-600 uppercase tracking-wider">Years Experience</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 lg:order-2"
          >
            <span className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-[0.2em]">
              {content.subtitle}
            </span>

            <h2 className="text-5xl md:text-6xl font-bold dark:text-white text-neutral-900 mt-4 mb-2 tracking-tight">
              {firstName}
            </h2>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              <span className="gradient-text">{lastName}</span>
            </h2>

            <p className="dark:text-white/70 text-neutral-700 text-lg leading-relaxed mb-8 max-w-md">
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
                      className="px-4 py-2 rounded-full dark:bg-white/5 bg-neutral-100 dark:border border-white/10 border-neutral-200"
                    >
                      <p className="text-xs dark:text-white/80 text-neutral-700">
                        <span className="font-semibold">{label}</span>
                        {detail && <span className="dark:text-white/50 text-neutral-500"> — {detail}</span>}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Luxury Brands */}
            {brandsList.length > 0 && (
              <div className="mb-8">
                <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mb-3">Leadership at</p>
                <div className="flex flex-wrap gap-4">
                  {brandsList.map((brand, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-sm dark:text-white/70 text-neutral-700 font-medium"
                    >
                      {brand}
                      {index < brandsList.length - 1 && <span className="dark:text-white/30 text-neutral-400 mx-2">•</span>}
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
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold gradient-text">{value}</p>
                    <p className="text-xs dark:text-white/40 text-neutral-500 uppercase tracking-wider mt-2">{label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
