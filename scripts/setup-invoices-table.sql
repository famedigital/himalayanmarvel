-- Create invoices table for tracking generated invoices
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  invoice_data JSONB NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- sent, paid, cancelled, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Create index for fast lookups by token
CREATE INDEX IF NOT EXISTS idx_invoices_share_token ON invoices(share_token);
CREATE INDEX IF NOT EXISTS idx_invoices_itinerary_id ON invoices(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy: Admins can do everything
CREATE POLICY "Admins can manage all invoices"
  ON invoices
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Create policy: Public can access invoices by share token (read-only)
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
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoices_updated_at();

-- Reload schema
NOTIFY pgrst, 'reload schema';
