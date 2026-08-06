@AGENTS.md

# Himalayan Marvels Documentation

## Quick Links
- [Project Memory](MEMORY.md) - Complete context including admin panel setup
- [Admin Panel Details](memory/project_admin_panel.md) - Full CMS implementation guide
- [Itinerary Builder System](memory/project_itinerary_system.md) - Custom tour itinerary PDF generator
- [Hero Slider System](memory/project_hero_slider.md) - Admin-manageable hero with duplicate & primary toggle
- [Build Fixes Reference](memory/build_fixes_april_2026.md) - Common build errors and solutions
- [Recent Updates](#recent-updates) - Latest changes and improvements

## Project Overview
Luxury Bhutan tour company website built with Next.js 16, Supabase, and Cloudinary.

## Key Credentials (See Memory for Full Details)
- **Admin Login:** `admin@himalayanmarvels.com` / `Admin@123`
- **Supabase Project:** `zjskswendtlgxpkfavko`
- **Cloudinary:** `dxztrqjft` (folder: `himalayanmarvel`)

## Important Notes
- **Middleware** (`middleware.ts`) must be in project root, NOT inside `src/`
- **Supabase env var:** Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)
- Admin panel at `/admin` is fully functional with tour/booking/blog management
- Public `/tours` and `/blog` pages are dynamic from Supabase

## Critical Mistakes to Avoid

### Syntax Errors from File Editing
**NEVER leave extra closing braces when editing files.**

When using the Edit tool to replace code blocks:
1. **Match the exact structure** of the original code
2. **Count braces carefully** - ensure opening `{` and closing `}` match
3. **Remove ALL old closing braces** when replacing a section
4. **Test immediately** after editing with `npm run dev`

**Example of what NOT to do:**
```typescript
// WRONG - Leaves extra closing brace
{tours.map((tour) => (
  <div>...</div>
))}
)}  // ← This extra brace causes syntax errors!
```

**Correct approach:**
```typescript
// CORRECT - No extra braces
{tours.map((tour) => (
  <div>...</div>
))}
```

**How to prevent this:**
- Always read the file before editing
- Check the complete structure around your edit
- Verify brace counts: opening vs closing
- If you see `})` or `)}` sequences, double-check they're intentional

## Development
```bash
npm run dev  # Runs on port 3000 (or 3001 if occupied)
```

## Database Setup
Run `node scripts/setup-db.js` to recreate tables if needed.

## Recent Updates

### August 2026 — Admin production maturity
- [Admin Production Audit](memory/admin_production_audit.md) — Feature map, broken-flow fixes, CMS wiring, TipTap blog, theme tokens

### April 23, 2026
- **Hero Slider System** (`/admin/hero`): Fully editable hero with duplicate slides & primary toggle. All fields editable (title, subtitle, description, keywords, CTA text).

### Earlier April 2026
- **Itinerary Builder** (`/admin/itineraries/new`): Custom tour itinerary system with cover, letter, days, pricing, terms, and checklist. Generates professional HTML/PDF documents for guests.
- **Build Fixes**: Fixed 7 TypeScript/compilation errors for Next.js 16 compatibility (see [build_fixes_april_2026.md](memory/build_fixes_april_2026.md))
- **Instagram Feed Component** (`src/components/InstagramFeed.tsx`): Created with video playback on hover, click to open on Instagram
- **Navigation Logo**: Increased 40% (w-8 → w-11), added Login button to `/admin/login`
- **Hero Section**: Restructured to 2-column layout with large logo (384px) and golden glow effect
- **Admin Panel**: Fully integrated into main project at `/admin` routes
- **Environment Variables**: Fixed all Supabase references to use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
