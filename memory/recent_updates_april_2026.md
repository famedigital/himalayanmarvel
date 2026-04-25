# Recent Updates - April 2026

## Booking System Enhancements

### Itinerary Integration
- Booking form now fetches from `itineraries` table (not just `tours`)
- Removed status='final' filter - all itineraries (draft & final) are selectable
- Auto-fill on itinerary selection:
  - Guest names → client name
  - Start date → travel date
  - No. of pax
  - Entry/exit points
  - Amount from pricing.total

### New Booking Fields
- **Entry Point** - Where guest arrives (default: "Paro Airport")
- **Exit Point** - Where guest departs (default: "Paro Airport")
- **No. of Pax** - Number of travelers
- SQL: `scripts/add-itinerary-pax-entry-exit.sql`
- SQL: `scripts/add-booking-entry-exit.sql`

## Tour Categories (Homepage)

### Dynamic from Settings
- Tour packages on homepage now editable via admin
- Admin page: `/admin/tour-categories`
- Stored in `settings` table with key `tour_categories`
- SQL: `scripts/create-settings-table.sql`
- SQL: `scripts/add-tour-categories.sql`

### Manager Component
- `src/components/admin/TourCategoriesManager.tsx`
- Edit: title, subtitle, description, image, price, link
- Cloudinary upload for category images
- Add/remove/reorder categories

### Homepage Display
- `src/components/TourPackages.tsx`
- Fetches from settings, falls back to defaults
- 3-column grid layout
- Learn more button links to configured URL

## Blog Dashboard Enhancements

### New Buttons (BlogsTable.tsx)
- **Preview** - Opens blog post in new tab (`/blog/[slug]`)
- **Publish/Unpublish Toggle** - Changes `is_published` status
- Visual indicator (eye icon changes on publish state)

## Hero Section - Dynamic Content

### Fully Editable Hero (April 23)
- **Primary slide system**: Only one slide displayed at a time (no rotation)
- **Duplicate slides**: Create variations, then toggle which is active
- **All fields editable**: title, subtitle, description, keywords, CTA text, experience label
- **Typewriter effect**: Animated keywords cycling through configurable list
- Admin: `/admin/hero`
- See [Hero Slider System](memory/project_hero_slider.md) for full schema

### Previously (Auto-rotation)
- Slides auto-rotated every 6 seconds (deprecated in favor of primary toggle)

## Settings Table System

### Created For
- Hero slides (`hero_slides`)
- Tour categories (`tour_categories`)
- Extensible for other app-wide config

### Schema
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
- Admins: full access
- Public: read access (for frontend fetching)

## Admin Sidebar Updates

### New Menu Item
- **Tour Categories** - Added to navigation
- Icon: `Layers` from lucide-react
- Path: `/admin/tour-categories`

## File Upload Notes

### Current Storage
- **Cloudinary** for all images and documents
- Folders: `himalayanmarvel/`
  - `hero/` - Hero images/videos
  - `hero/thumbnails/` - Video thumbnails
  - `categories/` - Tour category images
  - `passports/` - Passport photos
  - `receipts/` - Payment receipts
  - `visas/` - e-Visa PDFs

### Upload Component
- `src/components/admin/CloudinaryUpload.tsx`
- Uses react-dropzone
- Supports: PNG, JPG, JPEG, WebP, GIF
- Configurable aspect ratios and sizes

## Payment & Document System (Latest)

### See [Payment System Documentation](memory/project_payment_system.md)

Key features:
- Bank details display (wire transfer) - NOW EDITABLE via admin
- Travel logistics (guide, car, hotel)
- Money receipt PDF generation
- Document management (visa, passport, receipts)
- ZIP download all documents

### Bank Details Management (April 23)
- **Editable via Admin**: `/admin/bank-details`
- **Flexible textarea format** for non-standard banking
- Stored in `settings` table (key: `bank_details`)
- SQL: `scripts/add-bank-details-settings.sql`
- See [Bank Details System](memory/bank_details_system.md)
