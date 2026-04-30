-- Insert Sekar Family Itinerary - FIXED VERSION
-- Run this in Supabase SQL Editor

-- Insert main itinerary
WITH new_itinerary AS (
  INSERT INTO itineraries (
    title,
    subtitle,
    logo,
    guest_names,
    no_of_pax,
    entry_point,
    exit_point,
    start_date,
    end_date,
    cover_image,
    letter_date,
    letter_salutation,
    letter_body,
    letter_signature_name,
    letter_signature_title,
    status,
    pricing,
    terms,
    checklist,
    back_cover,
    header_footer
  ) VALUES (
    'BHUTAN FAMILY DISCOVERY',
    'A Journey to the Land of Happiness',
    'Silverpine Bhutan',
    'Sekar Family',
    4,
    'Paro Airport',
    'Paro Airport',
    '2026-05-16',
    '2026-05-22',
    'https://www.atj.com/wp-content/uploads/2023/09/Bhutan-2.jpg',
    'May 2026',
    'Namaste, Sekar Family',
    ARRAY[
      'Welcome to Bhutan – the Land of Gross National Happiness! We are absolutely delighted to curate this unforgettable 7-day journey for your family. From the sacred temples of Thimphu to the majestic Tiger''s Nest, get ready for an adventure that will transform your understanding of happiness and peace.',
      'Your journey begins with an early morning flight from Bangalore to Bagdogra, followed by immigration at Phuentsholing where our English-speaking guide will be waiting at a location near to your drop point. You''ll travel in comfort in a Hyundai Santa Fe or similar premium SUV throughout your trip.',
      'We''ve crafted every detail to ensure your family experiences the very best of Bhutan. From your morning flight from Bangalore to the final drop-off at Bagdogra, every day promises new discoveries and cherished memories.',
      'We look forward to welcoming you to our Himalayan kingdom.'
    ]::TEXT[],
    'Tshering Lhamo',
    'COO',
    'draft',
    '{"currency":"INR","symbol":"₹","total":"1,21,250","total_label":"Total Package Price","items":[{"label":"Luxury Accommodation","description":"Ama''s Farmstay Guma & Paro (4 nights) + Premium Hotels (2 nights) + Phuentsholing (1 night)","amount":""},{"label":"Meals","description":"Daily breakfast & dinner (MAP plan)","amount":""},{"label":"Premium Transport","description":"Hyundai Santa Fe or similar SUV with experienced driver","amount":""},{"label":"English-Speaking Guide","description":"Licensed, knowledgeable guide throughout Bhutan","amount":""}],"inclusions":["Premium Accommodation (7 nights)","English-Speaking Guide","Hyundai Santa Fe or Similar","Tiger''s Nest Entry Fee","All Monument Entrance Fees","Bagdogra Airport Transfers","All SDF Fees","Visa Processing & Immigration","Daily Breakfast & Dinner","Bottled Water During Tours"],"exclusions":["Lunch and snacks during journey","Airfare (Bangalore-Bagdogra-Bangalore)","Personal expenses, tips, and gratuities","Travel insurance (recommended)","Items not mentioned in inclusions"]}'::jsonb,
    '{"booking_payment":"A 30% non-refundable deposit is required to confirm your booking. The remaining balance must be paid 30 days before your arrival date. We accept wire transfers, UPI, and all major credit cards. For Indian guests, payments can be made in INR equivalent.","cancellation_policy":"Full refund (minus deposit) for cancellations made 60+ days before departure. 50% refund for cancellations 30-60 days before. No refund within 30 days of departure unless covered by travel insurance.","travel_insurance":"Travel insurance is recommended for all travelers.","health_fitness":"A reasonable level of fitness is required for the Tiger''s Nest trek. We recommend consulting your doctor before undertaking high-altitude trekking. Inform us of any medical conditions in advance.","liability":"Silverpine Bhutan acts as an agent for hotels, transport, and service providers. We shall not be liable for any injury, damage, loss, delay, or irregularity caused by defects in services or acts of God."}'::jsonb,
    '{"documents":["Valid Passports (6 months validity)","Voter ID (for Indian nationals)","Travel insurance documents","Flight tickets (QP-1850/QP-1851)","Passport size photos (4 copies)","Children''s school ID/birth certificate","Emergency contact numbers","Medical prescriptions"],"clothing":["Comfortable walking shoes","Light woolens/sweaters","Windproof jacket","Casual cotton clothes","Sunglasses & sun hat","Sturdy trekking shoes","Warm jacket/sweater","Comfortable pants (no jeans for trek)","Cap/hat","Extra layer for evenings"],"gear":["Sturdy hiking shoes","Comfortable socks (2 pairs)","Light backpack","Water bottle (1L)","Sunscreen & hat","Light rain jacket","Trekking poles (optional)","Energy snacks","Camera/phone charger","Small first aid kit","Wet wipes","Hand sanitizer","Sunscreen SPF 50+","Lip balm","Moisturizer","Reusable water bottles"],"essentials":["Universal adapters (230V)","Personal medications","Altitude sickness meds","Pain relievers","Band-aids / blister kit"]}'::jsonb,
    '{"title":"JOURNEY AWAITS","logo":"Silverpine Bhutan","email":"info@silverpinebhutan.com","phone":"+975 77773737","website":"www.silverpinebhutan.com","location":"Thimphu, Bhutan","background_image":"https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=2000"}'::jsonb,
    '{"header_left":"Silverpine Bhutan","header_right_title":"Bhutan Family Discovery","header_right_website":"www.silverpinebhutan.com","footer_left":"Silverpine Bhutan","footer_center":"www.silverpinebhutan.com"}'::jsonb
  )
  RETURNING id
)
-- Insert days one by one (simpler approach)
INSERT INTO itinerary_days (itinerary_id, day_number, title, subtitle, altitude, distance, duration, high_point, night_location, description, drop_cap, breakfast, lunch, dinner, snacks, weather_text, temperature, image_url, image_alt, highlights, pull_quote)
SELECT
  (SELECT id FROM new_itinerary),
  1,
  'Bangalore to Thimphu • The Adventure Begins',
  'Flight, Drive & Immigration',
  NULL,
  '~4 hours drive',
  'Full day',
  NULL,
  'Thimphu',
  'Early morning departure from Bangalore at 05:30 on Akasa Air flight QP-1850. Arrive at Bagdogra Airport at 13:20. Your driver will pick you up and proceed to Phuentsholing (approximately 4-hour drive through scenic Dooars region). Complete immigration formalities at the Bhutanese border office – your guide will be waiting at Jaigaon to welcome you and assist with all formalities. After immigration, begin the beautiful ascent to Thimphu, winding through terraced fields and mountain villages. Arrive in Thimphu by evening and check into your hotel. A long but exciting day as you enter the Land of Happiness!',
  true,
  'Hotel buffet',
  'En route',
  'Hotel dinner',
  NULL,
  NULL,
  NULL,
  'https://www.darjeeling-tourism.com/darj_i000209.jpg',
  'Himalayan Mountains',
  ARRAY['Early Morning Flight', 'Scenic Dooars Drive', 'Immigration at Phuentsholing', 'Guide Welcomes at Jaigaon', 'Mountain Ascent to Thimphu']::TEXT[],
  '"From the bustling tech city of Bangalore to the serene peaks of Bhutan – today you leave the modern world behind and enter a realm where time stands still."'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  2,
  'Thimphu Exploration • Cultural Immersion',
  'Full Day Sightseeing',
  NULL,
  NULL,
  'Full day',
  NULL,
  'Thimphu',
  'Full day exploring Thimphu''s cultural treasures with your English-speaking guide. Start at Buddha Point (Kuensel Phodrang) to see the massive Golden Buddha statue overlooking the valley. Visit the Takin Reserve where you can see Bhutan''s national animal – a unique creature that looks like a cross between a cow and a goat! Experience Simply Bhutan, a living museum where you can try traditional archery and dress up in Bhutanese costumes. Stroll through the vibrant Farmers Market (if available) to see local produce and Bhutanese culture. End the day at the peaceful Changyul Park along the Thimphu Chu river – perfect for a family evening walk.',
  true,
  'Hotel buffet',
  'Local restaurant – try Momos!',
  'Bhutanese specialty dinner',
  NULL,
  NULL,
  NULL,
  'https://ucarecdn.com/f0daf896-9b67-425a-a09d-97bebd5e6e67/-/resize/600x/',
  'Buddha Dordenma',
  ARRAY['Giant Golden Buddha', 'Takin Reserve Visit', 'Simply Bhutan Museum', 'Farmers Market', 'Changyul Park Evening']::TEXT[],
  '"Where else can children meet mythical animals, dress like princes, see a Buddha the size of a building, and walk along riverside gardens – all in one day?"'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  3,
  'Thimphu to Punakha & Ama''s Farmstay • Guma Valley Adventure',
  'Punakha Dzong & Farmstay',
  NULL,
  '~3 hours total',
  'Full day',
  NULL,
  'Ama''s Farmstay, Guma (near Punakha)',
  'Morning drive directly to Punakha without intermediate stops. Head straight to the magnificent Punakha Dzong – arguably Bhutan''s most beautiful fortress, situated at the confluence of two rivers. Walk across the dramatic suspension bridge for thrilling views and family photos. For lunch, you have two options: enjoy a traditional homemade meal at Ama''s Farmstay (₹600 per person) or dine at a local restaurant in Punakha. After lunch, take a short 30-minute scenic drive to Guma and check into the charming Ama''s Farmstay – a traditional Bhutanese farmhouse offering authentic hospitality with modern comforts.',
  true,
  'Hotel Thimphu',
  'Ama''s Farmstay (₹600/person) OR Local restaurant – decide in morning!',
  'Ama''s Farmstay – traditional Bhutanese',
  NULL,
  NULL,
  NULL,
  'https://yeegetaway.com/wp-content/uploads/2023/03/homestayinPunakha-1024x655.jpg',
  'Ama''s Farmstay',
  ARRAY['Scenic Drive to Punakha', 'Punakha Dzong Visit', 'Suspension Bridge Walk', 'Lunch at Ama''s OR Local Restaurant', 'Ama''s Farmstay Tour']::TEXT[],
  '"Where rivers meet and happiness flows – Punakha Dzong stands as a testament to Bhutan''s sacred beauty."'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  4,
  'Paro Town Exploration • Leisure Day',
  'Town Stroll & Shopping',
  NULL,
  NULL,
  'Leisure day',
  NULL,
  'Ama''s Farmstay',
  'Enjoy a leisurely morning at Ama''s Farmstay. After breakfast, take a short drive to Paro town for a relaxed day of exploration. Stroll through the charming streets lined with traditional architecture, colorful shops, and cozy cafes. Visit local handicraft stores to pick up souvenirs – Bhutanese textiles, handmade paper, traditional paintings, and prayer flags. Explore the main street and experience the relaxed pace of life in this beautiful valley.',
  true,
  'Ama''s Farmstay',
  'Paro town restaurant',
  'Farmstay dinner with local flavors',
  NULL,
  NULL,
  NULL,
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/b8/eb/9f/ama-s-farmstay.jpg?w=1000&h=1000&s=1',
  'Ama''s Farmstay Paro',
  ARRAY['Paro Town Stroll', 'Traditional Architecture', 'Local Shopping', 'Relaxed Farm Stay']::TEXT[],
  '"In Paro, time flows like the gentle river – slow, steady, and sweet. Today you discover the art of doing nothing, Bhutanese style."'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  5,
  'Tiger''s Nest Trek • The Sacred Journey',
  '4-5 Hours Hike',
  '3,120m',
  '~5km',
  '4-5 hours',
  'Tiger''s Nest Monastery',
  'Ama''s Farmstay',
  'The most anticipated day of your journey! Today you''ll trek to Bhutan''s most iconic landmark – Taktsang Palphug Monastery (Tiger''s Nest), perched dramatically on a cliff 900 meters above the valley floor. Legend says Guru Rinpoche flew here on the back of a tigress. The hike takes about 4-5 hours round trip through beautiful pine forests. Your experienced English-speaking guide will set a comfortable pace with plenty of rest stops. At the top, visit the main temple, photograph breathtaking views, and enjoy lunch at the cafeteria.',
  true,
  'Early energizing breakfast',
  'Taktsang cafeteria with mountain views',
  'Celebration dinner at farmstay',
  NULL,
  NULL,
  NULL,
  'https://www.firefoxtours.com/sites/default/files/styles/red_panda_watermark/public/media/bhutan_gallery/1633.jpg',
  'Tiger''s Nest',
  ARRAY['Legendary Tiger''s Nest Trek', 'Sacred Temple Visit', 'Panoramic Valley Views', 'Lifetime Achievement!']::TEXT[],
  '"To reach the Tiger''s Nest is to touch the sacred – a journey that transforms not just the body, but the soul."'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  6,
  'Paro to Phuentsholing • Border Stay',
  '5 Hours Drive',
  NULL,
  '5 hours',
  'Full day',
  NULL,
  'Phuentsholing',
  'Morning checkout from Ama''s Farmstay after breakfast. Begin the scenic descent from Paro to Phuentsholing (approximately 5-hour drive), passing through ever-changing landscapes – from mountain peaks to subtropical forests. Complete exit formalities and immigration checkout at Phuentsholing. Your Bhutanese guide will bid farewell at the border. Cross over to Jaigaon and check into your hotel in Phuentsholing for a comfortable overnight stay.',
  true,
  'Farmstay breakfast',
  'En route',
  'Hotel dinner',
  NULL,
  NULL,
  NULL,
  'https://bhutantravelexp.com/wp-content/uploads/2023/05/Zangtopelri-Phuntsholing.jpg',
  'Phuentsholing Border',
  ARRAY['Scenic 5-Hour Descent', 'Immigration Checkout', 'Farewell to Guide', 'Border Town Stay']::TEXT[],
  '"As the mountains fade behind you, the memories remain forever etched in your heart – until we meet again in the Land of Happiness."'

