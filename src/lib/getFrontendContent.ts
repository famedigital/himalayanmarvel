import { createClient } from '@/lib/supabase/server';

/**
 * Fetch frontend content from the settings table by key
 * @param key - The content key to fetch
 * @returns The content value or null if not found
 */
export async function getFrontendContent(key: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  return data?.value || null;
}

/**
 * Fetch multiple frontend content keys in parallel
 * @param keys - Array of content keys to fetch
 * @returns Object with keys mapped to their values
 */
export async function getMultipleFrontendContent(
  keys: string[]
): Promise<Record<string, any>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', keys);

  // Convert array to key-value object
  const contentMap: Record<string, any> = {};
  data?.forEach((item) => {
    contentMap[item.key] = item.value;
  });

  return contentMap;
}

/**
 * Fetch all frontend content keys
 * Useful for initial load or admin interfaces
 * @returns Object with all frontend content keys mapped to their values
 */
export async function getAllFrontendContent(): Promise<
  Record<string, any>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .or(
      'key.eq.homepage_hero,key.eq.homepage_founder,key.eq.homepage_trust,key.eq.homepage_reviews,key.eq.homepage_journeys,key.eq.homepage_cinematic,key.eq.homepage_faq,key.eq.homepage_concierge_form,key.eq.about_page,key.eq.concierge_page,key.eq.footer_content,key.eq.tours_page'
    );

  // Convert array to key-value object
  const contentMap: Record<string, any> = {};
  data?.forEach((item) => {
    contentMap[item.key] = item.value;
  });

  return contentMap;
}
