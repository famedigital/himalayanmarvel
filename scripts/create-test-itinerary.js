// Create Test Itinerary Script
// Usage: node scripts/create-test-itinerary.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestItinerary() {
  console.log('🚀 Creating test itinerary...\n');

  try {
    // First, delete any existing test itinerary
    console.log('🗑️  Cleaning up existing test data...');

    // Get existing itinerary IDs
    const { data: existingItineraries } = await supabase
      .from('itineraries')
      .select('id')
      .eq('title', 'Bhutan Cultural Discovery');

    if (existingItineraries && existingItineraries.length > 0) {
      const itineraryIds = existingItineraries.map(i => i.id);

      // Delete days first (foreign key constraint)
      await supabase
        .from('itinerary_days')
        .delete()
        .in('itinerary_id', itineraryIds);

      // Then delete itineraries
      await supabase
        .from('itineraries')
        .delete()
        .in('id', itineraryIds);

      console.log('✅ Cleaned up existing test data');
    }

    // Create the itinerary
    console.log('✨ Creating new itinerary...');
    const itineraryData = {
      title: 'Bhutan Cultural Discovery',
      subtitle: 'A Journey Through the Last Himalayan Kingdom',
      guest_names: 'Test Family',
      start_date: '2025-06-01',
      end_date: '2025-06-07',
      cover_image: 'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
      letter_date: 'May 2025',
      letter_salutation: 'Dear Friends',
      letter_body: [
        'Welcome to the mystical Kingdom of Bhutan, where time stands still and ancient traditions thrive in harmony with modern life.',
        'Your carefully curated journey will take you through pristine valleys, ancient monasteries, and vibrant festivals.'
      ],
      letter_signature_name: 'Tshering Lhamo',
      letter_signature_title: 'COO',
      pricing: {
        currency: 'USD',
        symbol: '$',
        total: '3500',
        total_label: 'Total Package Cost',
        items: [
          { title: 'Accommodation', description: '5-star hotels throughout' },
          { title: 'All Meals', description: 'Breakfast, lunch, and dinner' }
        ],
        inclusions: [
          'All airport transfers',
          'Bhutan tourist permit',
          'Museum entrance fees'
        ]
      },
      terms: {
        'Booking Terms': 'A 30% non-refundable deposit is required to confirm your booking.',
        'Cancellation Policy': '50% refund if cancelled 30 days before travel.'
      },
      checklist: {
        'Documents': [
          'Valid passport (6 months validity)',
          'Travel insurance documents',
          'Booking confirmation'
        ],
        'Clothing': [
          'Hiking boots (broken in)',
          'Trekking pants (2 pairs)',
          'Warm layers'
        ],
        'Essentials': [
          'Sunscreen SPF 50+',
          'Personal medications',
          'Water bottle'
        ]
      }
    };

    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .insert(itineraryData)
      .select()
      .single();

    if (itineraryError) {
      console.error('❌ Failed to create itinerary:', itineraryError);
      console.error('Error details:', JSON.stringify(itineraryError, null, 2));
      process.exit(1);
    }

    console.log('✅ Itinerary created!');
    console.log('   ID:', itinerary.id);
    console.log('   Title:', itinerary.title);

    // Create days
    console.log('\n📅 Creating itinerary days...');
    const days = [
      {
        itinerary_id: itinerary.id,
        day_number: 1,
        title: 'Arrival in Paro • Transfer to Thimphu',
        subtitle: 'Scenic Drive & City Tour',
        night_location: 'Thimphu',
        description: 'Arrive at Paro International Airport, greeted by our representative with a warm traditional welcome. Transfer to Thimphu, the capital city of Bhutan.',
        image_url: 'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
        highlights: ['Traditional welcome ceremony', 'Scenic mountain drive', 'Thimphu city exploration'],
        breakfast: 'Continental breakfast at hotel',
        lunch: 'Riverside restaurant lunch',
        dinner: 'Hotel Bhutan dinner'
      },
      {
        itinerary_id: itinerary.id,
        day_number: 2,
        title: 'Thimphu Sightseeing',
        subtitle: 'Cultural Heritage Tour',
        night_location: 'Thimphu',
        description: 'Explore the cultural heart of Bhutan with visits to ancient monasteries, museums, and traditional markets.',
        image_url: 'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
        highlights: ['Tashichho Dzong visit', 'National Museum tour', 'Local market experience'],
        breakfast: 'Hotel breakfast',
        lunch: 'Local restaurant lunch',
        dinner: 'Traditional Bhutanese dinner'
      },
      {
        itinerary_id: itinerary.id,
        day_number: 3,
        title: 'Punakha Excursion',
        subtitle: 'The Ancient Capital',
        night_location: 'Punakha',
        description: 'Journey to Punakha, the ancient capital of Bhutan, crossing the stunning Dochula Pass with panoramic Himalayan views.',
        image_url: 'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
        highlights: ['Dochula Pass crossing', 'Punakha Dzong visit', 'Chimi Lhakhang temple'],
        breakfast: 'Mountain view breakfast',
        lunch: 'Riverside lunch',
        dinner: 'Farmhouse dinner experience'
      }
    ];

    const { data: createdDays, error: daysError } = await supabase
      .from('itinerary_days')
      .insert(days)
      .select();

    if (daysError) {
      console.error('❌ Failed to create days:', daysError);
    } else {
      console.log(`✅ Created ${createdDays.length} days`);
    }

    // Verify
    console.log('\n🔍 Verifying creation...');
    const { data: verify, error: verifyError } = await supabase
      .from('itineraries')
      .select('*, itinerary_days(count)')
      .eq('id', itinerary.id)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('\n✅ SUCCESS! Itinerary created and verified.\n');
      console.log('Details:');
      console.log('  ID:', verify.id);
      console.log('  Title:', verify.title);
      console.log('  Guest:', verify.guest_names);
      console.log('  Dates:', verify.start_date, '→', verify.end_date);
      console.log('  Days:', verify.itinerary_days[0]?.count || 0);
      console.log('\n🎉 You can now preview this itinerary at:');
      console.log('   http://localhost:3000/admin/itineraries');
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createTestItinerary();
