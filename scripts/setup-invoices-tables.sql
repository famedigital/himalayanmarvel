-- Setup tables for Invoices and Itineraries system
-- Run with: psql $DATABASE_URL -f scripts/setup-invoices-tables.sql

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLEAN RECREATION FOR DEVELOPMENT
-- =====================================================
-- This will drop and recreate all tables. WARNING: This will delete all existing data!
-- If you want to preserve data, comment out the DROP TABLE statements below.

DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;

-- =====================================================
-- INVOICES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,

  -- Guest Information
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),

  -- Package Information
  package_name VARCHAR(255) NOT NULL,
  package_duration VARCHAR(100),
  travel_dates VARCHAR(100),
  destination VARCHAR(255),

  -- Pricing
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  advance_payment DECIMAL(12, 2) DEFAULT 0,
  balance_due DECIMAL(12, 2) DEFAULT 0,

  -- Payment Details
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid, overdue
  payment_method VARCHAR(100),
  payment_due_date DATE,

  -- Invoice Template (stored as full HTML)
  invoice_template TEXT NOT NULL,

  -- QR Code (stored as base64 or URL)
  qr_code_url TEXT,

  -- Terms & Conditions
  terms TEXT,

  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, paid, cancelled
  sent_date TIMESTAMP,
  viewed_date TIMESTAMP,
  paid_date TIMESTAMP,

  -- Metadata
  notes TEXT,
  internal_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Soft delete
  deleted_at TIMESTAMP
);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_guest_name ON invoices(guest_name);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);

-- =====================================================
-- ITINERARIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,

  -- Basic Information
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  subtitle VARCHAR(255),
  guest_name VARCHAR(255) NOT NULL,

  -- Trip Details
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  destinations TEXT[], -- Array of destinations

  -- Cover Information
  cover_title VARCHAR(255),
  cover_subtitle VARCHAR(255),
  cover_image_url TEXT,

  -- Letter Section
  letter_date VARCHAR(100),
  letter_salutation VARCHAR(255),
  letter_body TEXT,
  letter_signature_name VARCHAR(255),
  letter_signature_title VARCHAR(100),

  -- Itinerary Days (stored as JSONB)
  itinerary_days JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Each day structure:
  -- {
  --   "day": 1,
  --   "title": "Day Title",
  --   "date": "2026-05-16",
  --   "description": "Full description...",
  --   "highlights": ["highlight1", "highlight2"],
  --   "meals": ["breakfast", "lunch", "dinner"],
  --   "image_url": "https://...",
  --   "activities": [...]
  -- }

  -- Pricing Information
  total_price DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  price_inclusions TEXT, -- JSON or formatted text
  price_exclusions TEXT,

  -- Terms & Conditions
  terms_conditions TEXT,

  -- Packing Checklist (stored as JSONB)
  packing_checklist JSONB DEFAULT '{}'::JSONB,
  -- Structure:
  -- {
  --   "documents": ["passport", "visa"],
  --   "clothing": ["item1", "item2"],
  --   "essentials": ["sunscreen", "camera"]
  -- }

  -- Contact Information
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  contact_website VARCHAR(255),

  -- Full Itinerary HTML Template
  itinerary_template TEXT NOT NULL,

  -- Metadata
  featured_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  tags TEXT[],

  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, archived
  is_published BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Soft delete
  deleted_at TIMESTAMP
);

-- Indexes for itineraries
CREATE INDEX IF NOT EXISTS idx_itineraries_slug ON itineraries(slug);
CREATE INDEX IF NOT EXISTS idx_itineraries_guest_name ON itineraries(guest_name);
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_start_date ON itineraries(start_date);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at);
CREATE INDEX IF NOT EXISTS idx_itineraries_booking_id ON itineraries(booking_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_is_published ON itineraries(is_published);

-- =====================================================
-- INVOICE ITEMS TABLE (for line items)
-- =====================================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  -- Item Details
  item_type VARCHAR(50) NOT NULL, -- accommodation, transport, guide, meals, fees, other
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12, 2) DEFAULT 0,
  total_price DECIMAL(12, 2) DEFAULT 0,

  -- Additional Info
  duration VARCHAR(100),
  notes TEXT,

  -- Display Order
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for invoice items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_display_order ON invoice_items(display_order);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  );

CREATE POLICY "Admins can manage all itineraries"
  ON itineraries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  );

CREATE POLICY "Admins can manage all invoice_items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@himalayanmarvels.com'
    )
  );

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  prefix VARCHAR(10) := 'HMM';
  year_part VARCHAR(4) := TO_CHAR(CURRENT_DATE, 'YYYY');
  seq_num INTEGER;
BEGIN
  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS INTEGER)), 0) + 1
  INTO seq_num
  FROM invoices
  WHERE invoice_number LIKE prefix || '/' || year_part || '/%';

  RETURN prefix || '/' || year_part || '/' || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get invoice statistics
CREATE OR REPLACE FUNCTION get_invoice_stats()
RETURNS TABLE (
  total_invoices BIGINT,
  pending_amount DECIMAL,
  paid_amount DECIMAL,
  overdue_count BIGINT
) AS $$
  SELECT
    COUNT(*)::BIGINT as total_invoices,
    COALESCE(SUM(CASE WHEN payment_status IN ('pending', 'partial') THEN balance_due ELSE 0 END), 0) as pending_amount,
    COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END), 0) as paid_amount,
    COUNT(*) FILTER (WHERE payment_status = 'pending' AND payment_due_date < CURRENT_DATE)::BIGINT as overdue_count
  FROM invoices
  WHERE deleted_at IS NULL;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get itinerary statistics
CREATE OR REPLACE FUNCTION get_itinerary_stats()
RETURNS TABLE (
  total_itineraries BIGINT,
  active_itineraries BIGINT,
  upcoming_trips BIGINT,
  total_guests BIGINT
) AS $$
  SELECT
    COUNT(*)::BIGINT as total_itineraries,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_itineraries,
    COUNT(*) FILTER (WHERE start_date >= CURRENT_DATE)::BIGINT as upcoming_trips,
    -- This is a rough estimate, adjust as needed
    COUNT(DISTINCT guest_name)::BIGINT as total_guests
  FROM itineraries
  WHERE deleted_at IS NULL;
$$ LANGUAGE SQL SECURITY DEFINER;
