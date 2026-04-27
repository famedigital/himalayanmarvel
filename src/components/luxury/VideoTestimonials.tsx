'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  guestName: string;
  guestTitle: string;
  guestCompany?: string;
  guestImage: string;
  quote: string;
  videoThumbnail: string;
  videoUrl?: string;
  rating: number;
  journeyType: string;
  journeyDate: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    guestName: 'Sarah & James Mitchell',
    guestTitle: 'Entrepreneurs',
    guestCompany: 'Mitchell Capital, Sydney',
    guestImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    quote: 'The 10-day journey recalibrated our entire nervous system. Bivatsu and his team crafted something that went far beyond a vacation — it was a genuine transformation.',
    videoThumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    rating: 5,
    journeyType: 'Cultural Immersion',
    journeyDate: 'October 2025',
  },
  {
    id: '2',
    guestName: 'Dr. Robert Chen',
    guestTitle: 'Surgeon',
    guestCompany: 'Mayo Clinic, Minnesota',
    guestImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    quote: 'I\'ve traveled to 40+ countries but this was different. The private monastery access, the hot stone baths, the way they wove mindfulness into every moment — exceptional.',
    videoThumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    rating: 5,
    journeyType: 'Spiritual Wellness',
    journeyDate: 'September 2025',
  },
  {
    id: '3',
    guestName: 'Elena Rodriguez',
    guestTitle: 'Creative Director',
    guestCompany: 'Vogue España, Madrid',
    guestImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    quote: 'As someone who works in luxury media, I have high standards. Himalayan Marvels exceeded them in every way. The attention to detail was extraordinary.',
    videoThumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    rating: 5,
    journeyType: 'Himalayan Expedition',
    journeyDate: 'November 2025',
  },
];

/**
 * VideoTestimonials — Luxury video testimonial system
 *
 * Addresses ChatGPT's feedback: "Need video testimonials"
 * "Social proof with video backgrounds"
 */
export function VideoTestimonials() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <section ref={containerRef} className="section-luxury relative overflow-hidden bg-black">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
          style={{ transform: y }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-champagne-gold" />
            <span className="text-champagne-gold text-xs uppercase tracking-[0.3em] font-semibold">
              Guest Stories
            </span>
            <div className="w-12 h-px bg-champagne-gold" />
          </div>

          <h2 className="font-display text-display-section text-white mb-6">
            Transformations in{' '}
            <span className="gradient-text">Their Own Words</span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
            Don't just take our word for it. Hear from the travelers whose lives were
            changed by their journey through Bhutan.
          </p>
        </motion.div>

        {/* MAIN VIDEO PLAYER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative max-w-5xl mx-auto mb-16"
          style={{ transform: y }}
        >
          {/* Video Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden" style={{
            boxShadow: '0 40px 100px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)',
          }}>
            {/* Video Background */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={testimonials[activeTestimonial].videoThumbnail}
              loop
              playsInline
              muted={isMuted}
              onClick={handlePlayPause}
            >
              <source src="/testimonials/mitchell-journey.mp4" type="video/mp4" />
            </video>

            {/* Play/Pause Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 cursor-pointer transition-colors"
              onClick={handlePlayPause}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.9)',
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
                }}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-dark-forest" />
                ) : (
                  <Play className="w-8 h-8 text-dark-forest ml-1" />
                )}
              </motion.div>
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center justify-between">
                {/* Progress Bar */}
                <div className="flex-1 mr-4">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-champagne-gold"
                      initial={{ width: 0 }}
                      animate={{ width: isPlaying ? '100%' : '0%' }}
                      transition={{ duration: 10 }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMuteToggle}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-start gap-6"
          >
            <Image
              src={testimonials[activeTestimonial].guestImage}
              alt={testimonials[activeTestimonial].guestName}
              width={80}
              height={80}
              className="rounded-2xl object-cover flex-shrink-0"
              style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
            />
            <div className="flex-1">
              <h4 className="text-white font-display text-xl mb-1">
                {testimonials[activeTestimonial].guestName}
              </h4>
              <p className="text-white/60 text-sm mb-3">
                {testimonials[activeTestimonial].guestTitle}
                {testimonials[activeTestimonial].guestCompany && (
                  <span> • {testimonials[activeTestimonial].guestCompany}</span>
                )}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-champagne-gold text-champagne-gold" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/40 text-xs">
                  • {testimonials[activeTestimonial].journeyType} • {testimonials[activeTestimonial].journeyDate}
                </span>
              </div>
              <p className="font-serif italic text-white/80 text-lg leading-relaxed">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* THUMBNAIL GALLERY */}
        <div className="grid grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTestimonial(index)}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                activeTestimonial === index ? 'ring-2 ring-champagne-gold' : ''
              }`}
              style={{
                boxShadow: activeTestimonial === index
                  ? '0 16px 48px rgba(212, 175, 55, 0.3), 0 0 0 2px #D4AF37'
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Image
                src={testimonial.videoThumbnail}
                alt={testimonial.guestName}
                width={400}
                height={300}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm mb-1 line-clamp-1">
                  {testimonial.guestName}
                </p>
                <p className="text-white/60 text-xs">
                  {testimonial.journeyType}
                </p>
              </div>
              {activeTestimonial === index && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0E140E',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Playing
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">Ready for your own transformation?</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-12 py-4 rounded-full text-white font-semibold tracking-wide"
            style={{
              backgroundColor: '#006838',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 104, 56, 0.3)',
            }}
          >
            Begin Your Journey
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
