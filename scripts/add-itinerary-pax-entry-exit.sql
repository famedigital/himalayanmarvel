-- Add no_of_pax, entry_point, exit_point columns to itineraries table
-- Run this in Supabase SQL Editor

ALTER TABLE itineraries
ADD COLUMN IF NOT EXISTS no_of_pax INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS entry_point TEXT DEFAULT 'Paro Airport',
ADD COLUMN IF NOT EXISTS exit_point TEXT DEFAULT 'Paro Airport';

-- Verify the columns were added
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'itineraries'
  AND column_name IN ('no_of_pax', 'entry_point', 'exit_point');
