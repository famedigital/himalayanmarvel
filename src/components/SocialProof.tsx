'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { fetchInstagramPosts, type InstagramPost } from '@/lib/instagram';

// Instagram icon component
const InstagramIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const reviews = [
  {
    id: 1,
    name: 'Sarah & James Mitchell',
    location: 'Sydney, Australia',
    text: 'The Menchu hot stone bath experience was exactly what our exhausted souls needed. Bivatsu and his team crafted a journey that felt like a true recalibration of our nervous system.',
    avatar: 'SM',
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    location: 'Mumbai, India',
    text: 'The 9-day Spiritual & Meditation Tour transformed me. Private sessions with high-ranking lamas and the serenity of Phobjikha Valley—Bhutan truly touched my soul.',
    avatar: 'RK',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    text: 'From the private festival viewing to the Snowman Trek preparation, every detail was flawless. The anticipatory service reminds me of The Ritz-Carlton.',
    avatar: 'ER',
  },
];

// Fallback posts when API is not configured
const FALLBACK_POSTS = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1620665495597-fdc8ce790084?w=400&h=400&fit=crop',
    caption: 'The sacred Taktsang Palphug Monastery',
    likes: '2.4k',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1666190075474-6f5a1f4dc1f8?w=400&h=400&fit=crop',
    caption: 'Punakha Dzong at dawn',
    likes: '3.1k',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1609766856927-7eb8a87ec384?w=400&h=400&fit=crop',
    caption: 'Prayer flags fluttering',
    likes: '1.8k',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1596395919718-83c7f1f19e0c?w=400&h=400&fit=crop',
    caption: 'Bhutanese hospitality',
    likes: '2.7k',
  },
];

// Compact Instagram Post Card
function InstaCard({ post, index }: { post: InstagramPost | typeof FALLBACK_POSTS[0]; index: number; permalink?: string }) {
  const isApiPost = 'permalink' in post;
  const imageUrl = isApiPost ? (post.thumbnail_url || post.media_url || '') : post.thumbnail;
  const caption = post.caption;
  const link = isApiPost ? post.permalink : `https://www.instagram.com/himalayanmarvels.travel/`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer block"
    >
      <Image
        src={imageUrl}
        alt={caption}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 45vw, 20vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Instagram Badge */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75">
        <div className="w-4 h-4" style={{ color: '#E1306C' }}>
          <InstagramIcon />
        </div>
      </div>

      {/* Caption & Likes */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-sm font-medium line-clamp-2 mb-2">{caption}</p>
      </div>
    </motion.a>
  );
}

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [instagramPosts, setInstagramPosts] = useState<typeof FALLBACK_POSTS | InstagramPost[]>(FALLBACK_POSTS);
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(true);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Fetch Instagram posts on mount
  useEffect(() => {
    async function loadInstagramPosts() {
      try {
        const posts = await fetchInstagramPosts();
        if (posts.length > 0) {
          setInstagramPosts(posts.slice(0, 4)); // Take first 4 posts
        }
      } catch (error) {
        console.error('Failed to load Instagram posts:', error);
      } finally {
        setIsLoadingInstagram(false);
      }
    }
    loadInstagramPosts();
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Use first 4 posts for masonry layout
  const displayPosts = instagramPosts.slice(0, 4);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-neutral-50 dark:from-neutral-950 dark:via-black dark:to-neutral-900" />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"
      />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-current" />
            Social Proof
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-current" />
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold dark:text-white text-neutral-900">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Travelers
            </span>
          </h2>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          style={{ rotateX, rotateY, scale }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          {/* Testimonials Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="sticky top-24">
              {/* Glass Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 60px -12px rgba(139, 38, 26, 0.1)',
                      '0 0 80px -12px rgba(139, 38, 26, 0.2)',
                      '0 0 60px -12px rgba(139, 38, 26, 0.1)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 to-red-600/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                />

                <Card className="relative p-8 md:p-10 border-0 dark:bg-neutral-900/80 bg-white/80 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-0">
                    {/* Animated Quote Icon */}
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 dark:bg-white/10 bg-neutral-100 rounded-2xl flex items-center justify-center mb-8"
                    >
                      <Quote className="w-8 h-8 dark:text-white/60 text-neutral-700" />
                    </motion.div>

                    {/* Review Carousel */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction < 0 ? 50 : -50, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="text-xl md:text-2xl dark:text-white/90 text-neutral-800 leading-relaxed mb-8">
                          {reviews[currentIndex].text}
                        </p>

                        <div className="flex items-center gap-4 mb-6">
                          {/* Avatar */}
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-red-600 text-white font-semibold text-lg shadow-lg">
                              {reviews[currentIndex].avatar}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="dark:text-white text-neutral-900 font-medium text-lg">
                              {reviews[currentIndex].name}
                            </p>
                            <p className="dark:text-white/60 text-neutral-600 text-sm">
                              {reviews[currentIndex].location}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                            >
                              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {reviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setDirection(index > currentIndex ? 1 : -1);
                              setCurrentIndex(index);
                            }}
                            className={`h-2 rounded-full transition-all ${
                              index === currentIndex
                                ? 'w-10 bg-gradient-to-r from-amber-500 to-red-600'
                                : 'w-2 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-500 dark:hover:bg-white/40'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full w-12 h-12">
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full w-12 h-12">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: '12+', label: 'Years' },
                  { value: '4.9', label: 'Rating' },
                  { value: '2k+', label: 'Reviews' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4 rounded-2xl dark:bg-white/5 bg-neutral-100/50 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs dark:text-white/60 text-neutral-600 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Instagram Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6">
              {/* Instagram Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                      <div className="w-full h-full rounded-full dark:bg-neutral-900 bg-white flex items-center justify-center">
                        <div className="w-5 h-5" style={{ color: '#E1306C' }}>
                          <InstagramIcon />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="dark:text-white text-neutral-900 font-semibold">@himalayanmarvels.travel</p>
                      <p className="text-xs dark:text-white/60 text-neutral-600">Travel Company</p>
                    </div>
                  </div>
                </div>
                <motion.a
                  href="https://www.instagram.com/himalayanmarvels.travel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all"
                >
                  Follow
                </motion.a>
              </motion.div>

              {/* Loading State */}
              {isLoadingInstagram ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-neutral-200 dark:bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                /* Masonry-style Grid */
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {displayPosts[0] && <InstaCard post={displayPosts[0]} index={0} />}
                    {displayPosts[2] && <InstaCard post={displayPosts[2]} index={2} />}
                  </div>
                  <div className="space-y-4 pt-8">
                    {displayPosts[1] && <InstaCard post={displayPosts[1]} index={1} />}
                    {displayPosts[3] && <InstaCard post={displayPosts[3]} index={3} />}
                  </div>
                </div>
              )}

              {/* Follow CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl p-6 dark:bg-gradient-to-br dark:from-purple-900/30 dark:to-pink-900/30 bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/50 dark:border-white/10"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

                <div className="relative flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 bg-gradient-to-br from-amber-400 to-red-500"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="dark:text-white text-neutral-900 font-medium">Join 50k+ travelers</p>
                    <p className="text-sm dark:text-white/70 text-neutral-600">Follow for daily inspiration</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
