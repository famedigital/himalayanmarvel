-- Add tour categories to settings table
-- Run this in Supabase SQL Editor

INSERT INTO settings (key, value, created_at, updated_at)
VALUES (
  'tour_categories',
  '[
    {
      "id": "cultural",
      "title": "Cultural Journeys",
      "subtitle": "7-14 Days",
      "description": "Discover ancient monasteries, sacred festivals, and timeless Bhutanese traditions in comfort.",
      "image": "https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg",
      "price": "From $2,499",
      "link": "/tours?category=cultural"
    },
    {
      "id": "spiritual",
      "title": "Spiritual & Wellness Journeys",
      "subtitle": "8-12 Days",
      "description": "Transformative experiences with meditation, hot stone baths, and private monastery visits.",
      "image": "https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg",
      "price": "From $3,199",
      "link": "/tours?category=spiritual"
    },
    {
      "id": "treks",
      "title": "Himalayan Treks & Expeditions",
      "subtitle": "12-21 Days",
      "description": "Challenge yourself on legendary routes like Snowman Trek through remote Himalayan wilderness.",
      "image": "https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg",
      "price": "From $4,499",
      "link": "/tours?category=treks"
    }
  ]'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Verify the categories were added
SELECT * FROM settings WHERE key = 'tour_categories';
