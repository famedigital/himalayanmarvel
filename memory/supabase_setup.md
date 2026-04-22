---
name: supabase_setup
description: Supabase SSR configuration and middleware setup
type: reference
---

# Supabase Configuration

**Middleware Setup:**
- Location: Project root `middleware.ts` (NOT inside `src/`)
- Uses `@supabase/ssr` for Next.js App Router
- Matcher excludes static files and images

**Server Client:** `src/lib/supabase/server.ts`
- Uses `cookies()` from `next/headers`
- For use in Server Components and Server Actions

**Browser Client:** `src/lib/supabase/client.ts`
- Uses `createBrowserClient` from `@supabase/ssr`
- For use in Client Components

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://zjskswendtlgxpkfavko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**Database Setup:**
Run `node scripts/setup-db.js` to recreate tables.

**Files:** `middleware.ts`, `src/lib/supabase/`
