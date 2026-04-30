-- =====================================================
-- PAYMENTS TRACKING SYSTEM MIGRATION
-- =====================================================
-- Phase 3: Booking-Invoice Integration
-- This script adds payment tracking capabilities to link
-- bookings, invoices, and payments together
--
-- Run this in Supabase SQL Editor or via psql
-- =====================================================

-- =====================================================
-- 1. ADD INVOICE_ID TO BOOKINGS TABLE
-- =====================================================
-- This links bookings to their generated invoices

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_bookings_invoice_id
ON bookings(invoice_id);

-- Add comment
COMMENT ON COLUMN bookings.invoice_id IS 'Link to the generated invoice for this booking';

-- =====================================================
-- 2. CREATE PAYMENTS TABLE
-- =====================================================
-- Tracks all payments received against bookings and invoices
-- Supports advance payments, installments, and full payments

CREATE TABLE IF NOT EXISTS payments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  -- Payment Details
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('advance', 'installment', 'full', 'refund')),
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'card', 'upi', 'cash', 'cheque', 'other')),

  -- Transaction Information
  transaction_id TEXT UNIQUE,
  receipt_url TEXT,

  -- Additional Information
  notes TEXT,

  -- Timestamps
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Soft Delete
  deleted_at TIMESTAMPTZ
);

-- Add comments
COMMENT ON TABLE payments IS 'Tracks all payments received against bookings and invoices';
COMMENT ON COLUMN payments.payment_type IS 'Type of payment: advance (initial deposit), installment (partial payment), full (complete payment), refund';
COMMENT ON COLUMN payments.payment_method IS 'Method used for payment: bank_transfer, card, upi, cash, cheque, other';
COMMENT ON COLUMN payments.transaction_id IS 'Unique transaction reference from payment gateway or bank';
COMMENT ON COLUMN payments.receipt_url IS 'URL to payment receipt or proof of payment';

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for booking lookups
CREATE INDEX IF NOT EXISTS idx_payments_booking_id
ON payments(booking_id) WHERE deleted_at IS NULL;

-- Index for invoice lookups
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id
ON payments(invoice_id) WHERE deleted_at IS NULL;

-- Index for payment type queries
CREATE INDEX IF NOT EXISTS idx_payments_payment_type
ON payments(payment_type) WHERE deleted_at IS NULL;

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_payments_paid_at
ON payments(paid_at DESC) WHERE deleted_at IS NULL;

-- Index for transaction ID lookups
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id
ON payments(transaction_id) WHERE deleted_at IS NULL AND transaction_id IS NOT NULL;

-- Composite index for booking payment status
CREATE INDEX IF NOT EXISTS idx_payments_booking_payment_type
ON payments(booking_id, payment_type, paid_at DESC) WHERE deleted_at IS NULL;

-- =====================================================
-- 4. ADD PAYMENT TRACKING TO INVOICES TABLE
-- =====================================================
-- Enhances invoices with payment status tracking

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS advance_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS advance_paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS balance_amount NUMERIC(12, 2) DEFAULT 0;

-- Add comments
COMMENT ON COLUMN invoices.advance_paid IS 'Indicates if advance payment has been received';
COMMENT ON COLUMN invoices.advance_paid_at IS 'Timestamp when advance payment was received';
COMMENT ON COLUMN invoices.balance_amount IS 'Remaining balance after advance payment';

-- Update existing invoices to calculate balance amount
UPDATE invoices
SET balance_amount = total_amount - COALESCE(advance_payment, 0)
WHERE balance_amount = 0 AND total_amount > 0;

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

-- Policy: Admins can manage all payments
CREATE POLICY "Admins can manage all payments"
ON payments
FOR ALL
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

-- Policy: Users can view payments linked to their bookings
CREATE POLICY "Users can view their own booking payments"
ON payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = payments.booking_id
    AND bookings.email = auth.email()
  )
);

