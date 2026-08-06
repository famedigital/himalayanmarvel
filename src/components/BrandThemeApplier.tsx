'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_THEME_TOKENS,
  hexToRgbChannels,
  type ThemeTokens,
} from '@/lib/cms/settings';

interface BrandThemeApplierProps {
  tokens?: Partial<ThemeTokens> | null;
}

function applyTokens(tokens: ThemeTokens) {
  const root = document.documentElement;
  root.style.setProperty('--color-forest-green', hexToRgbChannels(tokens.forestGreen));
  root.style.setProperty('--color-primary', hexToRgbChannels(tokens.forestGreen));
  root.style.setProperty('--color-champagne-gold', hexToRgbChannels(tokens.champagneGold));
  root.style.setProperty('--color-gold', hexToRgbChannels(tokens.champagneGold));
  root.style.setProperty('--color-alabaster', hexToRgbChannels(tokens.alabaster));
  root.style.setProperty('--color-background', hexToRgbChannels(tokens.alabaster));
  root.style.setProperty('--admin-accent', tokens.adminAccent);
  root.style.setProperty('--admin-accent-rgb', hexToRgbChannels(tokens.adminAccent));
}

/**
 * Applies CMS theme tokens as CSS variables without changing layout/structure.
 */
export function BrandThemeApplier({ tokens }: BrandThemeApplierProps) {
  const [live, setLive] = useState<Partial<ThemeTokens> | null | undefined>(tokens);

  useEffect(() => {
    setLive(tokens);
  }, [tokens]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ThemeTokens>).detail;
      if (detail) setLive(detail);
    };
    window.addEventListener('theme-tokens-updated', handler);
    return () => window.removeEventListener('theme-tokens-updated', handler);
  }, []);

  useEffect(() => {
    applyTokens({
      ...DEFAULT_THEME_TOKENS,
      ...(live || {}),
    });
  }, [live]);

  return null;
}
