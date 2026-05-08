-- Create concierge_inquiries table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS concierge_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS concierge_inquiries_email_idx ON concierge_inquiries(email);
CREATE INDEX IF NOT EXISTS concierge_inquiries_created_at_idx ON concierge_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE concierge_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for the contact form)
CREATE POLICY "Anyone can insert inquiries"
  ON concierge_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to view inquiries
CREATE POLICY "Authenticated users can view inquiries"
  ON concierge_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment
COMMENT ON TABLE concierge_inquiries IS 'Contact form submissions from the concierge page';
