-- Create settings table for storing app-wide configuration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Settings: admins full access" ON settings
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "Settings: public read access" ON settings
  FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key);

-- Verify table was created
SELECT * FROM information_schema.tables WHERE table_name = 'settings';
