-- Add default hero slides to settings table
INSERT INTO settings (key, value, description)
VALUES (
  'hero_slides',
  '[
    {
      "id": "default-hero-1",
      "type": "video",
      "url": "https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4",
      "thumbnail": "",
      "title": "Himalayan Marvels",
      "subtitle": "Experience sacred landscapes, living traditions, and moments of stillness.",
      "link": "/contact"
    }
  ]'::jsonb,
  'Homepage hero slider images and videos'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
