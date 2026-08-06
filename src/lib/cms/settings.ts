import { createClient } from '@/lib/supabase/server';

export async function getSettingsMap(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  try {
    const supabase = await createClient();
    const orFilter = keys.map((k) => `key.eq.${k}`).join(',');
    const { data } = await supabase.from('settings').select('key, value').or(orFilter);
    const map: Record<string, unknown> = {};
    data?.forEach((row) => {
      map[row.key] = row.value;
    });
    return map;
  } catch {
    return {};
  }
}

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const map = await getSettingsMap([key]);
  return (map[key] as T) ?? null;
}

export type ThemeTokens = {
  forestGreen: string;
  champagneGold: string;
  alabaster: string;
  adminAccent: string;
};

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  forestGreen: '#006838',
  champagneGold: '#D4AF37',
  alabaster: '#F7F7F2',
  adminAccent: '#D97706',
};

/** Convert #RRGGBB to "R G B" for Tailwind/CSS vars used in this project */
export function hexToRgbChannels(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return '0 104 56';
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return '0 104 56';
  return `${r} ${g} ${b}`;
}
