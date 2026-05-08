import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
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
      // Use cookies instead of localStorage for SSR compatibility
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null;
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${key}=`))
            ?.split('=')[1] ?? null;
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') return;
          document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') return;
          document.cookie = `${key}=; path=/; max-age=0`;
        },
      },
    },
  });

  // Handle auth state changes
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Session refreshed successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

  return client;
};
