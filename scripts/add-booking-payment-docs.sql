-- Add travel logistics and document columns to bookings table
-- Run this in Supabase SQL Editor

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS guide_details TEXT,
ADD COLUMN IF NOT EXISTS car_details TEXT,
ADD COLUMN IF NOT EXISTS hotel_details TEXT,
ADD COLUMN IF NOT EXISTS visa_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS money_receipt_url TEXT;

-- Verify the columns were added
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('guide_details', 'car_details', 'hotel_details', 'visa_pdf_url', 'money_receipt_url');