UNION ALL

SELECT
  (SELECT id FROM new_itinerary),
  7,
  'Phuentsholing to Bagdogra • Farewell',
  '~4 Hours Drive',
  NULL,
  '~4 hours',
  'Full day',
  NULL,
  NULL,
  'Morning checkout from Phuentsholing hotel after breakfast. Begin your journey to Bagdogra Airport (approximately 4-hour drive through the Dooars region). Arrive by noon for your return flight. Bid farewell to the beautiful Himalayan region as you head to the airport. Board Akasa Air flight QP-1851 departing at 13:20, carrying with you memories of the golden Buddha, the sacred Tiger''s Nest, majestic fortresses, and the warmth of Bhutanese hospitality.',
  false,
  'Phuentsholing hotel',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'https://zoartsglobal.com/wp-content/uploads/2020/08/Bhutan-Phuntsholing-1.jpeg',
  'Farewell',
  ARRAY['Morning Departure', 'Scenic Dooars Drive', 'Return Flight', 'Lifelong Memories']::TEXT[],
  NULL;

-- Insert section openers
INSERT INTO itinerary_section_openers (itinerary_id, section_number, title, subtitle, background_image, overlay_color, page_number)
SELECT
  (SELECT id FROM itineraries WHERE title = 'BHUTAN FAMILY DISCOVERY' ORDER BY created_at DESC LIMIT 1),
  1, 'THE JOURNEY BEGINS', 'Bangalore • Bagdogra • Thimphu',
  'https://scontent.fpbh2-1.fna.fbcdn.net/v/t39.30808-6/606265855_1291141999719160_3376584168833227975_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=iKOhprIuwxgQ7kNvwG8ccwQ&_nc_oc=AdoBOHf9CNVoM0MT-Y12Swj5y18icebYOtCIFzhm99TBB3ltgYgzlcA33chqLHGPyzI&_nc_zt=23&_nc_ht=scontent.fpbh2-1.fna&_nc_gid=CmMroEa6xZISOi20DkQ-DQ&_nc_ss=7b289&oh=00_Af2ketFlvaFu-mU_I9HvQ-2Yp9_1e3j3CS5UclV2n7pfwQ&oe=69F4FE9D',
  'rgba(45,90,61,0.6)', 4

