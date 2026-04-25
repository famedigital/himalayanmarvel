-- Add itinerary_id, entry_point and exit_point columns to bookings table
-- Run this in Supabase SQL Editor

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS itinerary_id UUID REFERENCES itineraries(id),
ADD COLUMN IF NOT EXISTS entry_point TEXT DEFAULT 'Paro Airport',
ADD COLUMN IF NOT EXISTS exit_point TEXT DEFAULT 'Paro Airport';

-- Verify the columns were added
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('itinerary_id', 'entry_point', 'exit_point');
