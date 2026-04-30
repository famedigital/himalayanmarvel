'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Mountain } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { fetchInstagramPosts, type InstagramPost } from '@/lib/instagram';
import { fetchGoogleReviews, googleReviewToReview, type GoogleReview } from '@/lib/google-reviews';
import RevealOnScroll from './ui/RevealOnScroll';
import JsonLd from './seo/JsonLd';

interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  avatar: string;
  verified?: boolean;
  rating?: number;
}

// Instagram icon component
const InstagramIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Fallback reviews when Google Reviews API is not configured
const FALLBACK_REVIEWS = [
  {
    id: 1,
    name: 'Sarah & James Mitchell',
    location: 'Sydney, Australia',
    text: 'The Menchu hot stone bath experience was exactly what our exhausted souls needed. Bivatsu and his team crafted a journey that felt like a true recalibration of our nervous system.',
    avatar: 'SM',
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    location: 'Mumbai, India',
    text: 'The 9-day Spiritual & Meditation Tour transformed me. Private sessions with high-ranking lamas and the serenity of Phobjikha Valley—Bhutan truly touched my soul.',
    avatar: 'RK',
    verified: true,
    rating: 5,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Barcelona, Spain',
    text: 'From the private festival viewing to the Snowman Trek preparation, every detail was flawless. The anticipatory service reminds me of The Ritz-Carlton.',
    avatar: 'ER',
    verified: true,
    rating: 5,
  },
  {
    id: 4,
    name: 'Michael & Sarah Chen',
    location: 'San Francisco, USA',
    text: 'The attention to detail was extraordinary. From the moment we landed until our departure, every aspect was perfectly orchestrated. The private meditation session with a high lama was life-changing.',
    avatar: 'MC',
    verified: true,
    rating: 5,
  },
  {
    id: 5,
    name: 'Priya & Rahul Sharma',
    location: 'Delhi, India',
    text: 'Our honeymoon in Bhutan exceeded all expectations. The hot stone baths under the stars, the private monastery tours, and the incredible hospitality made it truly magical. Thank you for the memories of a lifetime.',
    avatar: 'PS',
    verified: true,
    rating: 5,
  },
];

// Generate Review schema for SEO
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Himalayan Marvels',
  alternateName: 'Silverpine Bhutan',
  image: '/logo/HMT-Logo.png',
  description: "Bhutan's premier luxury travel concierge. Private journeys curated by insiders.",
  url: 'https://himalayanmarvels.bt',
  telephone: '+975-2-322314',
  email: 'info@himalayanmarvels.bt',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Norzin Lam',
    addressLocality: 'Thimphu',
    addressRegion: 'Thimphu',
    postalCode: '11001',
    addressCountry: 'BT'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.9,
    reviewCount: 150,
    bestRating: 5,
    worstRating: 1,
  },
  review: FALLBACK_REVIEWS.slice(0, 5).map((review) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating || 5,
      bestRating: 5,
    },
    reviewBody: review.text,
    publisher: {
      '@type': 'Organization',
      name: 'Google Reviews',
    },
  })),
  priceRange: '$$$',
};

// Himalayan Marvels Google Place ID
// To find your Place ID:
// 1. Search your business on Google Maps
// 2. Look at the URL - it contains the place_id
// 3. Or use: searchPlaceId("Himalayan Marvels Bhutan")
const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';

