# Itinerary Builder System

## Overview
Custom tour itinerary builder that creates professional PDF-style HTML documents for guests. Includes cover page, welcome letter, day-by-day itinerary, pricing, terms, and packing checklist.

## Database Schema

### Tables

#### `itineraries`
Main itinerary records with cover info, letter content, pricing, terms, and checklist.

```sql
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Cover Info
  title TEXT NOT NULL,
  subtitle TEXT,
  logo TEXT DEFAULT 'Silverpine Bhutan',
  guest_names TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,

  -- Welcome Letter
  letter_date TEXT,
  letter_salutation TEXT,
  letter_body TEXT[],
  letter_signature_name TEXT,
  letter_signature_title TEXT,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  booking_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'final')),

  -- JSONB fields
  pricing JSONB DEFAULT '{"currency": "USD", "symbol": "$", "items": [], "inclusions": [], "exclusions": []}'::jsonb,
  terms JSONB DEFAULT '{"booking_payment": "", "cancellation_policy": "", "travel_insurance": "", "health_fitness": "", "liability": ""}'::jsonb,
  checklist JSONB DEFAULT '{"documents": [], "clothing": [], "gear": [], "essentials": []}'::jsonb
);
```

#### `itinerary_days`
Day-by-day itinerary entries.

```sql
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  altitude TEXT,
  distance TEXT,
  duration TEXT,
  high_point TEXT,
  night_location TEXT,
  description TEXT,
  drop_cap BOOLEAN DEFAULT false,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  snacks TEXT,
  weather_text TEXT,
  temperature TEXT,
  image_url TEXT,
  image_alt TEXT,
  highlights TEXT[],
  pull_quote TEXT,
  special_boxes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(itinerary_id, day_number)
);
```

#### `itinerary_section_openers`
Full-page dividers between sections.

```sql
CREATE TABLE IF NOT EXISTS itinerary_section_openers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  background_image TEXT NOT NULL,
  overlay_color TEXT DEFAULT 'rgba(45,90,61,0.6)',
  page_number INTEGER,
  UNIQUE(itinerary_id, section_number)
);
```

### RLS Policies

**Critical:** Policies check by email, NOT by role claim (which doesn't exist by default).

```sql
CREATE POLICY "Itineraries: admins full access" ON itineraries
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');

CREATE POLICY "Itinerary Days: admins full access" ON itinerary_days
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');

CREATE POLICY "Section Openers: admins full access" ON itinerary_section_openers
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@himalayanmarvels.com');
```

## Key Files

- **Form:** `src/components/admin/ItineraryForm.tsx` - Main editor with 7 tabs
- **Generator:** `src/lib/itinerary-generator.ts` - HTML/PDF generation
- **API Route:** `src/app/api/itineraries/[id]/html/route.ts` - Download endpoint
- **Types:** `src/lib/supabase/itinerary-types.ts` - TypeScript definitions

## Setup Instructions

### 1. Create Tables
Run `scripts/create-itineraries-table.sql` in Supabase SQL Editor.

### 2. Verify Tables Exist
```sql
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name LIKE '%itinerary%';
```

### 3. Test Access
As admin user (`admin@himalayanmarvels.com`), you should be able to insert/query.

## Common Issues & Fixes

### "Could not find the table 'public.itineraries'"
- Tables weren't created
- PostgREST needs restart (Dashboard → Database → API → Restart)
- Check with: `SELECT * FROM information_schema.tables WHERE table_name = 'itineraries';`

### RLS Policy Denying Access
- Policies use `auth.jwt() ->> 'email'` not `auth.jwt() ->> 'role'`
- Verify logged in user email matches exactly
- Check session with: `console.log((await supabase.auth.getSession()).data.session?.user.email)`

### Next.js 15+ Params are Promises
API routes must await params:
```typescript
// OLD (Next.js 14)
{ params }: { params: { id: string } }
const id = params.id;

// NEW (Next.js 15+)
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

### Lucide React Missing Icons
Lucide doesn't have social media icons (Instagram, Facebook, Twitter, etc).
- Use `MessageCircle` as placeholder
- Or create custom SVG components

## Build Errors Fixed (2024-04)

1. **Tours page href** - Fixed template string concatenation
2. **API route params** - Added `await` for params promise
3. **SocialProof type narrowing** - Fixed InstagramPost union type
4. **Button asChild** - Removed unsupported prop from `@base-ui/react`
5. **TopBar icons** - Removed non-existent lucide social icons
6. **Itinerary generator** - Cast nested data for Supabase joins

## Admin Access

- **Email:** `admin@himalayanmarvels.com`
- **Password:** `Admin@123`
- **Route:** `/admin/itineraries/new`
