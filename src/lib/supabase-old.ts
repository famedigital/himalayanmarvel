import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = () => {
  // Only create client in browser environment
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used in browser context');
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  cover_image?: string;
  slug: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  category?: string;
  tags?: string[];
  author?: string;
}

// Fetch published blog posts
export async function getPublishedPosts(limit = 3): Promise<BlogPost[]> {
  // Return empty array during SSR
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const client = supabase();
    const { data, error } = await client
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch {
    // Client not available (SSR)
    return [];
  }
}

// Fetch single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Return null during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const client = supabase();
    const { data, error } = await client
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch {
    // Client not available (SSR)
    return null;
  }
}
