import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjskswendtlgxpkfavko.supabase.co';
const supabaseAnonKey = 'sb_publishable_5s6RgdOBCE1HlC-JKSpPBw_JNiS2HAk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data, error } = await supabase
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
}

// Fetch single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
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
}
