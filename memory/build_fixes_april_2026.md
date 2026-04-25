# Build Errors Fixed - April 2026

Next.js 16.2.3 with Turbopack build fixes.

## 1. Tours Page - Malformed Template String

**File:** `src/app/tours/[slug]/page.tsx:204`

**Error:** `Expression expected`

**Fix:** Changed string concatenation to proper template literal
```tsx
// BEFORE (broken)
href="https://wa.me/97577270465?text=..." + encodeURIComponent(tour.title)

// AFTER (fixed)
href={`https://wa.me/97577270465?text=...${encodeURIComponent(tour.title)}`}
```

## 2. API Route - Params Now Promises (Next.js 15+)

**File:** `src/app/api/itineraries/[id]/html/route.ts:7`

**Error:** Type mismatch - params is Promise, not object

**Fix:** Await the params
```typescript
// BEFORE
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

// AFTER
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
```

## 3. SocialProof - Type Narrowing Issue

**File:** `src/components/SocialProof.tsx:74`

**Error:** Property 'thumbnail' does not exist on union type

**Fix:** Use explicit type guard
```tsx
// BEFORE
const imageUrl = 'thumbnail_url' in post ? (post.thumbnail_url || post.media_url) : post.thumbnail;

// AFTER
const isApiPost = 'permalink' in post;
const imageUrl = isApiPost ? (post.thumbnail_url || post.media_url || '') : post.thumbnail;
```

## 4. SocialProof - Button asChild Not Supported

**File:** `src/components/SocialProof.tsx:388`

**Error:** Property 'asChild' does not exist on Button

**Fix:** Use motion.a directly instead of Button with asChild
```tsx
// BEFORE
<Button asChild className="...">
  <motion.a href="...">Follow</motion.a>
</Button>

// AFTER
<motion.a href="..." className="inline-flex items-center justify-center rounded-full ...">
  Follow
</motion.a>
```

## 5. TopBar - Missing Lucide Icons

**File:** `src/components/TopBar.tsx:6`

**Error:** Module 'lucide-react' has no exported member 'Instagram', 'Facebook', etc.

**Fix:** Lucide doesn't have social media icons. Use MessageCircle as placeholder or create custom SVGs.
```tsx
// BEFORE
import { Instagram, Facebook, Twitter, ... } from 'lucide-react';

// AFTER
import { MessageCircle, Mail, ... } from 'lucide-react';
// Use MessageCircle for all social placeholders
```

## 6. Itinerary Generator - Nested Supabase Data

**File:** `src/lib/itinerary-generator.ts:5`

**Error:** Property 'itinerary_days' does not exist on type 'Itinerary'

**Fix:** Cast data for joined properties
```typescript
// BEFORE
const days: ItineraryDay[] = itinerary.itinerary_days || [];

// AFTER
const days: ItineraryDay[] = (data as any).itinerary_days || [];
```

## Key Takeaways

1. **Next.js 15+ Breaking Change:** Route params are now promises - always await them
2. **Template Literals:** Must use backticks with `${}` for dynamic values in JSX attributes
3. **Lucide Icons:** No social media icons - use MessageCircle or custom SVGs
4. **Supabase Joins:** Joined data not in base type - cast to `any` or create extended type
5. **Base UI Button:** Doesn't support `asChild` like Radix UI - use native element or motion components directly

---

# Additional Fixes - April 23, 2026

## 7. html2canvas - lab() Color Function Error

**Error:** `Attempting to parse an unsupported color function "lab"`

**Root Cause:** Tailwind CSS v4 uses OKLCH color space which browsers convert to `lab()` format. html2canvas v1.4.1 cannot parse `lab()`.

**Files Modified:**
- `src/lib/color-utils.ts` (NEW) - Color conversion utilities
- `src/components/admin/BookingDetail.tsx` - Updated downloadPDF to use `onclone` callback
- `src/app/globals.css` - Replaced oklch() with hex values

**Fix Approach:**
1. Created `sanitizeColorForCanvas()` function using browser's native color conversion
2. Updated `downloadPDF` to use html2canvas `onclone` callback for color sanitization
3. Replaced all oklch() values in globals.css with hex equivalents

## 8. SSR Supabase - "supabaseKey is required"

**Error:** Build failing during static page generation

**Root Cause:**
- Wrong env var name: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Module-level client creation executed during build
- Browser-only code threw errors during SSR

**Files Modified:**
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `middleware.ts`
- `src/lib/supabase-old.ts`

**Fix:**
1. Corrected env var names to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Changed `supabase-old.ts` from module-level singleton to lazy function
3. Added SSR guards that return safe defaults (null/empty array) instead of throwing

## 9. Multiple TypeScript Fixes

**Fixed Files:**
- `BlogsTable.tsx` - Changed `published_at: null` to `undefined`
- `ItinerariesTable.tsx` - Added type annotations `(day: any)`, `(opener: any)`
- `BookingForm.tsx` - Removed `aspect="landscape"` prop from CloudinaryUpload
- `TourCategoriesManager.tsx` - Removed `aspect="landscape"` prop
- `TourPackages.tsx` - Replaced Button with `asChild` with plain `<a>` tag
- `ItineraryForm.tsx` - Added missing `header_right_title` to state
- `itinerary-generator.ts` - Removed references to non-existent properties
- `BookingDetail.tsx` - Fixed PaymentReceipt type mapping (`receipt_url` → `url`)
