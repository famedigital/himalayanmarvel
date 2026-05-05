-- Create Test Itinerary Script
-- Run this in Supabase SQL Editor to create a sample itinerary

-- First, let's temporarily disable RLS for this operation
SET LOCAL statement_timeout = '60s';

ALTER TABLE itineraries DISABLE ROW LEVEL SECURITY;

-- Insert test itinerary
INSERT INTO itineraries (
  title,
  subtitle,
  guest_names,
  start_date,
  end_date,
  cover_image,
  letter_date,
  letter_salutation,
  letter_body,
  letter_signature_name,
  letter_signature_title,
  pricing,
  terms,
  checklist
) VALUES (
  'Bhutan Cultural Discovery',
  'A Journey Through the Last Himalayan Kingdom',
  'Test Family',
  '2025-06-01',
  '2025-06-07',
  'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
  'May 2025',
  'Dear Friends',
  ARRAY[
    'Welcome to the mystical Kingdom of Bhutan, where time stands still and ancient traditions thrive in harmony with modern life.',
    'Your carefully curated journey will take you through pristine valleys, ancient monasteries, and vibrant festivals.'
  ],
  'Tshering Lhamo',
  'COO',
  '{
    "currency": "USD",
    "symbol": "$",
    "total": "3500",
    "total_label": "Total Package Cost",
    "items": [
      {"title": "Accommodation", "description": "5-star hotels throughout"},
      {"title": "All Meals", "description": "Breakfast, lunch, and dinner"}
    ],
    "inclusions": [
      "All airport transfers",
      "Bhutan tourist permit",
      "Museum entrance fees"
    ]
  }'::jsonb,
  '{
    "Booking Terms": "A 30% non-refundable deposit is required to confirm your booking.",
    "Cancellation Policy": "50% refund if cancelled 30 days before travel."
  }'::jsonb,
  '{
    "Documents": [
      "Valid passport (6 months validity)",
      "Travel insurance documents",
      "Booking confirmation"
    ],
    "Clothing": [
      "Hiking boots (broken in)",
      "Trekking pants (2 pairs)",
      "Warm layers"
    ],
    "Essentials": [
      "Sunscreen SPF 50+",
      "Personal medications",
      "Water bottle"
    ]
  }'::jsonb
)
RETURNING id, title;

-- Re-enable RLS
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Get the ID of the created itinerary
DO $$
DECLARE
  itinerary_id UUID;
BEGIN
  SELECT id INTO itinerary_id
  FROM itineraries
  WHERE title = 'Bhutan Cultural Discovery'
  ORDER BY created_at DESC
  LIMIT 1;

  IF itinerary_id IS NOT NULL THEN
    -- Insert sample days
    INSERT INTO itinerary_days (
      itinerary_id,
      day_number,
      title,
      subtitle,
      night_location,
      description,
      image_url,
      highlights,
      breakfast,
      lunch,
      dinner
    ) VALUES
    (
      itinerary_id,
      1,
      'Arrival in Paro • Transfer to Thimphu',
      'Scenic Drive & City Tour',
      'Thimphu',
      'Arrive at Paro International Airport, greeted by our representative with a warm traditional welcome. Transfer to Thimphu, the capital city of Bhutan.',
      'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
      ARRAY['Traditional welcome ceremony', 'Scenic mountain drive', 'Thimphu city exploration'],
      'Continental breakfast at hotel',
      'Riverside restaurant lunch',
      'Hotel Bhutan dinner'
    ),
    (
      itinerary_id,
      2,
      'Thimphu Sightseeing',
      'Cultural Heritage Tour',
      'Thimphu',
      'Explore the cultural heart of Bhutan with visits to ancient monasteries, museums, and traditional markets.',
      'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
      ARRAY['Tashichho Dzong visit', 'National Museum tour', 'Local market experience'],
      'Hotel breakfast',
      'Local restaurant lunch',
      'Traditional Bhutanese dinner'
    ),
    (
      itinerary_id,
      3,
      'Punakha Excursion',
      'The Ancient Capital',
      'Punakha',
      'Journey to Punakha, the ancient capital of Bhutan, crossing the stunning Dochula Pass with panoramic Himalayan views.',
      'https://res.cloudinary.com/dlv3qqv3f/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
      ARRAY['Dochula Pass crossing', 'Punakha Dzong visit', 'Chimi Lhakhang temple'],
      'Mountain view breakfast',
      'Riverside lunch',
      'Farmhouse dinner experience'
    );

    RAISE NOTICE 'Test itinerary created successfully with ID: %', itinerary_id;
    RAISE NOTICE 'You can now preview this itinerary at: /admin/itineraries';
  END IF;
END $$;

-- Verify creation
SELECT
  id,
  title,
  guest_names,
  start_date,
  end_date,
  (SELECT COUNT(*) FROM itinerary_days WHERE itinerary_id = itineraries.id) as day_count
FROM itineraries
WHERE title = 'Bhutan Cultural Discovery'
ORDER BY created_at DESC
LIMIT 1;
