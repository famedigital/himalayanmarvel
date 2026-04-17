'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Custom Instagram icon component
const InstagramIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Instagram post data - can be fetched from API or hardcoded
// Format: { id, image, caption, url }
const INSTAGRAM_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1620665495597-fdc8ce790084?w=600&h=600&fit=crop',
    caption: 'The sacred Taktsang Palphug Monastery, perched on the cliff edge.',
    url: 'https://www.instagram.com/p/C_example1/',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1666190075474-6f5a1f4dc1f8?w=600&h=600&fit=crop',
    caption: 'Punakha Dzong at dawn, where history meets the river.',
    url: 'https://www.instagram.com/p/C_example2/',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1609766856927-7eb8a87ec384?w=600&h=600&fit=crop',
    caption: 'Prayer flags fluttering against the Himalayan sky.',
    url: 'https://www.instagram.com/p/C_example3/',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1596395919718-83c7f1f19e0c?w=600&h=600&fit=crop',
    caption: 'The warmth of Bhutanese hospitality in every moment.',
    url: 'https://www.instagram.com/p/C_example4/',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1588479427556-22261a703f9a?w=600&h=600&fit=crop',
    caption: 'Monks in traditional robes at the evening prayers.',
    url: 'https://www.instagram.com/p/C_example5/',
  },
];

export default function InstagramFeed() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load Instagram embed script
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      scriptLoaded.current = true;
    }
  }, []);

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
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-xl"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-stone-200">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-8 h-8 text-white mb-2">
                  <InstagramIcon />
                </div>
                <p className="text-white text-xs text-center line-clamp-3">{post.caption}</p>
              </motion.div>

              {/* Instagram Icon Badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <div className="w-4 h-4" style={{ color: '#E1306C' }}>
                  <InstagramIcon />
                </div>
              </div>
            </motion.a>
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
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all"
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
