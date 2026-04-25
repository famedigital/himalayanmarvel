---
name: project_hero_slider
description: Hero slider management system with primary slide toggle
type: project
---

# Hero Slider System

## Overview
The hero section is fully editable from the admin panel at `/admin/hero`. Slides can be duplicated and one slide is marked as "primary" to be displayed on the homepage.

## Database
- **Table**: `settings`
- **Key**: `hero_slides`
- **Type**: JSONB array of slide objects

## Slide Schema
```typescript
interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;          // For videos
  title?: string;
  subtitle?: string;
  description?: string;
  link?: string;
  experienceLabel?: string;    // "Experience" prefix text
  ctaText?: string;            // Button text
  keywords?: string[];         // Typewriter keywords
  isPrimary?: boolean;         // Only one slide can be true
}
```

## Features
- **Add slides**: Image or video type
- **Duplicate slides**: Copy any slide with one click
- **Primary toggle**: Mark one slide as active (shown with ★)
- **Delete slides**: Remove unwanted slides
- **Full field editing**: All hero text and media is editable

## Frontend Behavior
- Only the slide with `isPrimary: true` is displayed
- Falls back to first slide if none marked primary
- No auto-rotation (user toggles manually via admin)

## Setup Script
```bash
node scripts/add-hero-slides.js
```

## Files
- Admin: `src/components/admin/HeroManager.tsx`
- Frontend: `src/components/Hero.tsx`
- API: `src/app/admin/hero/page.tsx`
