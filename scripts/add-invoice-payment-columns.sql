-- Add payment tracking columns to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_date DATE,
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS invoices_payment_status_idx ON invoices(payment_status);

-- Add comment for documentation
COMMENT ON COLUMN invoices.payment_amount IS 'Total amount paid so far (can be partial)';
COMMENT ON COLUMN invoices.payment_status IS 'Current payment status: pending, partial, paid, overdue';
COMMENT ON COLUMN invoices.payment_method IS 'Payment method used: Bank Transfer, UPI, Cash, etc.';
COMMENT ON COLUMN invoices.payment_date IS 'Most recent payment date';
COMMENT ON COLUMN invoices.payment_notes IS 'Notes about payments, reference numbers, etc.';
