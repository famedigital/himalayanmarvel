-- Itineraries table for storing custom tour itineraries
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Cover Info
  title TEXT NOT NULL,
  subtitle TEXT,
  logo TEXT DEFAULT 'Silverpine Bhutan',
  guest_names TEXT NOT NULL,
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
  booking_id UUID, -- Removed FK to bookings table (doesn't exist yet)
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'final')),

  -- Pricing (stored as JSONB for flexibility)
  pricing JSONB DEFAULT '{
    "currency": "USD",
    "symbol": "$",
    "items": [],
    "inclusions": [],
    "exclusions": []
  }'::jsonb,

  -- Terms & Conditions (stored as JSONB)
  terms JSONB DEFAULT '{
    "booking_payment": "",
    "cancellation_policy": "",
    "travel_insurance": "",
    "health_fitness": "",
    "liability": ""
  }'::jsonb,

  -- Checklist (stored as JSONB)
  checklist JSONB DEFAULT '{
    "documents": [],
    "clothing": [],
    "gear": [],
    "essentials": []
  }'::jsonb
);

-- Itinerary Days table for day-by-day entries
CREATE TABLE IF NOT EXISTS itinerary_days (
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
CREATE TABLE IF NOT EXISTS itinerary_section_openers (
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

-- Enable Row Level Security
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_section_openers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: admins can do everything (check by email)
CREATE POLICY "Itineraries: admins full access" ON itineraries
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');

CREATE POLICY "Itinerary Days: admins full access" ON itinerary_days
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');

CREATE POLICY "Section Openers: admins full access" ON itinerary_section_openers
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');

-- Indexes for better performance
CREATE INDEX idx_itineraries_created_by ON itineraries(created_by);
CREATE INDEX idx_itineraries_booking_id ON itineraries(booking_id);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_itinerary_days_itinerary_id ON itinerary_days(itinerary_id);
CREATE INDEX idx_section_openers_itinerary_id ON itinerary_section_openers(itinerary_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Template styles (optional presets)
CREATE TABLE IF NOT EXISTS itinerary_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  theme JSONB NOT NULL, -- Color scheme, fonts
  preview_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO itinerary_templates (name, description, theme) VALUES
  ('forest-classic', 'Classic forest green theme (Druk Path style)', '{
    "primary": "#2d5a3d",
    "secondary": "#8b7355",
    "accent": "#c9a961",
    "cream": "#faf8f5",
    "page_number_bg": "#2d5a3d"
  }'),
  ('navy-photography', 'Navy theme for photography tours', '{
    "primary": "#1a2a4a",
    "secondary": "#2d5a3d",
    "accent": "#c9a961",
    "cream": "#faf8f5",
    "page_number_bg": "#1a2a4a"
  }'),
  ('warm-family', 'Warm brown theme for family adventures', '{
    "primary": "#2d5a3d",
    "secondary": "#8b7355",
    "accent": "#c9a961",
    "cream": "#faf8f5",
    "page_number_bg": "#2d5a3d"
  }')
ON CONFLICT (name) DO NOTHING;