UNION ALL

SELECT
  (SELECT id FROM itineraries WHERE title = 'BHUTAN FAMILY DISCOVERY' ORDER BY created_at DESC LIMIT 1),
  2, 'THIMPHU DISCOVERY', 'Cultural Exploration Day',
  'https://scontent.fpbh2-1.fna.fbcdn.net/v/t39.30808-6/484996524_1062415295921391_2163630259581809224_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=YA09lCGw0K8Q7kNvwFVvRQ4&_nc_oc=AdpVNrrAUTxQDES238KC_1WVOn4cOxrky5K-MkdFNZCiGTSd4Q2-uwlB7JSN1yQ6zP4&_nc_zt=23&_nc_ht=scontent.fpbh2-1.fna&_nc_gid=SpU8FrN-HbWBwVDpt9k4GQ&_nc_ss=7b289&oh=00_Af28Xkaplgmv6J9oZ-h_0M6-1veY8pu6tW-NjuMFfLS9tg&oe=69F4D44C',
  'rgba(45,90,61,0.6)', 6

UNION ALL

SELECT
  (SELECT id FROM itineraries WHERE title = 'BHUTAN FAMILY DISCOVERY' ORDER BY created_at DESC LIMIT 1),
  3, 'VALLEYS OF WONDER', 'Punakha • Guma • Ama''s Farmstay',
  'https://drukcdn.blob.core.windows.net/www/images/media/punakha-dzong2.jpg',
  'rgba(45,90,61,0.6)', 8

