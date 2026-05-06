-- Add images column to itinerary_days table
-- This allows storing multiple images per day for the gallery feature

ALTER TABLE itinerary_days
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN itinerary_days.images IS 'Array of additional image URLs for the day gallery';
