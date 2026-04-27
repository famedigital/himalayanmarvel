import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Read the HTML file
    const htmlPath = path.join(process.cwd(), 'public/itinerary/sekarfamily.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Sample itinerary data
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
      letter_body: 'Welcome to Bhutan – the Land of Gross National Happiness! We are absolutely delighted to curate this unforgettable 7-day journey for your family.',
      letter_signature_name: 'Tshering Lhamo',
      letter_signature_title: 'COO',

      itinerary_days: [
        {
          day: 1,
          title: 'Bangalore to Thimphu • The Adventure Begins',
          date: '2026-05-16',
          description: 'Early morning departure from Bangalore at 05:30 on Akasa Air flight QP-1850.',
          highlights: ['Early Morning Flight', 'Scenic Dooars Drive', 'Immigration at Phuentsholing'],
          meals: ['breakfast', 'dinner'],
          image_url: 'https://www.darjeeling-tourism.com/darj_i000209.jpg',
          location: 'Thimphu'
        },
        {
          day: 2,
          title: 'Thimphu Exploration • Cultural Immersion',
          date: '2026-05-17',
          description: 'Full day exploring Thimphu\'s cultural treasures with your English-speaking guide.',
          highlights: ['Giant Golden Buddha', 'Takin Reserve Visit', 'Simply Bhutan Museum'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://ucarecdn.com/f0daf896-9b67-425a-a09d-97bebd5e6e67/-/resize/600x/',
          location: 'Thimphu'
        },
        {
          day: 3,
          title: 'Thimphu to Punakha & Ama\'s Farmstay',
          date: '2026-05-18',
          description: 'Morning drive directly to Punakha. Visit Punakha Dzong.',
          highlights: ['Scenic Drive to Punakha', 'Punakha Dzong Visit', 'Suspension Bridge Walk'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://yeegetaway.com/wp-content/uploads/2023/03/homestayinPunakha-1024x655.jpg',
          location: 'Ama\'s Farmstay, Guma'
        },
        {
          day: 4,
          title: 'Paro Town Exploration • Leisure Day',
          date: '2026-05-19',
          description: 'Enjoy a leisurely morning at Ama\'s Farmstay. Stroll through Paro town.',
          highlights: ['Paro Town Stroll', 'Traditional Architecture', 'Local Shopping'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/b8/eb/9f/ama-s-farmstay.jpg',
          location: 'Ama\'s Farmstay'
        },
        {
          day: 5,
          title: 'Tiger\'s Nest Trek • The Sacred Journey',
          date: '2026-05-20',
          description: 'The most anticipated day! Trek to Taktsang Palphug Monastery (Tiger\'s Nest).',
          highlights: ['Legendary Tiger\'s Nest Trek', 'Sacred Temple Visit', 'Panoramic Valley Views'],
          meals: ['breakfast', 'lunch', 'dinner'],
          image_url: 'https://www.firefoxtours.com/sites/default/files/styles/red_panda_watermark/public/media/bhutan_gallery/1633.jpg',
          location: 'Ama\'s Farmstay'
        },
        {
          day: 6,
          title: 'Paro to Phuentsholing • Border Stay',
          date: '2026-05-21',
          description: 'Morning checkout from Ama\'s Farmstay. Drive to Phuentsholing.',
          highlights: ['Scenic 5-Hour Descent', 'Immigration Checkout', 'Farewell to Guide'],
          meals: ['breakfast', 'dinner'],
          image_url: 'https://bhutantravelexp.com/wp-content/uploads/2023/05/Zangtopelri-Phuntsholing.jpg',
          location: 'Phuentsholing'
        },
        {
          day: 7,
          title: 'Phuentsholing to Bagdogra • Farewell',
          date: '2026-05-22',
          description: 'Morning checkout. Drive to Bagdogra Airport for return flight.',
          highlights: ['Morning Departure', 'Scenic Dooars Drive', 'Return Flight'],
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
          'All Monument Entrance Fees'
        ]
      }),

      price_exclusions: 'Lunch and snacks during journey • Airfare • Personal expenses',

      terms_conditions: 'A 30% non-refundable deposit is required to confirm your booking.',

      packing_checklist: {
        documents: ['Valid Passports', 'Voter ID', 'Travel insurance'],
        clothing: ['Comfortable walking shoes', 'Light woolens', 'Windproof jacket'],
        essentials: ['Sunscreen', 'Lip balm', 'Moisturizer']
      },

      contact_phone: '+975 77773737',
      contact_email: 'info@silverpinebhutan.com',
      contact_website: 'www.silverpinebhutan.com',

      featured_image_url: 'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',

      tags: ['Family', 'Cultural', 'Trekking', 'Bhutan'],

      itinerary_template: htmlContent,

      status: 'active',
      is_published: true
    };

    // Check if already exists
    const { data: existing } = await supabase
      .from('itineraries')
      .select('id')
      .eq('slug', 'bhutan-family-discovery-sekar-family')
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Sample itinerary already exists. Delete it first or use a different slug.'
      });
    }

    // Insert the itinerary
    const { data, error } = await supabase
      .from('itineraries')
      .insert(sampleItinerary)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sample itinerary inserted successfully!',
      itinerary: data?.[0]
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
