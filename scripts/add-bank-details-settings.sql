-- Add bank details to settings table
INSERT INTO settings (key, value, description)
VALUES (
  'bank_details',
  '{
    "bank_name": "Bhutan National Bank",
    "account_name": "Himalayan Marvels",
    "account_number": "XXX-XXXX-XXXX",
    "swift_code": "BNBTBTBT",
    "bank_address": "Thimphu, Bhutan",
    "currency": "USD"
  }'::jsonb,
  'Bank wire transfer details for payments'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Add payment instructions to settings
INSERT INTO settings (key, value, description)
VALUES (
  'payment_instructions',
  '{
    "title": "Wire Transfer Instructions",
    "note": "Please include booking ID in transfer reference",
    "note2": "Send payment screenshot to confirm booking"
  }'::jsonb,
  'Payment instructions shown to clients'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
