import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const homepageContent = {
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

  homepage_trust: {
    badgeText: 'Licensed & Insured',
    badgeIcon: 'Shield',
    inclusions: [
      { text: 'Private Transport' },
      { text: 'Private Guide' },
      { text: 'Luxury Stays' },
      { text: 'Visa Handling' }
    ],
    stats: [
      { value: 2500, suffix: '+', label: 'Happy Travelers' },
      { value: 4.9, suffix: '/5', label: 'Rating' },
      { value: 100, suffix: '%', label: 'Happy' }
    ],
    socialLinks: [
      { platform: 'Instagram', url: 'https://www.instagram.com/himalayanmarvels.travel/' },
      { platform: 'Facebook', url: 'https://www.facebook.com/himalayanmarvels' }
    ]
  },

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

  homepage_concierge_form: {
    title: 'Speak With Our',
    description: 'Every journey begins with a conversation, not a form. Share your vision, and we\'ll craft a journey that\'s exclusively yours.',
    formFields: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
      { name: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '+975 77270465', required: false },
      { name: 'vision', label: 'Tell us your vision', type: 'textarea', placeholder: 'Share your travel vision...', required: false }
    ],
    contactInfo: {
      email: 'info@himalayanmarvels.com',
      phone: '+975-77270465',
      whatsapp: '+975-77270465',
      responseTime: 'Within 24 hours'
    },
    successMessage: 'Thank you! Our concierge will contact you within 24 hours.'
  }
};

export async function GET() {
  const supabase = await createClient();
  const errors: string[] = [];
  let successCount = 0;

  for (const [key, value] of Object.entries(homepageContent)) {
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);

        if (error) throw error;
        console.log(`✓ Updated: ${key}`);
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({
            key,
            value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        console.log(`✓ Created: ${key}`);
      }
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${key}: ${errorMsg}`);
      console.error(`✗ Failed: ${key}`, errorMsg);
    }
  }

  return NextResponse.json({
    success: successCount > 0,
    message: `Seeded ${successCount} sections successfully`,
    successCount,
    errorCount: errors.length,
    errors
  });
}
