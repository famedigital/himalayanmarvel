import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Return a safe placeholder during SSR - this should never actually be called
  // since 'use client' components with useEffect only run in browser
  if (typeof window === 'undefined') {
    return null as any;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
