---
name: admin_integration
description: Admin panel integration into main HMT project
type: project
---

# Admin Panel Integration

**What:** Merged hmterp admin panel into main HMT project at `/admin` routes.

**Why:** Backend was returning 404 errors. Client chose Option 2: integrate admin into main project instead of separate monorepo setup.

**Changes:**
1. Copied all files from `hmterp/src/app/admin` to `src/app/admin`
2. Fixed import paths for admin components
3. Fixed TypeScript error in `BookingForm.tsx` (status type assertion)
4. Created `src/lib/supabase/index.ts` for backward compatibility

**Routes Available:**
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard
- `/admin/tours` - Tour management
- `/admin/bookings` - Booking management
- `/admin/blog` - Blog post management

**Credentials:** `admin@himalayanmarvels.com` / `Admin@123`

**File:** All under `src/app/admin/`
