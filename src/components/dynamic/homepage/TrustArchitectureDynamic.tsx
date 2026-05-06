'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Star } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface TrustArchitectureDynamicProps {
  content: {
    licenseImage?: string;
    partnerships?: Array<{ name: string; image: string }>;
    certifications?: string[];
  };
}

export function TrustArchitectureDynamic({ content }: TrustArchitectureDynamicProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const {
    licenseImage = '',
    partnerships = [],
    certifications = [],
  } = content;

  return (
    <section className="py-20 bg-alabaster dark:bg-dark-forest">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Licensed & Accredited
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Government certified, fully insured, and globally recognized
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* License */}
          {licenseImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-champagne-gold" />
              </div>
              <Image
                src={licenseImage}
                alt="License"
                width={200}
                height={150}
                className="mx-auto rounded-lg"
              />
            </motion.div>
          )}

          {/* Partnerships */}
          {partnerships && partnerships.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-champagne-gold" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
                Trusted Partners
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {partnerships.map((partner, index) => (
                  <div key={index} className="text-center">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={100}
                      height={50}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{partner.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-champagne-gold" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
                Certifications
              </h3>
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full" />
                    {cert}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