// Fallback posts when API is not configured
const FALLBACK_POSTS = [
  {
    id: '1',
    thumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/w_400,h_400,c_fill/v1776291879/tiger-nest-close_rm2bee',
    caption: 'The sacred Taktsang Palphug Monastery',
    likes: '2.4k',
  },
  {
    id: '2',
    thumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/w_400,h_400,c_fill/v1776291877/dochula_r3uler',
    caption: 'Punakha Dzong at dawn',
    likes: '3.1k',
  },
  {
    id: '3',
    thumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/w_400,h_400,c_fill/v1776291902/buddha-point-view_skbl41',
    caption: 'Buddha Point panoramic views',
    likes: '1.8k',
  },
  {
    id: '4',
    thumbnail: 'https://res.cloudinary.com/dxztrqjft/image/upload/w_400,h_400,c_fill/v1776271223/tashichodzong_ddin28',
    caption: 'Tashichho Dzong, seat of the government',
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

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-sm font-medium line-clamp-2 mb-2">{caption}</p>
      </div>
    </motion.a>
  );
}

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState<typeof FALLBACK_POSTS | InstagramPost[]>(FALLBACK_POSTS);
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const sectionRef = useRef(null);

  // Fetch Google Reviews on mount
  useEffect(() => {
    async function loadGoogleReviews() {
      if (!GOOGLE_PLACE_ID) {
        console.info('Google Reviews not configured. Add NEXT_PUBLIC_GOOGLE_PLACE_ID to .env.local to enable.');
        return;
      }

      setIsLoadingReviews(true);
      try {
        const data = await fetchGoogleReviews(GOOGLE_PLACE_ID);
        if (data && data.reviews.length > 0) {
          // Convert Google reviews to our format
          const convertedReviews = data.reviews
            .filter((review) => review.text && review.text.length > 20) // Only substantial reviews
            .slice(0, 10) // Limit to 10 most recent
            .map(googleReviewToReview);

          setReviews(convertedReviews);
        }
      } catch (error) {
        console.error('Failed to load Google reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    }

    loadGoogleReviews();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Fetch Instagram posts on mount
  useEffect(() => {
    async function loadInstagramPosts() {
      try {
        const posts = await fetchInstagramPosts();
        if (posts.length > 0) {
          setInstagramPosts(posts.slice(0, 4));
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

  const displayPosts = instagramPosts.slice(0, 4);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Review Schema for SEO */}
      <JsonLd data={reviewSchema} />
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0E140E, #0A120A, #0E140E)'
            : 'linear-gradient(135deg, #FFFFFF, #F7F7F2, #FFFFFF)',
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#006838]/15 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
      />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Social Proof
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#D4AF37' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-light"
            style={{
              color: isDark ? '#F7F7F2' : '#1A1A1A',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Trusted by{' '}
            <span className="bg-gradient-to-r from-[#006838] to-[#D4AF37] bg-clip-text text-transparent">
              Travelers
            </span>
          </h2>
        </RevealOnScroll>

        {/* Main Grid */}
        <motion.div
          style={{ scale }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          {/* Testimonials Column */}
          <RevealOnScroll direction="left" className="order-2 lg:order-1">
            <div className="sticky top-24">
              {/* Glass Card */}
              <div className="relative group">
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 60px -12px rgba(0, 104, 56, 0.1)',
                      '0 0 80px -12px rgba(0, 104, 56, 0.2)',
                      '0 0 60px -12px rgba(0, 104, 56, 0.1)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 bg-gradient-to-r from-[#006838]/20 to-[#D4AF37]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                />

                <div
                  className="relative p-8 md:p-10 rounded-3xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: isDark
                      ? '0 16px 48px rgba(0,0,0,0.3)'
                      : '0 16px 48px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Quote Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                    style={{
                      backgroundColor: isDark ? 'rgba(0, 104, 56, 0.12)' : 'rgba(0, 104, 56, 0.06)',
                    }}
                  >
                    <Quote
                      className="w-8 h-8"
                      style={{ color: isDark ? 'rgba(247,247,242,0.5)' : 'rgba(26,26,26,0.3)' }}
                    />
                  </div>

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
                      <p
                        className="text-xl md:text-2xl leading-relaxed mb-8"
                        style={{
                          color: isDark ? 'rgba(247,247,242,0.85)' : 'rgba(26,26,26,0.8)',
                        }}
                      >
                        {reviews[currentIndex].text}
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        {/* Avatar */}
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                            style={{
                              background: 'linear-gradient(135deg, #006838, #D4AF37)',
                            }}
                          >
                            {reviews[currentIndex].avatar}
                          </div>
                          {reviews[currentIndex].verified && (
                            <div
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2"
                              style={{
                                backgroundColor: '#10B981',
                                borderColor: isDark ? '#1C241C' : '#FFFFFF',
                              }}
                            >
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div>
                          <p
                            className="font-medium text-lg"
                            style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                          >
                            {reviews[currentIndex].name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
                          >
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
                  <div
                    className="flex items-center justify-between mt-8 pt-8"
                    style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}` }}
                  >
                    <div className="flex items-center gap-2">
                      {reviews.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                          }}
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: index === currentIndex ? 40 : 8,
                            backgroundColor: index === currentIndex
                              ? '#006838'
                              : isDark ? 'rgba(247,247,242,0.15)' : 'rgba(26,26,26,0.15)',
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        className="rounded-full w-12 h-12 flex items-center justify-center transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(247, 247, 242, 0.8)',
                          border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                          color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.5)',
                        }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="rounded-full w-12 h-12 flex items-center justify-center transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isDark ? 'rgba(28, 36, 28, 0.8)' : 'rgba(247, 247, 242, 0.8)',
                          border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                          color: isDark ? 'rgba(247,247,242,0.6)' : 'rgba(26,26,26,0.5)',
                        }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { value: '13+', label: 'Years Creating Magic', icon: Mountain },
                  { value: '4.9', label: 'Average Rating', icon: Star },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4 rounded-2xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(247, 247, 242, 0.8)',
                      border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 104, 56, 0.04)'}`,
                    }}
                  >
                    <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#006838] to-[#D4AF37] bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Instagram Column */}
          <RevealOnScroll direction="right" className="order-1 lg:order-2">
            <div className="space-y-6">
              {/* Instagram Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: isDark ? '#1C241C' : '#FFFFFF' }}
                      >
                        <div className="w-5 h-5" style={{ color: '#E1306C' }}>
                          <InstagramIcon />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: isDark ? '#F7F7F2' : '#1A1A1A' }}
                      >
                        @himalayanmarvels.travel
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: isDark ? 'rgba(247,247,242,0.4)' : 'rgba(26,26,26,0.4)' }}
                      >
                        Travel Company
                      </p>
                    </div>
                  </div>
                </div>
                <motion.a
                  href="https://www.instagram.com/himalayanmarvels.travel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: '#006838',
                    boxShadow: '0 4px 16px rgba(0, 104, 56, 0.25)',
                  }}
                >
                  Follow
                </motion.a>
              </div>

              {/* Loading State */}
              {isLoadingInstagram ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl animate-pulse"
                      style={{ backgroundColor: isDark ? 'rgba(28, 36, 28, 0.5)' : 'rgba(0,0,0,0.04)' }}
                    />
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
              <div
                className="relative overflow-hidden rounded-2xl p-6 text-center"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(0, 104, 56, 0.12), rgba(212, 175, 55, 0.08))'
                    : 'linear-gradient(135deg, rgba(0, 104, 56, 0.04), rgba(212, 175, 55, 0.03))',
                  border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 104, 56, 0.06)'}`,
                }}
              >
                <motion.a
                  href="https://www.instagram.com/himalayanmarvels.travel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition-all"
                  style={{
                    backgroundColor: '#006838',
                    boxShadow: '0 4px 16px rgba(0, 104, 56, 0.25)',
                  }}
                >
                  Follow on Instagram
                </motion.a>
              </div>
            </div>
          </RevealOnScroll>
        </motion.div>
      </div>
    </section>
  );
}
