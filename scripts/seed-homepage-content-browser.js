/**
 * Seed Homepage Content - Simple Version
 * Uses existing Supabase client
 */

import { createClient } from '../src/lib/supabase/client';

const homepageContent = {
  // TripAdvisor Reviews Section
  homepage_reviews: {
    rating: 4.9,
    reviewCount: 127,
    reviewSource: 'Google',
    reviewLink: 'https://share.google/jcfuEHOacCjzAmGaM',
    badgeText: 'Verified Excellence',
    topReviews: [
      {
        author: 'Sarah Mitchell',
        rating: 5,
        text: 'An absolutely incredible experience. Himalayan Marvels planned every detail perfectly. The guide was knowledgeable and the itinerary was exactly what we wanted.',
        date: 'March 2024'
      },
      {
        author: 'James Chen',
        rating: 5,
        text: 'Best travel experience of my life. Bhutan is magical and this team made it even better. Highly recommend!',
        date: 'February 2024'
      }
    ]
  },

  // Trust Architecture Section
  homepage_trust: {
    badgeText: 'Licensed & Insured',
    badgeIcon: 'Shield',
    sectionTitle: 'Why Trust Us',
    inclusions: [
      { text: 'Private Transport' },
      { text: 'Private Guide' },
      { text: 'Luxury Stays' },
      { text: 'Visa Handling' },
      { text: '24/7 Support' }
    ],
    stats: [
      { value: 2500, suffix: '+', label: 'Happy Travelers' },
      { value: 4.9, suffix: '/5', label: 'Average Rating' },
      { value: 10, suffix: '', label: 'Years Experience' }
    ],
    journeyPackages: [],
    socialLinks: [
      { platform: 'Instagram', url: 'https://www.instagram.com/himalayanmarvels.travel/', icon: 'instagram' },
      { platform: 'Facebook', url: 'https://www.facebook.com/himalayanmarvels', icon: 'facebook' }
    ],
    partnerships: [],
    certifications: []
  },

  // Cinematic Scroll Section
  homepage_cinematic: {
    chapters: [
      {
        id: 1,
        title: 'The Call',
        subtitle: 'In a world that never stops',
        description: 'You feel disconnected. Overwhelmed. Yearning for something real...',
        quote: 'The journey of a thousand miles begins with a single step into the unknown.',
        quoteSource: 'Lao Tzu',
        image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
        icon: 'Star',
        color: 'from-purple-500 to-indigo-500'
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
        color: 'from-emerald-500 to-teal-500'
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
        color: 'from-amber-500 to-orange-500'
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
        color: 'from-rose-500 to-pink-500'
      }
    ]
  },

  // Concierge Form Section
  homepage_concierge_form: {
    title: 'Speak With Our',
    description: 'Every journey begins with a conversation, not a form. Share your vision, and we\'ll craft a journey that\'s exclusively yours.',
    formFields: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+1 234 567 8900', required: false },
      { name: 'vision', label: 'Tell us about your dream journey', type: 'textarea', placeholder: 'Share your travel vision...', required: false }
    ],
    contactInfo: {
      email: 'info@himalayanmarvels.com',
      phone: '+975-77270465',
      whatsapp: '+975-77270465',
      responseTime: 'Within 24 hours'
    },
    successMessage: 'Thank you! Our concierge will contact you within 24 hours to start planning your perfect Bhutan journey.'
  },

  // About Page Content
  about_page: {
    heroTitle: 'About Himalayan Marvels',
    heroSubtitle: 'Crafting extraordinary journeys to the Last Shangri-La since 2014',
    story: 'Founded by ex-Ritz-Carlton leadership, Himalayan Marvels brings luxury hospitality standards to Bhutan. We specialize in private, personalized journeys that go beyond typical tourism.',
    mission: 'To create transformative travel experiences that connect you with the authentic spirit of Bhutan.',
    values: ['Authenticity', 'Luxury', 'Sustainability', 'Respect']
  },

  // Concierge Page Content
  concierge_page: {
    title: 'Your Personal Travel Concierge',
    description: '24/7 support for your entire journey',
    services: ['Trip Planning', 'Visa Assistance', 'Flight Booking', 'Local Recommendations']
  },

  // Tours Page Content
  tours_page: {
    heroTitle: 'Discover Bhutan',
    heroSubtitle: 'Curated journeys for the discerning traveler',
    filterText: 'Find your perfect journey'
  },

  // Footer Content
  footer_content: {
    description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists.',
    contactEmail: 'info@himalayanmarvels.com',
    contactPhone: '+975-77270465',
    socialLinks: [
      { platform: 'Instagram', url: 'https://www.instagram.com/himalayanmarvels.travel/' },
      { platform: 'Facebook', url: 'https://www.facebook.com/himalayanmarvels' }
    ],
    quickLinks: [
      { label: 'About', href: '/about' },
      { label: 'Tours', href: '/tours' },
      { label: 'Contact', href: '/#contact' }
    ]
  }
};

export async function seedHomepageContent() {
  const supabase = createClient();

  console.log('🌱 Seeding homepage content...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [key, value] of Object.entries(homepageContent)) {
    try {
      // Check if key already exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .single();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);

        if (updateError) throw updateError;
        console.log(`✓ Updated: ${key}`);
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('settings')
          .insert({
            key,
            value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
        console.log(`✓ Created: ${key}`);
      }

      successCount++;
    } catch (error) {
      console.error(`✗ Failed: ${key}`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✨ Done! ${successCount} sections seeded, ${errorCount} failed`);
  console.log(`🎉 Your homepage now has real data!\n`);

  return { successCount, errorCount };
}

// Run if called directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to window
  window.seedHomepageContent = seedHomepageContent;
}