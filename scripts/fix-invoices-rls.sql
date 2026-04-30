-- Fix Invoices RLS Policy
-- Run this in Supabase SQL Editor

-- First, check if your user has a profile with admin role
-- Uncomment and run this to see your profile:
-- SELECT * FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@himalayanmarvels.com');

-- Option 1: Make sure admin user has role = 'admin'
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@himalayanmarvels.com'
);

-- Option 2: If profile doesn't exist, create it
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT id, email, 'admin', NOW(), NOW()
FROM auth.users
WHERE email = 'admin@himalayanmarvels.com'
AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.users.id);

-- Option 3: Simplify the RLS policy to allow all authenticated users (easier for development)
DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;

CREATE POLICY "Authenticated users can manage invoices"
  ON invoices
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reload schema
NOTIFY pgrst, 'reload schema';
