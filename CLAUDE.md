@AGENTS.md

# Himalayan Marvels Documentation

## Quick Links
- [Project Memory](MEMORY.md) - Complete context including admin panel setup
- [Admin Panel Details](memory/project_admin_panel.md) - Full CMS implementation guide
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

## Development
```bash
npm run dev  # Runs on port 3000 (or 3001 if occupied)
```

## Database Setup
Run `node scripts/setup-db.js` to recreate tables if needed.

## Recent Updates

### April 2026
- **Instagram Feed Component** (`src/components/InstagramFeed.tsx`): Created with video playback on hover, click to open on Instagram
- **Navigation Logo**: Increased 40% (w-8 → w-11), added Login button to `/admin/login`
- **Hero Section**: Restructured to 2-column layout with large logo (384px) and golden glow effect
- **Admin Panel**: Fully integrated into main project at `/admin` routes
- **Environment Variables**: Fixed all Supabase references to use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
