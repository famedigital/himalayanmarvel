-- Fix Invoices RLS Policy - Simplified (no profiles table dependency)
-- Run this in Supabase SQL Editor

-- Drop the broken policy that references non-existent profiles table
DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;

-- Create a simple policy that allows all authenticated users to manage invoices
CREATE POLICY "Authenticated users can manage invoices"
  ON invoices
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reload schema so Supabase recognizes the changes
NOTIFY pgrst, 'reload schema';

-- Verify the policy was created
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
WHERE tablename = 'invoices';
