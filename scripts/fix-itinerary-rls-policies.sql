-- Fix RLS Policies for Itineraries Tables
-- Run this in Supabase SQL Editor

-- Drop old policies that don't work
DROP POLICY IF EXISTS "Itineraries: admins full access" ON itineraries;
DROP POLICY IF EXISTS "Itinerary Days: admins full access" ON itinerary_days;
DROP POLICY IF EXISTS "Section Openers: admins full access" ON itinerary_section_openers;

-- Create new policies that check for admin email OR custom role claim
CREATE POLICY "Itineraries: admins full access" ON itineraries
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "Itinerary Days: admins full access" ON itinerary_days
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

CREATE POLICY "Section Openers: admins full access" ON itinerary_section_openers
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com'
    OR auth.jwt() -> 'raw_app_meta_data' ->> 'role' = 'admin'
  );

-- Also fix guest_names to allow empty strings (not the same as NULL)
ALTER TABLE itineraries ALTER COLUMN guest_names DROP NOT NULL;
ALTER TABLE itineraries ALTER COLUMN title DROP NOT NULL;

-- Verify the policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('itineraries', 'itinerary_days', 'itinerary_section_openers');
