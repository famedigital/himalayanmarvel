'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BankDetails {
  bank_name: string;
  account_number: string;
  ifsc?: string;
  swift?: string;
  branch: string;
}

interface CompanySettings {
  id?: string;
  company_name: string;
  license_number: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  logo_url: string;
  tax_id: string;
  gst_number: string;
  bank_details: {
    INR: BankDetails;
    USD: BankDetails;
    EUR: BankDetails;
  };
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
}

const defaultSettings: CompanySettings = {
  company_name: 'Himalayan Marvels Travels',
  license_number: '',
  mobile: '',
  email: 'info@himalayanmarvels.com',
  website: 'https://www.himalayanmarvels.com',
  address: '',
  logo_url: '',
  tax_id: '',
  gst_number: '',
  bank_details: {
    INR: { bank_name: '', account_number: '', ifsc: '', branch: '' },
    USD: { bank_name: '', account_number: '', swift: '', branch: '' },
    EUR: { bank_name: '', account_number: '', swift: '', branch: '' },
  },
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  linkedin_url: '',
};

let settingsCache: CompanySettings | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const now = Date.now();

      // Return cached settings if still valid
      if (settingsCache && now < cacheExpiry) {
        setSettings(settingsCache);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('company_settings')
          .select('*')
          .single();

        const settingsData = data || defaultSettings;
        settingsCache = settingsData;
        cacheExpiry = now + CACHE_DURATION;
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching company settings:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}

export async function getCompanySettings(): Promise<CompanySettings> {
  const now = Date.now();

  // Return cached settings if still valid
  if (settingsCache && now < cacheExpiry) {
    return settingsCache;
  }

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    const settingsData = (data || defaultSettings) as CompanySettings;
    settingsCache = settingsData;
    cacheExpiry = now + CACHE_DURATION;
    return settingsData;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return defaultSettings;
  }
}

export function invalidateCompanySettingsCache() {
  settingsCache = null;
  cacheExpiry = 0;
}
