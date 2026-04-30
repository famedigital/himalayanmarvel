-- Migration: Add comprehensive status options to invoices table
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing status column if it has limited options
-- First, update any existing records to use new status values
UPDATE invoices
SET status = CASE
  WHEN status = 'sent' THEN 'pending'
  WHEN status = 'viewed' THEN 'pending'
  WHEN status = 'paid' THEN 'confirmed'
  ELSE status
END
WHERE status IN ('sent', 'viewed', 'paid');

-- Step 2: Drop the existing status column constraint if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'invoices_status_check'
  ) THEN
    ALTER TABLE invoices DROP CONSTRAINT invoices_status_check;
  END IF;
END $$;

-- Step 3: Add the new status column with comprehensive options
-- If column doesn't exist, add it. If it exists, alter it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices'
    AND column_name = 'status'
  ) THEN
    ALTER TABLE invoices ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- Step 4: Add proper constraint with all status options
ALTER TABLE invoices
ADD CONSTRAINT invoices_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refund', 'partial_payment', 'paid', 'draft'));

-- Step 5: Update default value to 'pending'
ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'pending';

-- Step 6: Add comment for documentation
COMMENT ON COLUMN invoices.status IS 'Invoice status: pending, confirmed, cancelled, refund, partial_payment, paid, or draft';

-- Step 7: Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Verify the changes
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'invoices'
AND column_name = 'status';

-- Check constraint
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'invoices'::regclass
AND conname = 'invoices_status_check';

-- Reload schema to update API
NOTIFY pgrst, 'reload schema';
