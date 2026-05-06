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

  const client = createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'himalayanmarvels-auth-token',
    },
  });

  // Handle auth errors silently
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Session refreshed successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

  return client;
};
