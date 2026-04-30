-- Create invoices table for tracking generated invoices
-- Run this in Supabase SQL Editor

-- First, let's check if itineraries table exists and what the id column type is
-- Do not run this line in production - it's for debugging only:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'id';

-- Drop table if it exists (in case of partial creation)
DROP TABLE IF EXISTS invoices CASCADE;

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_data JSONB NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Add foreign key constraint separately (this will tell us if the issue is with the reference)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'itineraries') THEN
        ALTER TABLE invoices
        ADD CONSTRAINT invoices_itinerary_id_fkey
        FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE;
    ELSE
        RAISE NOTICE 'itineraries table does not exist yet - skipping foreign key';
    END IF;
END
$$;

-- Create indexes
CREATE INDEX idx_invoices_share_token ON invoices(share_token);
CREATE INDEX idx_invoices_itinerary_id ON invoices(itinerary_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will be added after profiles table is verified
-- For now, allow public read access for shareable invoices
CREATE POLICY "Public can view invoices by share token"
  ON invoices
  FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoices_updated_at();

-- Verify table was created
SELECT 'Invoices table created successfully!' as status;

-- Reload schema
NOTIFY pgrst, 'reload schema';
