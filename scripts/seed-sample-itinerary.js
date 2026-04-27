/**
 * Seed Sample Itinerary from sekarfamily.html
 * Run with: node scripts/seed-sample-itinerary.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedSampleItinerary() {
  console.log('\n📄 Seeding Sample Itinerary...\n');

  try {
    // Read the HTML file
    const htmlPath = path.join(__dirname, '../public/itinerary/sekarfamily.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Sample itinerary data based on the HTML
    const sampleItinerary = {
      title: 'Bhutan Family Discovery',
      slug: 'bhutan-family-discovery-sekar-family',
      subtitle: 'A Journey to the Land of Happiness',
      guest_name: 'Sekar Family',

      duration_days: 7,
      duration_nights: 7,
      start_date: '2026-05-16',
      end_date: '2026-05-22',
      destinations: ['Bangalore', 'Bagdogra', 'Phuentsholing', 'Thimphu', 'Punakha', 'Guma', 'Paro'],

      cover_title: 'BHUTAN FAMILY DISCOVERY',
      cover_subtitle: 'A Journey to the Land of Happiness',
      cover_image_url: 'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',

      letter_date: 'May 2026',
      letter_salutation: 'Namaste, Sekar Family',
      letter_body: 'Welcome to Bhutan – the Land of Gross National Happiness! We are absolutely delighted to curate this unforgettable 7-day journey for your family. From the sacred temples of Thimphu to the majestic Tiger\'s Nest, get ready for an adventure that will transform your understanding of happiness and peace.',
      letter_signature_name: 'Tshering Lhamo',
      letter_signature_title: 'COO',

      // Itinerary days as JSONB
      itinerary_days: [
        {
          day: 1,
          title: 'Bangalore to Thimphu • The Adventure Begins',
          date: '2026-05-16',
          description: 'Early morning departure from Bangalore at 05:30 on Akasa Air flight QP-1850. Arrive at Bagdogra Airport at 13:20. Your driver will pick you up and proceed to Phuentsholing (approximately 4-hour drive through scenic Dooars region). Complete immigration formalities at the Bhutanese border office – your guide will be waiting at Jaigaon to welcome you and assist with all formalities.',
          highlights: ['Early Morning Flight', 'Scenic Dooars Drive', 'Immigration at Phuentsholing', 'Guide Welcomes at Jaigaon', 'Mountain Ascent to Thimphu'],
          meals: ['breakfast', 'dinner'],
          image_url: 'https://www.darjeeling-tourism.com/darj_i000209.jpg',
          location: 'Thimphu'
        },
        {
          day: 2,
          title: 'Thimphu Exploration • Cultural Immersion',
          date: '2026-05-17',
          description: 'Full day exploring Thimphu\'s cultural treasures with your English-speaking guide. Start at Buddha Point (Kuensel Phodrang) to see the massive Golden Buddha statue overlooking the valley. Visit the Takin Reserve where you can see Bhutan\'s national animal – a unique creature that looks like a cross between a cow and a goat!',
          highlights: ['Giant Golden Buddha', 'Takin Reserve Visit', 'Simply Bhutan Museum', 'Farmers Market', 'Changyul Park Evening'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://ucarecdn.com/f0daf896-9b67-425a-a09d-97bebd5e6e67/-/resize/600x/',
          location: 'Thimphu'
        },
        {
          day: 3,
          title: 'Thimphu to Punakha & Ama\'s Farmstay • Guma Valley Adventure',
          date: '2026-05-18',
          description: 'Morning drive directly to Punakha without intermediate stops. Head straight to the magnificent Punakha Dzong – arguably Bhutan\'s most beautiful fortress, situated at the confluence of two rivers. Walk across the dramatic suspension bridge for thrilling views and family photos.',
          highlights: ['Scenic Drive to Punakha', 'Punakha Dzong Visit', 'Suspension Bridge Walk', 'Lunch at Ama\'s OR Local Restaurant', 'Ama\'s Farmstay Tour'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://yeegetaway.com/wp-content/uploads/2023/03/homestayinPunakha-1024x655.jpg',
          location: 'Ama\'s Farmstay, Guma'
        },
        {
          day: 4,
          title: 'Paro Town Exploration • Leisure Day',
          date: '2026-05-19',
          description: 'Enjoy a leisurely morning at Ama\'s Farmstay. After breakfast, take a short drive to Paro town for a relaxed day of exploration. Stroll through the charming streets lined with traditional architecture, colorful shops, and cozy cafes.',
          highlights: ['Paro Town Stroll', 'Traditional Architecture', 'Local Shopping', 'Relaxed Farm Stay'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/b8/eb/9f/ama-s-farmstay.jpg?w=1000&h=1000&s=1',
          location: 'Ama\'s Farmstay'
        },
        {
          day: 5,
          title: 'Tiger\'s Nest Trek • The Sacred Journey',
          date: '2026-05-20',
          description: 'The most anticipated day of your journey! Today you\'ll trek to Bhutan\'s most iconic landmark – Taktsang Palphug Monastery (Tiger\'s Nest), perched dramatically on a cliff 900 meters above the valley floor.',
          highlights: ['Legendary Tiger\'s Nest Trek', 'Sacred Temple Visit', 'Panoramic Valley Views', 'Lifetime Achievement!'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://www.firefoxtours.com/sites/default/files/styles/red_panda_watermark/public/media/bhutan_gallery/1633.jpg',
          location: 'Ama\'s Farmstay'
        },
        {
          day: 6,
          title: 'Paro to Phuentsholing • Border Stay',
          date: '2026-05-21',
          description: 'Morning checkout from Ama\'s Farmstay after breakfast. Begin the scenic descent from Paro to Phuentsholing (approximately 5-hour drive), passing through ever-changing landscapes – from mountain peaks to subtropical forests.',
          highlights: ['Scenic 5-Hour Descent', 'Immigration Checkout', 'Farewell to Guide', 'Border Town Stay'],
          meals: ['breakfast', 'dinner'],
          image_url: 'https://bhutantravelexp.com/wp-content/uploads/2023/05/Zangtopelri-Phuntsholing.jpg',
          location: 'Phuentsholing'
        },
        {
          day: 7,
          title: 'Phuentsholing to Bagdogra • Farewell',
          date: '2026-05-22',
          description: 'Morning checkout from Phuentsholing hotel after breakfast. Begin your journey to Bagdogra Airport (approximately 4-hour drive through the Dooars region). Arrive by noon for your return flight.',
          highlights: ['Morning Departure', 'Scenic Dooars Drive', 'Return Flight', 'Lifelong Memories'],
          meals: ['breakfast'],
          image_url: 'https://zoartsglobal.com/wp-content/uploads/2020/08/Bhutan-Phuntsholing-1.jpeg',
          location: 'Bagdogra'
        }
      ],

      total_price: 121250,
      currency: 'INR',

      price_inclusions: JSON.stringify({
        items: [
          'Premium Accommodation (7 nights)',
          'English-Speaking Guide',
          'Hyundai Santa Fe or Similar',
          'Tiger\'s Nest Entry Fee',
          'All Monument Entrance Fees',
          'Bagdogra Airport Transfers',
          'All SDF Fees',
          'Visa Processing & Immigration',
          'Daily Breakfast & Dinner',
          'Bottled Water During Tours'
        ]
      }),

      price_exclusions: 'Lunch and snacks during journey • Airfare (Bangalore-Bagdogra-Bangalore) • Personal expenses, tips, and gratuities • Travel insurance (recommended) • Items not mentioned in inclusions',

      terms_conditions: 'A 30% non-refundable deposit is required to confirm your booking. The remaining balance must be paid 30 days before your arrival date. Full refund (minus deposit) for cancellations made 60+ days before departure. 50% refund for cancellations 30-60 days before. No refund within 30 days of departure.',

      packing_checklist: {
        documents: ['Valid Passports (6 months validity)', 'Voter ID (for Indian nationals)', 'Travel insurance documents', 'Flight tickets'],
        clothing: ['Comfortable walking shoes', 'Light woolens/sweaters', 'Windproof jacket', 'Casual cotton clothes', 'Sunglasses & sun hat'],
        essentials: ['Sunscreen SPF 50+', 'Lip balm', 'Moisturizer', 'Wet wipes & sanitizer', 'Reusable water bottles'],
        trekking: ['Sturdy hiking shoes', 'Light backpack', 'Water bottle (1L)', 'Sunscreen & hat', 'Light rain jacket']
      },

      contact_phone: '+975 77773737',
      contact_email: 'info@silverpinebhutan.com',
      contact_website: 'www.silverpinebhutan.com',

      featured_image_url: 'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',
      gallery_images: [
        'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',
        'https://ucarecdn.com/f0daf896-9b67-425a-a09d-97bebd5e6e67/-/resize/600x/',
        'https://www.firefoxtours.com/sites/default/files/styles/red_panda_watermark/public/media/bhutan_gallery/1633.jpg'
      ],

      tags: ['Family', 'Cultural', 'Trekking', 'Bhutan', 'Wellness'],

      // The full HTML template
      itinerary_template: htmlContent,

      status: 'active',
      is_published: true
    };

    // Insert the itinerary
    const { data, error } = await supabase
      .from('itineraries')
      .insert(sampleItinerary)
      .select();

    if (error) {
      console.error('❌ Error inserting itinerary:', error.message);
      process.exit(1);
    }

    console.log('✅ Sample itinerary inserted successfully!\n');
    console.log('📋 Itinerary Details:');
    console.log(`   Title: ${sampleItinerary.title}`);
    console.log(`   Guest: ${sampleItinerary.guest_name}`);
    console.log(`   Duration: ${sampleItinerary.duration_days}D/${sampleItinerary.duration_nights}N`);
    console.log(`   Dates: ${sampleItinerary.start_date} to ${sampleItinerary.end_date}`);
    console.log(`   Price: ₹${sampleItinerary.total_price.toLocaleString('en-IN')}`);
    console.log('\n🎉 You can now view this itinerary at /admin/itineraries\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedSampleItinerary();
