# Changelog

All notable changes to the Himalayan Marvels website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-04-28

#### SEO & Technical Improvements
- **Global Schema Markup** - Added TravelAgency + LocalBusiness JSON-LD schema to root layout with aggregateRating (4.9/127), geo coordinates, opening hours, and social links for Google Rich Snippets
- **Schema Standardization** - Fixed SocialProof component schema from Product to LocalBusiness type with proper address and rating information
- **Related Content Linking** - Created `src/lib/supabase/queries.ts` with category-based content matching functions
  - Tour pages now display "Stories from Bhutan" section with related blog posts
  - Blog pages now display "Explore This Journey" section in sidebar with related tour packages
- **Internal Linking** - Strengthened cross-links between Journal (blog) and Tour Packages for improved SEO and user engagement

#### Accessibility Improvements
- **Hero Components Alt Text** - Enhanced with descriptive location-specific text:
  - `Hero.tsx`: Individual descriptions for each carousel image (Tiger's Nest, Buddha Point, Dochula Pass, Tashichho Dzong)
  - `HeroLuxury.tsx`: Updated to describe Tashichho Dzong fortress
- **Gallery Alt Text** - Fixed generic "Gallery {index}" patterns:
  - `BlogPostLayout.tsx`: Now includes blog title context
  - Tour detail pages: Now includes tour title context
  - `itinerary-template.ts`: Day images now include day title in alt text

#### UI/UX Enhancements
- **TrustArchitectureElite Component** - Redesigned "Verified Excellence - Why Luxury Travelers Trust Us" credentials section:
  - Premium card styling with dual-tone gradients and depth shadows
  - Enhanced icon design with glow effects (16×16 → 20×20 on desktop)
  - Top gold accent line and bottom decorative dots pattern
  - Smoother hover animations with shimmer effect
  - Better typography with improved spacing and color contrast

### Changed
- Updated URL references across schema markup to use `https://himalayanmarvels.bt` consistently
- Improved visual hierarchy in credentials section with equal-width 4-column grid on desktop

### Technical Details
- **Files Modified:**
  - `src/app/layout.tsx` - Added global JSON-LD schema
  - `src/components/SocialProof.tsx` - Fixed schema type
  - `src/lib/supabase/queries.ts` - New file with related content queries
  - `src/app/tours/[slug]/page.tsx` - Added related blogs section
  - `src/app/blog/[slug]/page.tsx` - Added related tours support
  - `src/components/blog/BlogPostLayout.tsx` - Added related tours section
  - `src/components/Hero.tsx` - Improved alt text
  - `src/components/HeroLuxury.tsx` - Improved alt text
  - `src/lib/templates/itinerary-template.ts` - Improved alt text
  - `src/components/luxury/TrustArchitectureElite.tsx` - Redesigned credentials section

---

## Previous Releases

### April 23, 2026
- Hero Slider System (`/admin/hero`): Fully editable hero with duplicate slides & primary toggle

### Earlier April 2026
- Itinerary Builder (`/admin/itineraries/new`): Custom tour itinerary system
- Build Fixes: Fixed 7 TypeScript/compilation errors for Next.js 16 compatibility
- Instagram Feed Component: Created with video playback on hover
- Navigation Logo: Increased 40% (w-8 → w-11), added Login button
- Hero Section: Restructured to 2-column layout with large logo (384px)
- Admin Panel: Fully integrated into main project at `/admin` routes
- Environment Variables: Fixed all Supabase references to use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