-- Policy: Service role can bypass RLS (for server-side operations)
CREATE POLICY "Service role can bypass RLS"
ON payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =====================================================
-- 7. CREATE FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payments_updated_at();

-- =====================================================
-- 8. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to calculate total payments for a booking
CREATE OR REPLACE FUNCTION get_booking_payment_total(p_booking_id UUID)
RETURNS NUMERIC( AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total
  FROM payments
  WHERE booking_id = p_booking_id
  AND deleted_at IS NULL
  AND payment_type != 'refund';

  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get advance payment for a booking
CREATE OR REPLACE FUNCTION get_booking_advance_payment(p_booking_id UUID)
RETURNS NUMERIC  AS $$
DECLARE
  advance NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO advance
  FROM payments
  WHERE booking_id = p_booking_id
  AND deleted_at IS NULL
  AND payment_type = 'advance';

  RETURN advance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update invoice payment status
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  total_paid NUMERIC;
  invoice_total NUMERIC;
BEGIN
  -- Only proceed if invoice_id is not null
  IF NEW.invoice_id IS NOT NULL THEN
    -- Calculate total payments for this invoice
    SELECT COALESCE(SUM(amount), 0)
    INTO total_paid
    FROM payments
    WHERE invoice_id = NEW.invoice_id
    AND deleted_at IS NULL
    AND payment_type != 'refund';

    -- Get invoice total
    SELECT total_amount
    INTO invoice_total
    FROM invoices
    WHERE id = NEW.invoice_id;

    -- Update invoice balance
    UPDATE invoices
    SET
      balance_amount = invoice_total - total_paid,
      advance_paid = (SELECT COUNT(*) > 0 FROM payments WHERE invoice_id = NEW.invoice_id AND payment_type = 'advance' AND deleted_at IS NULL),
      advance_paid_at = CASE
        WHEN (SELECT COUNT(*) > 0 FROM payments WHERE invoice_id = NEW.invoice_id AND payment_type = 'advance' AND deleted_at IS NULL)
        THEN (SELECT paid_at FROM payments WHERE invoice_id = NEW.invoice_id AND payment_type = 'advance' AND deleted_at IS NULL ORDER BY paid_at ASC LIMIT 1)
        ELSE NULL
      END
    WHERE id = NEW.invoice_id;

    -- Update payment status
    UPDATE invoices
    SET payment_status = CASE
      WHEN total_paid >= invoice_total THEN 'paid'
      WHEN total_paid > 0 THEN 'partial'
      ELSE 'pending'
    END
    WHERE id = NEW.invoice_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update invoice payment status when payment is added/updated
CREATE TRIGGER payment_invoice_status_update
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_invoice_payment_status();

-- =====================================================
-- 9. CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Payment summary by booking
CREATE OR REPLACE VIEW booking_payment_summary AS
SELECT
  b.id as booking_id,
  b.client_name,
  b.amount as booking_amount,
  COUNT(p.id) as payment_count,
  COALESCE(SUM(CASE WHEN p.payment_type = 'advance' THEN p.amount ELSE 0 END), 0) as advance_paid,
  COALESCE(SUM(CASE WHEN p.payment_type = 'installment' THEN p.amount ELSE 0 END), 0) as installment_paid,
  COALESCE(SUM(CASE WHEN p.payment_type = 'full' THEN p.amount ELSE 0 END), 0) as full_paid,
  COALESCE(SUM(p.amount), 0) as total_paid,
  b.amount - COALESCE(SUM(p.amount), 0) as balance_due,
  CASE
    WHEN COALESCE(SUM(p.amount), 0) >= b.amount THEN 'paid'
    WHEN COALESCE(SUM(p.amount), 0) > 0 THEN 'partial'
    ELSE 'pending'
  END as payment_status,
  MAX(p.paid_at) as last_payment_date
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id AND p.deleted_at IS NULL
GROUP BY b.id, b.client_name, b.amount;

-- View: Payment summary by invoice
CREATE OR REPLACE VIEW invoice_payment_summary AS
SELECT
  i.id as invoice_id,
  i.invoice_number,
  i.guest_name,
  i.total_amount,
  i.advance_payment as advance_expected,
  COUNT(p.id) as payment_count,
  COALESCE(SUM(p.amount), 0) as total_paid,
  i.balance_amount,
  i.payment_status,
  i.advance_paid,
  i.advance_paid_at,
  MAX(p.paid_at) as last_payment_date
FROM invoices i
LEFT JOIN payments p ON i.id = p.invoice_id AND p.deleted_at IS NULL
WHERE i.deleted_at IS NULL
GROUP BY i.id, i.invoice_number, i.guest_name, i.total_amount, i.advance_payment, i.balance_amount, i.payment_status, i.advance_paid, i.advance_paid_at;

-- =====================================================
-- 10. CREATE STATISTICS FUNCTIONS
-- =====================================================

-- Function to get payment statistics
CREATE OR REPLACE FUNCTION get_payment_stats(p_start_date DATE DEFAULT NULL, p_end_date DATE DEFAULT NULL)
RETURNS TABLE (
  total_payments BIGINT,
  total_amount NUMERIC,
  advance_amount NUMERIC,
  installment_amount NUMERIC,
  full_amount NUMERIC,
  refund_amount NUMERIC,
  pending_bookings BIGINT,
  partial_bookings BIGINT,
  paid_bookings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_payments,
    COALESCE(SUM(p.amount), 0) as total_amount,
    COALESCE(SUM(CASE WHEN p.payment_type = 'advance' THEN p.amount ELSE 0 END), 0) as advance_amount,
    COALESCE(SUM(CASE WHEN p.payment_type = 'installment' THEN p.amount ELSE 0 END), 0) as installment_amount,
    COALESCE(SUM(CASE WHEN p.payment_type = 'full' THEN p.amount ELSE 0 END), 0) as full_amount,
    COALESCE(SUM(CASE WHEN p.payment_type = 'refund' THEN p.amount ELSE 0 END), 0) as refund_amount,
    (SELECT COUNT(*) FROM booking_payment_summary WHERE payment_status = 'pending')::BIGINT as pending_bookings,
    (SELECT COUNT(*) FROM booking_payment_summary WHERE payment_status = 'partial')::BIGINT as partial_bookings,
    (SELECT COUNT(*) FROM booking_payment_summary WHERE payment_status = 'paid')::BIGINT as paid_bookings
  FROM payments p
  WHERE p.deleted_at IS NULL
  AND (p_start_date IS NULL OR p.paid_at::DATE >= p_start_date)
  AND (p_end_date IS NULL OR p.paid_at::DATE <= p_end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant select on views
GRANT SELECT ON booking_payment_summary TO authenticated;
GRANT SELECT ON invoice_payment_summary TO authenticated;
GRANT SELECT ON booking_payment_summary TO service_role;
GRANT SELECT ON invoice_payment_summary TO service_role;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_booking_payment_total(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_booking_payment_total(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_booking_advance_payment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_booking_advance_payment(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_payment_stats(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_stats(DATE, DATE) TO service_role;

-- =====================================================
-- 12. RELOAD SCHEMA
-- =====================================================

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- The following features are now available:
--
-- 1. Bookings can be linked to invoices via invoice_id
-- 2. All payments are tracked in the payments table
-- 3. Payment types: advance, installment, full, refund
-- 4. Payment methods: bank_transfer, card, upi, cash, cheque, other
-- 5. Invoices auto-update payment status when payments are added
-- 6. Views for easy payment summary queries
-- 7. Helper functions for payment calculations
-- 8. RLS policies for security
--
-- Next steps:
-- - Update admin UI to manage payments
-- - Add payment forms to booking details
-- - Create payment reports
-- - Set up payment reminders
-- =====================================================
