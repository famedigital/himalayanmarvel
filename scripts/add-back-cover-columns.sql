-- Add back_cover and header_footer columns to itineraries table
-- Run this in Supabase SQL Editor

ALTER TABLE itineraries
ADD COLUMN IF NOT EXISTS back_cover JSONB DEFAULT '{
  "title": "JOURNEY AWAITS",
  "logo": "Silverpine Bhutan",
  "email": "info@silverpinebhutan.com",
  "phone": "+975 77773737",
  "website": "www.silverpinebhutan.com",
  "location": "Thimphu, Bhutan",
  "background_image": ""
}'::jsonb,
ADD COLUMN IF NOT EXISTS header_footer JSONB DEFAULT '{
  "header_left": "Silverpine Bhutan",
  "header_right_title": "",
  "footer_left": "Silverpine Bhutan",
  "footer_center": "www.silverpinebhutan.com"
}'::jsonb;

-- Verify the columns were added
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'itineraries'
  AND column_name IN ('back_cover', 'header_footer');
