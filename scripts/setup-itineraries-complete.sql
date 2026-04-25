-- Complete Itineraries Setup Script
-- Run this in Supabase SQL Editor to create/update all itinerary tables

-- ============================================================================
-- TABLES (Create or update)
-- ============================================================================

-- Drop existing tables if they exist (for clean recreation)
DROP TABLE IF EXISTS itinerary_section_openers CASCADE;
DROP TABLE IF EXISTS itinerary_days CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;

-- Itineraries table for storing custom tour itineraries
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Cover Info (allow empty strings, NOT NULL without default causes issues)
  title TEXT,
  subtitle TEXT,
  logo TEXT DEFAULT 'Silverpine Bhutan',
  guest_names TEXT,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,

  -- Welcome Letter
  letter_date TEXT,
  letter_salutation TEXT,
  letter_body TEXT[],
  letter_signature_name TEXT,
  letter_signature_title TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  booking_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'final')),

  -- Pricing (stored as JSONB for flexibility)
  pricing JSONB DEFAULT '{
    "currency": "USD",
    "symbol": "$",
    "total": "",
    "total_label": "Total Package Cost",
    "items": [],
    "inclusions": [],
    "exclusions": []
  }'::jsonb,

  -- Terms & Conditions (stored as JSONB)
  terms JSONB DEFAULT '{
    "booking_payment": "A 30% non-refundable deposit is required to confirm your booking. The remaining balance must be paid 30 days before your arrival date.",
    "cancellation_policy": "Full refund (minus deposit) for cancellations made 60+ days before departure. 50% refund for cancellations 30-60 days before. No refund within 30 days of departure.",
    "travel_insurance": "Travel insurance covering trekking up to 4,500m altitude is mandatory for all participants.",
    "health_fitness": "A good level of physical fitness is required. We recommend consulting your doctor before undertaking high-altitude trekking.",
    "liability": "We act as an agent for hotels, transport, and service providers. We shall not be liable for any injury, damage, loss, delay, or irregularity caused by defects in services."
  }'::jsonb,

  -- Checklist (stored as JSONB)
  checklist JSONB DEFAULT '{
    "documents": [
      "Valid passport (6 months validity)",
      "Travel insurance documents",
      "Booking confirmation",
      "Passport photos (4 copies)"
    ],
    "clothing": [
      "Hiking boots (broken in)",
      "Trekking pants (2 pairs)",
      "Thermal underwear",
      "Fleece jacket",
      "Down jacket",
      "Rain jacket",
      "Wool socks (5 pairs)"
    ],
    "gear": [
      "Day backpack (30L)",
      "Water bottle (2L)",
      "Headlamp",
      "Sunscreen SPF 50+",
      "Lip balm",
      "Trekking poles"
    ],
    "essentials": [
      "Personal medications",
      "Altitude sickness meds",
      "Pain relievers",
      "Band-aids / blister kit",
      "Hand sanitizer",
      "Wet wipes"
    ]
  }'::jsonb
);

-- Itinerary Days table for day-by-day entries
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,

  -- Meta information
  altitude TEXT,
  distance TEXT,
  duration TEXT,
  high_point TEXT,
  night_location TEXT,

  -- Content
  description TEXT,
  drop_cap BOOLEAN DEFAULT false,

  -- Menu
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  snacks TEXT,

  -- Weather
  weather_text TEXT,
  temperature TEXT,

  -- Image
  image_url TEXT,
  image_alt TEXT,

  -- Highlights (array of strings)
  highlights TEXT[],

  -- Pull quote
  pull_quote TEXT,

  -- Special boxes (JSONB for flexibility)
  special_boxes JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(itinerary_id, day_number)
);

-- Section Openers table for full-page dividers
CREATE TABLE itinerary_section_openers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  background_image TEXT NOT NULL,
  overlay_color TEXT DEFAULT 'rgba(45,90,61,0.6)',
  page_number INTEGER,

  UNIQUE(itinerary_id, section_number)
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_section_openers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Itineraries: admins full access" ON itineraries;
DROP POLICY IF EXISTS "Itinerary Days: admins full access" ON itinerary_days;
DROP POLICY IF EXISTS "Section Openers: admins full access" ON itinerary_section_openers;

-- Create new policies that check for admin email OR custom role claim
CREATE POLICY "Itineraries: admins full access" ON itineraries
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "Itinerary Days: admins full access" ON itinerary_days
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "Section Openers: admins full access" ON itinerary_section_openers
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_itineraries_created_by ON itineraries(created_by);
CREATE INDEX idx_itineraries_booking_id ON itineraries(booking_id);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_itinerary_days_itinerary_id ON itinerary_days(itinerary_id);
CREATE INDEX idx_section_openers_itinerary_id ON itinerary_section_openers(itinerary_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_itineraries_updated_at ON itineraries;
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Verify everything is set up correctly
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('itineraries', 'itinerary_days', 'itinerary_section_openers')
ORDER BY tablename, policyname;

-- Verify tables exist
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('itineraries', 'itinerary_days', 'itinerary_section_openers')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;