UNION ALL

SELECT
  (SELECT id FROM itineraries WHERE title = 'BHUTAN FAMILY DISCOVERY' ORDER BY created_at DESC LIMIT 1),
  4, 'PARO VALLEY', 'Traditional Town & Culture',
  'https://scontent.fpbh2-1.fna.fbcdn.net/v/t39.30808-6/493174133_1093858149443772_2484001306497428332_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_ohc=6sHieJp_tEcQ7kNvwE1jd-x&_nc_oc=Adq-inR6NWm5PSPXIfa8VMefeEtZV6W4VeXgJW6ZvCjsxUf1vnowe4YUwsgusTnWh8U&_nc_zt=23&_nc_ht=scontent.fpbh2-1.fna&_nc_gid=5kpLogRGxF71n-bEnbXfBQ&_nc_ss=7b289&oh=00_Af0Gi5jiKMJd7iA9zdZBY9SRmECQwh-u4qNUz24md2hRKA&oe=69F50B69',
  'rgba(45,90,61,0.6)', 10

UNION ALL

SELECT
  (SELECT id FROM itineraries WHERE title = 'BHUTAN FAMILY DISCOVERY' ORDER BY created_at DESC LIMIT 1),
  5, 'THE SACRED HIKE', 'Tiger''s Nest • A Spiritual Journey',
  'https://www.aliveoutdoors.com/wp-content/uploads/2023/03/Library-11-of-57-scaled.jpeg',
  'rgba(45,90,61,0.6)', 12;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT
  i.id,
  i.title,
  i.guest_names,
  i.start_date,
  i.end_date,
  COUNT(id.id) as day_count,
  COUNT(iso.id) as section_count
FROM itineraries i
LEFT JOIN itinerary_days id ON i.id = id.itinerary_id
LEFT JOIN itinerary_section_openers iso ON i.id = iso.itinerary_id
WHERE i.title = 'BHUTAN FAMILY DISCOVERY'
GROUP BY i.id, i.title, i.guest_names, i.start_date, i.end_date;
