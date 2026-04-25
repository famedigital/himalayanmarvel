# Bank Details Management System

## Overview
Editable bank details system for Bhutan wire transfer payments. Stored in `settings` table for flexibility with non-standard bank formats.

## Database Setup

Run `scripts/add-bank-details-settings.sql`:

```sql
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
```

## Files

### Admin Components
- **`src/components/admin/BankDetailsManager.tsx`** - Edit interface with flexible textarea
- **`src/app/admin/bank-details/page.tsx`** - Admin settings page

### Updated Files
- **`src/components/admin/Sidebar.tsx`** - Added "Bank Details" menu item (Building2 icon)
- **`src/components/admin/BookingForm.tsx`** - Fetches and displays dynamic bank details
- **`src/components/admin/BookingDetail.tsx`** - Fetches and displays dynamic bank details
- **`src/lib/bank-details.ts`** - Exports `getBankDetails()` and `getPaymentInstructions()` functions

## Features

### Flexible Format
- Textarea supports any custom format for non-standard banking
- Example:
  ```
  Bank: Bhutan National Bank
  Account Name: Himalayan Marvels
  Account Number: [Your Number]
  SWIFT: BNBTBTBT
  [Additional notes or multiple banks can be added here]
  ```

### Dynamic Display
- BookingForm and BookingDetail fetch from settings on mount
- Falls back to defaults if settings not found
- Supports both structured (JSON) and free-form (text) formats

## Access
**Admin Panel → Bank Details** (`/admin/bank-details`)
