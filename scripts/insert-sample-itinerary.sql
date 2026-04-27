-- Insert Sample Itinerary for Sekar Family
-- Run this in Supabase SQL Editor

-- Read the HTML file content and insert into itineraries table
-- NOTE: You'll need to copy the content from public/itinerary/sekarfamily.html
-- and paste it into the itinerary_template field below

INSERT INTO itineraries (
  title,
  slug,
  subtitle,
  guest_name,
  duration_days,
  duration_nights,
  start_date,
  end_date,
  destinations,
  cover_title,
  cover_subtitle,
  cover_image_url,
  letter_date,
  letter_salutation,
  letter_body,
  letter_signature_name,
  letter_signature_title,
  itinerary_days,
  total_price,
  currency,
  price_inclusions,
  price_exclusions,
  terms_conditions,
  packing_checklist,
  contact_phone,
  contact_email,
  contact_website,
  featured_image_url,
  tags,
  itinerary_template,
  status,
  is_published
) VALUES (
  'Bhutan Family Discovery',
  'bhutan-family-discovery-sekar-family',
  'A Journey to the Land of Happiness',
  'Sekar Family',
  7,
  7,
  '2026-05-16',
  '2026-05-22',
  ARRAY['Bangalore', 'Bagdogra', 'Phuentsholing', 'Thimphu', 'Punakha', 'Guma', 'Paro'],
  'BHUTAN FAMILY DISCOVERY',
  'A Journey to the Land of Happiness',
  'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',
  'May 2026',
  'Namaste, Sekar Family',
  'Welcome to Bhutan – the Land of Gross National Happiness! We are absolutely delighted to curate this unforgettable 7-day journey for your family.',
  'Tshering Lhamo',
  'COO',
  '[
    {"day": 1, "title": "Bangalore to Thimphu • The Adventure Begins", "date": "2026-05-16", "description": "Early morning departure from Bangalore at 05:30 on Akasa Air flight QP-1850.", "highlights": ["Early Morning Flight", "Scenic Dooars Drive"], "meals": ["breakfast", "dinner"], "image_url": "https://www.darjeeling-tourism.com/darj_i000209.jpg", "location": "Thimphu"},
    {"day": 2, "title": "Thimphu Exploration • Cultural Immersion", "date": "2026-05-17", "description": "Full day exploring Thimphus cultural treasures.", "highlights": ["Giant Golden Buddha", "Takin Reserve Visit"], "meals": ["breakfast", "lunch", "dinner"], "image_url": "https://ucarecdn.com/f0daf896-9b67-425a-a09d-97bebd5e6e67/-/resize/600x/", "location": "Thimphu"},
    {"day": 3, "title": "Thimphu to Punakha & Amas Farmstay", "date": "2026-05-18", "description": "Morning drive directly to Punakha. Visit Punakha Dzong.", "highlights": ["Scenic Drive to Punakha", "Punakha Dzong Visit"], "meals": ["breakfast", "lunch", "dinner"], "image_url": "https://yeegetaway.com/wp-content/uploads/2023/03/homestayinPunakha-1024x655.jpg", "location": "Amas Farmstay, Guma"},
    {"day": 4, "title": "Paro Town Exploration • Leisure Day", "date": "2026-05-19", "description": "Enjoy a leisurely morning at Amas Farmstay. Stroll through Paro town.", "highlights": ["Paro Town Stroll", "Traditional Architecture"], "meals": ["breakfast", "lunch", "dinner"], "image_url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/b8/eb/9f/ama-s-farmstay.jpg", "location": "Amas Farmstay"},
    {"day": 5, "title": "Tigers Nest Trek • The Sacred Journey", "date": "2026-05-20", "description": "The most anticipated day! Trek to Taktsang Palphug Monastery (Tigers Nest).", "highlights": ["Legendary Tigers Nest Trek", "Sacred Temple Visit"], "meals": ["breakfast", "lunch", "dinner"], "image_url": "https://www.firefoxtours.com/sites/default/files/styles/red_panda_watermark/public/media/bhutan_gallery/1633.jpg", "location": "Amas Farmstay"},
    {"day": 6, "title": "Paro to Phuentsholing • Border Stay", "date": "2026-05-21", "description": "Morning checkout from Amas Farmstay. Drive to Phuentsholing.", "highlights": ["Scenic 5-Hour Descent", "Immigration Checkout"], "meals": ["breakfast", "dinner"], "image_url": "https://bhutantravelexp.com/wp-content/uploads/2023/05/Zangtopelri-Phuntsholing.jpg", "location": "Phuentsholing"},
    {"day": 7, "title": "Phuentsholing to Bagdogra • Farewell", "date": "2026-05-22", "description": "Morning checkout. Drive to Bagdogra Airport for return flight.", "highlights": ["Morning Departure", "Scenic Dooars Drive"], "meals": ["breakfast"], "image_url": "https://zoartsglobal.com/wp-content/uploads/2020/08/Bhutan-Phuntsholing-1.jpeg", "location": "Bagdogra"}
  ]'::jsonb,
  121250,
  'INR',
  '{"items": ["Premium Accommodation (7 nights)", "English-Speaking Guide", "Hyundai Santa Fe or Similar", "Tigers Nest Entry Fee"]}',
  'Lunch and snacks during journey • Airfare • Personal expenses',
  'A 30% non-refundable deposit is required to confirm your booking.',
  '{"documents": ["Valid Passports", "Voter ID"], "clothing": ["Comfortable walking shoes", "Light woolens"], "essentials": ["Sunscreen", "Lip balm"]}'::jsonb,
  '+975 77773737',
  'info@silverpinebhutan.com',
  'www.silverpinebhutan.com',
  'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',
  ARRAY['Family', 'Cultural', 'Trekking', 'Bhutan'],
  '<!-- HTML TEMPLATE GOES HERE - Copy from public/itinerary/sekarfamily.html and paste here -->',
  'active',
  true
);

-- Note: The itinerary_template field above is a placeholder. After inserting, you should:
-- 1. Get the ID of the inserted itinerary
-- 2. Update it with the actual HTML content from sekarfamily.html

-- UPDATE itineraries SET itinerary_template = '<actual HTML content>' WHERE id = '<inserted-id>';
