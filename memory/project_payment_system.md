# Payment & Document Management System

## Overview
Comprehensive booking system with wire transfer payment workflow, document management, and receipt generation for Himalayan Marvels Bhutan tours.

## Database Schema

### Bookings Table Columns
Run `scripts/add-booking-payment-docs.sql` to add:
- `guide_details` TEXT - Free-form guide information
- `car_details` TEXT - Free-form car/driver information  
- `hotel_details` TEXT - Free-form hotel information
- `visa_pdf_url` TEXT - SDF e-visa PDF URL
- `money_receipt_url` TEXT - Generated money receipt URL
- `entry_point` TEXT - Tour entry point (e.g., "Paro Airport")
- `exit_point` TEXT - Tour exit point
- `itinerary_id` UUID - Reference to itinerary

### Payment Receipts Structure
Stored in `bookings.payment_receipts` as JSONB:
```typescript
interface PaymentReceipt {
  id: string;
  amount: number;
  receipt_url: string;  // URL to stored receipt image
  date: string;
  note?: string;
}
```

## File Structure

### Configuration
- **`src/lib/bank-details.ts`** - Bank transfer details (defaults)
- **Admin Editable**: `/admin/bank-details` - Update without code changes
  - Flexible textarea format for non-standard banking
  - Stored in `settings` table
  - See [Bank Details System](memory/bank_details_system.md)

### Payment Components
- **`src/lib/money-receipt-generator.ts`** - PDF receipt generation
  - Professional receipt template
  - Includes company branding, bank details
  - Functions: `generateMoneyReceiptPDF()`, `generateReceiptNumber()`

- **`src/lib/zip-documents.ts`** - Bulk document download
  - Creates ZIP of all booking documents
  - Fetches from URLs and packages for download

### API Routes
- **`/api/bookings/[id]/money-receipt`** - Generate money receipt PDF
  - Returns base64-encoded PDF
  - Auto-generates receipt number

### Admin Components
- **`BookingForm.tsx`** - Main booking creation/editing
  - Bank details display
  - Travel logistics inputs
  - Document uploads (Visa PDF)
  - Auto-fills from selected itinerary

- **`BookingDetail.tsx`** - Booking view page
  - Bank details card
  - Travel logistics display
  - Documents section with download links
  - Generate Money Receipt button (for confirmed/paid)
  - Download All Documents button (ZIP)

## Features

### 1. Bank Details Display
- Prominent orange/pink gradient card
- Copy-to-clipboard buttons for account number and SWIFT
- Shows: Bank name, account name, account number, SWIFT, address, currency

### 2. Travel Logistics
Free-form text fields with placeholder examples:
- **Guide**: "e.g., Dorji, +975 17223123, License #1231213"
- **Car**: "e.g., Creata, Driver: Tenzin +975 1231231, Plate: PB-1-1234"
- **Hotel**: "e.g., Taj Tashi, Thimphu, +975 17772222"

### 3. Money Receipt Generation
- Triggered via button on booking detail page
- Only shows when booking is `confirmed` or `paid` with amount > 0
- Generates professional PDF with:
  - Company header
  - Receipt number (auto-generated)
  - Client details
  - Payment amount
  - Bank details
  - Signature sections

### 4. Document Management
Documents stored as URLs (currently Cloudinary):
- Passport photo
- e-Visa PDF
- Money receipt
- Payment receipts (multiple)

**"Download All Documents"** button creates ZIP with all files.

### 5. Itinerary Auto-Fill
When selecting an itinerary in booking form, auto-fills:
- Client name → from `guest_names`
- Travel date → from `start_date`
- No. of pax → from `no_of_pax`
- Entry point → from `entry_point`
- Exit point → from `exit_point`
- Amount → from `pricing.total`

## Current Storage
- **Images/Receipts**: Cloudinary (folder: `himalayanmarvel/`)
  - Passport photos: `himalayanmarvel/passports`
  - Payment receipts: `himalayanmarvel/receipts`
  - Visa PDFs: `himalayanmarvel/visas`

## Future: Google Drive Integration
Planned but not yet implemented. Requires:
1. Google Cloud Service Account
2. Drive API enabled
3. Folder sharing with service account email
4. `src/lib/google-drive.ts` - Drive API client
5. `/api/drive-upload` - Upload endpoint

## Payment Workflow (Bhutan Standards)
1. **Booking Created** - Status: `pending`
2. **Bank Details Shared** - Client sees wire transfer info
3. **Client Transfers** - Via bank transfer to Bhutan National Bank
4. **Client Uploads Proof** - Screenshot/receipt via booking form
5. **Status Updated** - To `confirmed` or `paid`
6. **Money Receipt Generated** - PDF saved to booking
7. **Documents Collected** - Visa, passport, receipts
8. **ZIP Download** - All documents packaged

## Dependencies
```json
{
  "jspdf": "^2.5.2",
  "html2canvas": "^1.4.1",
  "jszip": "^3.10.1",
  "@types/jszip": "^3.10.1"
}
```

## Important Notes
- Money receipt button only appears for `confirmed`/`paid` bookings with amount > 0
- All logistics fields are free-form for maximum flexibility
- Bank details should be updated in `src/lib/bank-details.ts`
- ZIP download fetches files from URLs (CORS must be enabled)
