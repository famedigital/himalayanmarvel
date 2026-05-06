/**
 * Update tour_categories in settings table
 * This script updates the existing record instead of inserting a duplicate
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tourCategories = [
  {
    id: '1',
    title: 'Cultural Journeys',
    subtitle: '7-14 Days',
    description: 'Discover ancient monasteries, sacred festivals, and timeless Bhutanese traditions in comfort.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
    price: 'From $2,499',
    priceDetails: 'Per person, based on 2 travelers',
    badge: 'Recommended',
    highlights: [
      'Private monastery visits',
      'Festival access',
      'Local family dinner',
      'Traditional hot stone bath',
    ],
    availability: 'Limited spots for Spring Festival',
    link: '/tours',
  },
  {
    id: '2',
    title: 'Spiritual Journeys', // Updated from "Spiritual & Wellness Journeys"
    subtitle: '8-12 Days',
    description: 'Transformative experiences with meditation, hot stone baths, and private monastery visits.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
    price: 'From $3,199',
    priceDetails: 'Per person, based on 2 travelers',
    badge: 'Limited',
    highlights: [
      'Private meditation sessions',
      'Hot stone baths',
      'Monastery retreats',
      'Wellness consultations',
    ],
    link: '/tours',
  },
  {
    id: '3',
    title: 'Himalayan Treks & Expeditions',
    subtitle: '12-21 Days',
    description: 'Challenge yourself on legendary routes like Snowman Trek through remote Himalayan wilderness.',
    image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
    price: 'From $4,499',
    priceDetails: 'Per person, based on 2 travelers',
    highlights: [
      'Snowman Trek route',
      'Professional guides',
      'Full camping support',
      'Altitude preparation',
    ],
    availability: 'Book early for permits',
    link: '/tours',
  },
];

async function updateTourCategories() {
  try {
    console.log('Updating tour_categories in settings table...');

    // Use upsert to either insert or update
    const { data, error } = await supabase
      .from('settings')
      .upsert(
        {
          key: 'tour_categories',
          value: tourCategories,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key', // This tells Supabase to update if key already exists
        }
      )
      .select();

    if (error) {
      console.error('Error updating tour categories:', error);
      process.exit(1);
    }

    console.log('✅ Successfully updated tour_categories!');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('\nUpdated categories:');
    tourCategories.forEach((cat) => {
      console.log(`  - ${cat.title}`);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

updateTourCategories();
