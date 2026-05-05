-- Operations Management Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================================
-- OPERATION ASSIGNMENT TABLES
-- ============================================================================

-- Guide Assignments
CREATE TABLE IF NOT EXISTS operation_guide_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  guide_name TEXT NOT NULL,
  guide_phone TEXT,
  guide_email TEXT,
  guide_license TEXT,
  guide_experience TEXT,

  assignment_status TEXT DEFAULT 'pending' CHECK (assignment_status IN ('pending', 'assigned', 'confirmed', 'completed', 'cancelled')),
  assigned_date TIMESTAMPTZ,
  confirmed_date TIMESTAMPTZ,

  notes TEXT,
  rate_per_day NUMERIC,
  total_days INTEGER,

  created_by UUID REFERENCES auth.users(id)
);

-- Transport/Driver Assignments
CREATE TABLE IF NOT EXISTS operation_transport_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  driver_name TEXT NOT NULL,
  driver_phone TEXT,
  driver_license TEXT,

  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT,
  vehicle_capacity INTEGER,

  assignment_status TEXT DEFAULT 'pending' CHECK (assignment_status IN ('pending', 'assigned', 'confirmed', 'completed', 'cancelled')),
  assigned_date TIMESTAMPTZ,
  confirmed_date TIMESTAMPTZ,

  pickup_location TEXT,
  dropoff_location TEXT,
  route_details TEXT,

  notes TEXT,
  rate_per_day NUMERIC,
  total_days INTEGER,

  created_by UUID REFERENCES auth.users(id)
);

-- Hotel Assignments
CREATE TABLE IF NOT EXISTS operation_hotel_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  hotel_name TEXT NOT NULL,
  location TEXT,
  contact_person TEXT,
  contact_phone TEXT,

  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  room_type TEXT,
  number_of_rooms INTEGER DEFAULT 1,

  confirmation_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),

  booking_proof_url TEXT,
  booking_date TIMESTAMPTZ,
  confirmed_date TIMESTAMPTZ,

  rate_per_room NUMERIC,
  total_cost NUMERIC,

  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- Guest Passport Tracking
CREATE TABLE IF NOT EXISTS operation_guest_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  guest_name TEXT NOT NULL,
  passport_number TEXT,
  passport_expiry DATE,
  passport_scan_url TEXT,
  date_of_birth DATE,
  nationality TEXT DEFAULT 'Indian',
  place_of_issue TEXT,

  status TEXT DEFAULT 'not_received' CHECK (status IN ('not_received', 'received', 'verified', 'submitted_for_permit', 'returned')),

  received_date TIMESTAMPTZ,
  verified_date TIMESTAMPTZ,
  submitted_for_permit_date TIMESTAMPTZ,
  returned_date TIMESTAMPTZ,

  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- Permit Tracking
CREATE TABLE IF NOT EXISTS operation_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  permit_type TEXT NOT NULL CHECK (permit_type IN ('entry_permit', 'trekking_permit', 'special_area_permit', 'driving_permit')),
  guest_name TEXT,

  application_date DATE,
  status TEXT DEFAULT 'not_applied' CHECK (status IN ('not_applied', 'applied', 'under_review', 'approved', 'rejected', 'issued', 'expired')),

  permit_number TEXT,
  permit_url TEXT,
  issue_date DATE,
  expiry_date DATE,

  cost NUMERIC,
  payment_receipt_url TEXT,

  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_guide_assignments_booking ON operation_guide_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_status ON operation_guide_assignments(assignment_status);

CREATE INDEX IF NOT EXISTS idx_transport_assignments_booking ON operation_transport_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_transport_assignments_status ON operation_transport_assignments(assignment_status);

CREATE INDEX IF NOT EXISTS idx_hotel_assignments_booking ON operation_hotel_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_hotel_assignments_status ON operation_hotel_assignments(status);
CREATE INDEX IF NOT EXISTS idx_hotel_assignments_dates ON operation_hotel_assignments(check_in_date, check_out_date);

CREATE INDEX IF NOT EXISTS idx_passports_booking ON operation_guest_passports(booking_id);
CREATE INDEX IF NOT EXISTS idx_passports_status ON operation_guest_passports(status);
CREATE INDEX IF NOT EXISTS idx_passports_expiry ON operation_guest_passports(passport_expiry);

CREATE INDEX IF NOT EXISTS idx_permits_booking ON operation_permits(booking_id);
CREATE INDEX IF NOT EXISTS idx_permits_status ON operation_permits(status);
CREATE INDEX IF NOT EXISTS idx_permits_type ON operation_permits(permit_type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE operation_guide_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_transport_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_hotel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_guest_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_permits ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "operation_guides_admin_full" ON operation_guide_assignments
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "operation_transport_admin_full" ON operation_transport_assignments
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "operation_hotels_admin_full" ON operation_hotel_assignments
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "operation_passports_admin_full" ON operation_guest_passports
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "operation_permits_admin_full" ON operation_permits
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

-- ============================================================================
-- UPDATED AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_operation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_guide_assignments_updated_at ON operation_guide_assignments;
CREATE TRIGGER update_guide_assignments_updated_at
  BEFORE UPDATE ON operation_guide_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_operation_updated_at();

DROP TRIGGER IF EXISTS update_transport_assignments_updated_at ON operation_transport_assignments;
CREATE TRIGGER update_transport_assignments_updated_at
  BEFORE UPDATE ON operation_transport_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_operation_updated_at();

DROP TRIGGER IF EXISTS update_hotel_assignments_updated_at ON operation_hotel_assignments;
CREATE TRIGGER update_hotel_assignments_updated_at
  BEFORE UPDATE ON operation_hotel_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_operation_updated_at();

DROP TRIGGER IF EXISTS update_passports_updated_at ON operation_guest_passports;
CREATE TRIGGER update_passports_updated_at
  BEFORE UPDATE ON operation_guest_passports
  FOR EACH ROW
  EXECUTE FUNCTION update_operation_updated_at();

DROP TRIGGER IF EXISTS update_permits_updated_at ON operation_permits;
CREATE TRIGGER update_permits_updated_at
  BEFORE UPDATE ON operation_permits
  FOR EACH ROW
  EXECUTE FUNCTION update_operation_updated_at();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT
  '✅ Operations tables created successfully!' as status,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = operation_tables.table_name) as column_count
FROM (
  VALUES
    ('operation_guide_assignments'),
    ('operation_transport_assignments'),
    ('operation_hotel_assignments'),
    ('operation_guest_passports'),
    ('operation_permits')
) AS operation_tables(table_name)
ORDER BY table_name;
