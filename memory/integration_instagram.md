---
name: integration_instagram
description: Instagram feed integration component with video playback support
type: project
---

# Instagram Feed Integration

**What:** Created `src/components/InstagramFeed.tsx` component with dynamic content pulling and video playback.

**Why:** Client wanted Instagram feed integrated seamlessly into the website as a proper section, not just a framed embed.

**How to apply:**
- Component supports IMAGE, VIDEO, and CAROUSEL_ALBUM media types
- Videos auto-play on hover (muted, looped), click opens Instagram post
- Uses Instagram Basic Display API (credentials pending from client)
- Custom `InstagramIcon` SVG component created (lucide-react doesn't have Instagram icon)

**Pending:** Need from client:
- Instagram App ID
- App Secret
- Access Token (from Basic Display API)

**File:** `src/components/InstagramFeed.tsx`
