-- Settings System Database Schema
-- Run this in Supabase SQL Editor to create company_settings and user_profiles tables

-- ============================================
-- Company Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Himalayan Marvels Travels',
  license_number TEXT,
  mobile TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  logo_url TEXT,

  -- Bank details for multiple currencies
  bank_details JSONB DEFAULT '{
    "INR": {
      "bank_name": "",
      "account_number": "",
      "ifsc": "",
      "branch": ""
    },
    "USD": {
      "bank_name": "",
      "account_number": "",
      "swift": "",
      "branch": ""
    },
    "EUR": {
      "bank_name": "",
      "account_number": "",
      "swift": "",
      "branch": ""
    }
  }'::jsonb,

  -- Tax information
  tax_id TEXT,
  gst_number TEXT,

  -- Social media
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,

  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for company_settings
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read company settings (needed for invoices, public site)
CREATE POLICY "Public can read company settings" ON company_settings
  FOR SELECT USING (true);

-- Only admins can update company settings
CREATE POLICY "Admins can update company settings" ON company_settings
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'admin'
    )
  );

-- ============================================
-- User Profiles Table (RBAC)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'reservation_staff',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Additional profile info
  phone TEXT,
  department TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT user_profiles_role_check CHECK (role IN ('admin', 'reservation_staff', 'account_staff'))
);

-- Row Level Security for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can do everything on user_profiles
CREATE POLICY "Admins have full access to user_profiles" ON user_profiles
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'admin'
    )
  );

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own basic info (not role)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (
    auth.uid() = id AND
    -- Prevent role changes through self-update
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = role
  );

-- ============================================
-- Insert default company settings if none exists
-- ============================================
INSERT INTO company_settings (
  company_name,
  email,
  website,
  mobile,
  license_number,
  address
)
SELECT
  'Himalayan Marvels Travels',
  'info@himalayanmarvels.com',
  'https://www.himalayanmarvels.com',
  '+975 2 322489',
  '20309000207',
  'Thimphu, Bhutan'
WHERE NOT EXISTS (SELECT 1 FROM company_settings);

-- ============================================
-- Grant necessary permissions
-- ============================================
-- Grant usage on sequences if needed
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- ============================================
-- Create helper function to check user role
-- ============================================
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid();
$$;

-- ============================================
-- Create trigger to auto-create user_profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );

  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE company_settings IS 'Stores company-wide settings including bank details, contact info, and branding';
COMMENT ON TABLE user_profiles IS 'Extends Supabase auth.users with role-based access control (RBAC)';
COMMENT ON COLUMN user_profiles.role IS 'User role: admin (full access), reservation_staff (itineraries/bookings/blog), account_staff (invoices/payments/settings)';
COMMENT ON COLUMN company_settings.bank_details IS 'Bank details for INR, USD, EUR currencies stored as JSONB';
