'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// Custom Instagram icon component
const InstagramIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Play icon for videos
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Carousel icon for albums
const CarouselIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);

// Instagram post data structure
// When connected to API: { id, media_type, media_url, thumbnail_url, caption, permalink }
type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

interface InstagramPost {
  id: string;
  media_type: MediaType;
  thumbnail: string;
  video_url?: string;
  caption: string;
  url: string;
}

// Placeholder data - will be replaced with API data
const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: '1',
    media_type: 'IMAGE',
    thumbnail: 'https://images.unsplash.com/photo-1620665495597-fdc8ce790084?w=600&h=600&fit=crop',
    caption: 'The sacred Taktsang Palphug Monastery, perched on the cliff edge.',
    url: 'https://www.instagram.com/p/C_example1/',
  },
  {
    id: '2',
    media_type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1666190075474-6f5a1f4dc1f8?w=600&h=600&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-bhutan-prayer-flags-43985-large.mp4',
    caption: 'Punakha Dzong at dawn - watch the mist rise over the river.',
    url: 'https://www.instagram.com/p/C_example2/',
  },
  {
    id: '3',
    media_type: 'IMAGE',
    thumbnail: 'https://images.unsplash.com/photo-1609766856927-7eb8a87ec384?w=600&h=600&fit=crop',
    caption: 'Prayer flags fluttering against the Himalayan sky.',
    url: 'https://www.instagram.com/p/C_example3/',
  },
  {
    id: '4',
    media_type: 'CAROUSEL_ALBUM',
    thumbnail: 'https://images.unsplash.com/photo-1596395919718-83c7f1f19e0c?w=600&h=600&fit=crop',
    caption: 'The warmth of Bhutanese hospitality. Swipe to see more →',
    url: 'https://www.instagram.com/p/C_example4/',
  },
  {
    id: '5',
    media_type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1588479427556-22261a703f9a?w=600&h=600&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-monks-praying-43986-large.mp4',
    caption: 'Evening prayers at the monastery - a moment of peace.',
    url: 'https://www.instagram.com/p/C_example5/',
  },
];

// Individual Post Component
function PostItem({ post, index }: { post: InstagramPost; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (post.media_type === 'VIDEO' && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (post.media_type === 'VIDEO' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const isVideo = post.media_type === 'VIDEO';
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM';

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative aspect-square overflow-hidden rounded-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media */}
      <div className="absolute inset-0 bg-stone-200">
        {isVideo ? (
          <>
            {/* Thumbnail shown when not playing */}
            <img
              src={post.thumbnail}
              alt={post.caption}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            />
            {/* Video shown on hover */}
            <video
              ref={videoRef}
              src={post.video_url}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              loop
              preload="auto"
            />
          </>
        ) : (
          <Image
            src={post.thumbnail}
            alt={post.caption}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}
      </div>

      {/* Dark overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideo ? (isPlaying ? 0.3 : 0.5) : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Video/Carousel Indicators */}
      {isVideo && !isPlaying && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <div className="w-6 h-6 text-stone-900 ml-1">
              <PlayIcon />
            </div>
          </div>
        </motion.div>
      )}

      {isCarousel && (
        <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 text-stone-900">
            <CarouselIcon />
          </div>
        </div>
      )}

      {/* Caption Overlay (subtle) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-white text-xs line-clamp-2 leading-relaxed">
          {post.caption}
        </p>
      </motion.div>

      {/* Instagram Icon Badge */}
      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
        <div className="w-3.5 h-3.5" style={{ color: '#E1306C' }}>
          <InstagramIcon />
        </div>
      </div>

      {/* Video playing indicator */}
      {isVideo && isPlaying && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-medium text-stone-900 uppercase tracking-wider">Video</span>
        </div>
      )}
    </motion.a>
  );
}

export default function InstagramFeed() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-5 h-5" style={{ color: '#E1306C' }}>
              <InstagramIcon />
            </div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: '#8E261A' }}>
              Follow Our Journey
            </p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6" style={{ color: '#262626' }}>
            @himalayanmarvels
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(38, 38, 38, 0.65)' }}>
            Glimpses of Bhutan through our lens. Follow us for daily inspiration from the Kingdom.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INSTAGRAM_POSTS.map((post, index) => (
            <PostItem key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/himalayanmarvels"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all hover:gap-3"
            style={{ backgroundColor: '#8E261A', color: 'white' }}
          >
            Follow on Instagram
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
