'use client';

import { motion } from 'framer-motion';
import { Mountain, Star, Compass, Camera, ArrowRight, LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LuxuryButton } from './LuxuryButton';
import { createClient } from '@/lib/supabase/client';

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  quoteSource: string;
  image: string;
  icon: string;
  color: string;
}

interface CinematicData {
  chapters?: Chapter[];
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Star,
  Mountain,
  Compass,
  Camera,
  ArrowRight,
};

const defaultChapters: Chapter[] = [
  {
    id: 1,
    title: 'The Call',
    subtitle: 'In a world that never stops',
    description: 'You feel disconnected. Overwhelmed. Yearning for something real...',
    quote: 'The journey of a thousand miles begins with a single step into the unknown.',
    quoteSource: 'Lao Tzu',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    icon: 'Star',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 2,
    title: 'The Kingdom',
    subtitle: 'Bhutan awaits',
    description: 'Where time slows down. Where happiness is measured, not GDP. Where ancient wisdom lives.',
    quote: 'In the Himalayas, time is not measured in hours but in moments of stillness.',
    quoteSource: 'Bhutanese Proverb',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    icon: 'Mountain',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 3,
    title: 'The Journey',
    subtitle: 'Curated for you',
    description: 'Private monasteries. Sacred festivals. Local families. Hot stone baths. Your way.',
    quote: 'Travel is the only thing you buy that makes you richer.',
    quoteSource: 'Anonymous',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: 'Compass',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    title: 'The Return',
    subtitle: 'Forever changed',
    description: 'You\'re not the same person who arrived. You\'ve found stillness. Connection. Home.',
    quote: 'A journey of a thousand miles must begin with a single step.',
    quoteSource: 'Lao Tzu',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    icon: 'Camera',
    color: 'from-rose-500 to-pink-500',
  },
];

export function CinematicScrollSection() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const [activeChapter, setActiveChapter] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>(defaultChapters);

  const supabase = createClient();

  useEffect(() => {
    const fetchCinematicData = async () => {
      const { data: cinematicData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'homepage_cinematic')
        .single();

      if (cinematicData?.value?.chapters && Array.isArray(cinematicData.value.chapters)) {
        setChapters(cinematicData.value.chapters);
      }
    };

    fetchCinematicData();
  }, [supabase]);

  const scrollToChapter = (index: number) => {
    const element = document.getElementById(`chapter-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="section-luxury relative bg-gradient-to-b from-slate-950 via-neutral-900 to-slate-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Progress indicator - compact */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        {chapters.map((chapter, i) => (
          <motion.button
            key={chapter.id}
            onClick={() => scrollToChapter(i)}
            className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-125"
            animate={{
              scale: activeChapter === i ? 1.3 : 1,
              backgroundColor: activeChapter === i ? 'rgb(212 175 55)' : 'rgba(255, 255, 255, 0.15)'
            }}
            aria-label={`Go to ${chapter.title}`}
          />
        ))}
      </div>

      <div className="container-luxury relative z-10 py-12 md:py-16 px-4 md:px-6">
        {/* Compact header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-amber-500/20 bg-amber-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
              Your Story
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            Four Chapters to{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Transformation
            </span>
          </h2>

          <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto">
            Every great journey follows a path. Discover yours.
          </p>
        </motion.div>

        {/* Compact chapters */}
        <div className="space-y-12 md:space-y-20 relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent" />
          </div>

          {chapters.map((chapter, index) => {
            const Icon = iconMap[chapter.icon] || Star;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={chapter.id}
                id={`chapter-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onViewportEnter={() => setActiveChapter(index)}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Image - compact */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + index * 0.1 }}
                  className="w-full md:flex-1 relative"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl">
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${chapter.color})`,
                      }}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Content - compact */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
                  className="w-full md:flex-1"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Chapter number */}
                      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <span className="text-amber-500 font-display font-bold text-sm md:text-base">
                          0{chapter.id}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="font-serif text-xl md:text-3xl lg:text-4xl text-white mb-1 md:mb-2 leading-tight">
                          {chapter.title}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-amber-500 text-[10px] md:text-xs mb-2 md:mb-3 font-medium uppercase tracking-wide">
                          {chapter.subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-xs md:text-sm lg:text-base text-white/70 leading-relaxed mb-3 md:mb-4">
                          {chapter.description}
                        </p>

                        {/* Quote */}
                        <blockquote className="relative pl-3 md:pl-4 border-l-2 border-amber-500/40">
                          <p className="font-serif text-xs md:text-sm text-white/80 italic leading-relaxed">
                            "{chapter.quote}"
                          </p>
                          <cite className="text-amber-500 text-[9px] md:text-xs not-italic mt-1 block">
                            — {chapter.quoteSource}
                          </cite>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Connector dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(212,175,55,0.5)] z-10 hidden md:block"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-10 md:mt-16"
        >
          <h2 className="font-display text-xl md:text-3xl lg:text-4xl text-white mb-2 md:mb-3">
            Your Journey{' '}
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Awaits
            </span>
          </h2>

          <p className="text-xs md:text-sm text-neutral-400 mb-4 md:mb-6 max-w-xl mx-auto">
            Every journey begins with a conversation. Share your vision, and we'll design an experience beyond imagination.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <LuxuryButton variant="primary" size="lg" href="#contact" icon={true}>
              <span className="text-xs md:text-sm">Design Your Custom Journey</span>
            </LuxuryButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
