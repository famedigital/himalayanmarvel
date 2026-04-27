-- ============================================
-- Himalayan Marvels: Lead Capture System
-- Database Setup Script
-- ============================================
-- This script creates the leads table with proper
-- schema, indexes, and Row Level Security (RLS) policies
-- for the tour inquiry capture system.
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS TABLE
-- ============================================
-- Stores tour inquiry/lead data from the website
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact information
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Trip preferences
  country TEXT NOT NULL,
  trip_type TEXT NOT NULL,
  budget TEXT NOT NULL,

  -- Travel dates
  travel_from DATE NOT NULL,
  travel_to DATE NOT NULL,

  -- Lead management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'lost', 'spam')),

  -- Admin notes
  notes TEXT,

  -- Tracking
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Validations
  CONSTRAINT valid_date_range CHECK (travel_to > travel_from),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- INDEXES
-- ============================================
-- Optimize common queries
-- ============================================

-- Index for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Index for date-based queries (recent leads)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Index for email lookups (duplicate checking)
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Composite index for admin dashboard (status + date)
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);

-- ============================================
-- AUTOMATIC UPDATED TIMESTAMP
-- ============================================
-- Trigger to update updated_at on row modification
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS and create policies for secure access
-- ============================================

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC POLICIES
-- ============================================
-- Allow anonymous users to insert leads (website form)
-- ============================================

CREATE POLICY "Public can create leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to view their own leads (not recommended for this use case)
-- Commenting out as we don't want public access to read leads
-- CREATE POLICY "Public can view own leads"
--   ON leads
--   FOR SELECT
--   TO anon
--   USING (false);

-- ============================================
-- AUTHENTICATED POLICIES
-- ============================================
-- Admin users can perform all operations
-- ============================================

-- Admin can view all leads
CREATE POLICY "Admins can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
  );

-- Admin can insert leads (manual entry)
CREATE POLICY "Admins can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
  );

-- Admin can update leads
CREATE POLICY "Admins can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
  );

-- Admin can delete leads
CREATE POLICY "Admins can delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
  );

-- ============================================
-- SERVICE ROLE POLICIES
-- ============================================
-- Service role has full access (for API routes)
-- ============================================

CREATE POLICY "Service role can manage leads"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
-- Useful functions for lead management
-- ============================================

-- Function to get lead statistics
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (
  total_leads BIGINT,
  new_leads BIGINT,
  contacted_leads BIGINT,
  booked_leads BIGINT,
  conversion_rate NUMERIC
) AS $$
  SELECT
    COUNT(*)::BIGINT as total_leads,
    COUNT(*) FILTER (WHERE status = 'new')::BIGINT as new_leads,
    COUNT(*) FILTER (WHERE status = 'contacted')::BIGINT as contacted_leads,
    COUNT(*) FILTER (WHERE status = 'booked')::BIGINT as booked_leads,
    CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE status = 'booked')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as conversion_rate
  FROM leads
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to update lead status
CREATE OR REPLACE FUNCTION update_lead_status(
  lead_id UUID,
  new_status TEXT,
  optional_notes TEXT DEFAULT NULL
)
RETURNS leads AS $$
DECLARE
  lead_record leads;
BEGIN
  -- Validate status
  IF new_status NOT IN ('new', 'contacted', 'quoted', 'booked', 'lost', 'spam') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;

  -- Update the lead
  UPDATE leads
  SET
    status = new_status,
    notes = COALESCE(optional_notes, notes),
    updated_at = NOW()
  WHERE id = lead_id
  RETURNING * INTO lead_record;

  -- Check if lead exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found: %', lead_id;
  END IF;

  RETURN lead_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS
-- ============================================
-- Convenient views for common queries
-- ============================================

-- View for recent leads (last 30 days)
CREATE OR REPLACE VIEW recent_leads AS
SELECT
  id,
  name,
  email,
  country,
  trip_type,
  budget,
  status,
  created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View for leads dashboard summary
CREATE OR REPLACE VIEW leads_dashboard AS
SELECT
  status,
  COUNT(*) as count,
  DATE(created_at) as date
FROM leads
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY status, DATE(created_at)
ORDER BY date DESC, status;

-- ============================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================
-- Uncomment to insert sample lead for testing
-- ============================================

-- INSERT INTO leads (name, email, country, trip_type, budget, travel_from, travel_to)
-- VALUES (
--   'Test User',
--   'test@example.com',
--   'US',
--   'cultural',
--   '4000-7000',
--   NOW() + INTERVAL '30 days',
--   NOW() + INTERVAL '40 days'
-- );

-- ============================================
-- GRANTS
-- ============================================
-- Grant necessary permissions
-- ============================================

-- Grant usage on sequences (if any)
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_lead_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION update_lead_status(UUID, TEXT, TEXT) TO authenticated;

-- Grant select on views
GRANT SELECT ON recent_leads TO authenticated;
GRANT SELECT ON leads_dashboard TO authenticated;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- The leads table is now ready for use!
-- ============================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Lead capture system setup complete!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Table created: leads';
  RAISE NOTICE 'Indexes created: 5';
  RAISE NOTICE 'Policies created: 8';
  RAISE NOTICE 'Functions created: 2';
  RAISE NOTICE 'Views created: 2';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test the API endpoint: /api/leads';
  RAISE NOTICE '2. Create admin leads management page';
  RAISE NOTICE '3. Set up email notifications';
  RAISE NOTICE '===========================================';
END $$;
