---
name: backend_env_fixes
description: Environment variable fixes for Supabase integration
type: feedback
---

# Environment Variable Fixes

**What:** Fixed incorrect environment variable references across Supabase integration.

**Why:** Build was failing with "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not defined" errors. The correct variable name is `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**How to apply:**
- Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Supabase SSR client
- Fixed in:
  - `middleware.ts` (line 6)
  - `src/lib/supabase/client.ts` (line 4)
  - `src/lib/supabase/server.ts` (line 5)

**Files:**
- `middleware.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
