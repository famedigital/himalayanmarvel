@AGENTS.md

# Himalayan Marvels Documentation

## Quick Links
- [Project Memory](MEMORY.md) - Complete context including admin panel setup
- [Admin Panel Details](memory/project_admin_panel.md) - Full CMS implementation guide

## Project Overview
Luxury Bhutan tour company website built with Next.js 16, Supabase, and Cloudinary.

## Key Credentials (See Memory for Full Details)
- **Admin Login:** `admin@himalayanmarvels.com` / `Admin@123`
- **Supabase Project:** `zjskswendtlgxpkfavko`
- **Cloudinary:** `dxztrqjft` (folder: `himalayanmarvel`)

## Important Notes
- **Middleware** (`middleware.ts`) must be in project root, NOT inside `src/` - this was a known bug
- Admin panel at `/admin` is fully functional with tour/booking/blog management
- Public `/tours` and `/blog` pages are dynamic from Supabase

## Development
```bash
npm run dev  # Runs on port 3000 (or 3001 if occupied)
```

## Database Setup
Run `node scripts/setup-db.js` to recreate tables if needed.
