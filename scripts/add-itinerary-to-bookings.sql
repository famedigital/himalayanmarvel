-- Add itinerary_id column to bookings table
ALTER TABLE bookings
ADD COLUMN itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_itinerary_id ON bookings(itinerary_id);
