'use client';

import { useState } from 'react';
import { Palette, Save, Loader2, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_THEME_TOKENS,
  type ThemeTokens,
} from '@/lib/cms/settings';

interface ThemeSettingsFormProps {
  initialTokens?: Partial<ThemeTokens> | null;
}

const FIELDS: { key: keyof ThemeTokens; label: string; help: string }[] = [
  {
    key: 'forestGreen',
    label: 'Forest green (primary)',
    help: 'Public CTAs, links, primary brand',
  },
  {
    key: 'champagneGold',
    label: 'Champagne gold (accent)',
    help: 'Luxury highlights and borders',
  },
  {
    key: 'alabaster',
    label: 'Alabaster (background)',
    help: 'Public page background tone',
  },
  {
    key: 'adminAccent',
    label: 'Admin accent',
    help: 'Admin sidebar/buttons accent',
  },
];

export function ThemeSettingsForm({ initialTokens }: ThemeSettingsFormProps) {
  const [tokens, setTokens] = useState<ThemeTokens>({
    ...DEFAULT_THEME_TOKENS,
    ...(initialTokens || {}),
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const toastId = toast.loading('Saving theme…');
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'theme_tokens')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({ value: tokens, updated_at: new Date().toISOString() })
          .eq('key', 'theme_tokens');
        if (error) throw error;
      } else {
        const { error } = await supabase.from('settings').insert({
          key: 'theme_tokens',
          value: tokens,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }

      // Apply immediately
      window.dispatchEvent(new CustomEvent('theme-tokens-updated', { detail: tokens }));
      toast.success('Theme saved. Refresh public pages to see brand colors.', { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error('Failed to save theme', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    setTokens({ ...DEFAULT_THEME_TOKENS });
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Brand & admin colors</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Updates CSS color tokens only — public layouts stay the same. Admin accent
            controls sidebar highlights.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-4">
            <input
              type="color"
              value={tokens[field.key]}
              onChange={(e) => setTokens({ ...tokens, [field.key]: e.target.value })}
              className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
            />
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium text-foreground">{field.label}</label>
              <p className="text-[11px] text-muted-foreground">{field.help}</p>
            </div>
            <input
              type="text"
              value={tokens[field.key]}
              onChange={(e) => setTokens({ ...tokens, [field.key]: e.target.value })}
              className="w-28 rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-xs"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save theme
        </Button>
        <Button variant="outline" onClick={resetDefaults}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset defaults
        </Button>
      </div>
    </div>
  );
}
