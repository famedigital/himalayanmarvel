'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2, Building2, Phone, Mail, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

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

export function CompanySettingsForm() {
  const supabase = createClient();
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCurrency, setActiveCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (data) {
        // Ensure all string fields are non-null (use empty string as fallback)
        const safeData: CompanySettings = {
          company_name: data.company_name || '',
          license_number: data.license_number || '',
          mobile: data.mobile || '',
          email: data.email || '',
          website: data.website || '',
          address: data.address || '',
          logo_url: data.logo_url || '',
          tax_id: data.tax_id || '',
          gst_number: data.gst_number || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          twitter_url: data.twitter_url || '',
          linkedin_url: data.linkedin_url || '',
          bank_details: {
            INR: {
              bank_name: data.bank_details?.INR?.bank_name || '',
              account_number: data.bank_details?.INR?.account_number || '',
              ifsc: data.bank_details?.INR?.ifsc || '',
              branch: data.bank_details?.INR?.branch || '',
            },
            USD: {
              bank_name: data.bank_details?.USD?.bank_name || '',
              account_number: data.bank_details?.USD?.account_number || '',
              swift: data.bank_details?.USD?.swift || '',
              branch: data.bank_details?.USD?.branch || '',
            },
            EUR: {
              bank_name: data.bank_details?.EUR?.bank_name || '',
              account_number: data.bank_details?.EUR?.account_number || '',
              swift: data.bank_details?.EUR?.swift || '',
              branch: data.bank_details?.EUR?.branch || '',
            },
          },
        };
        setSettings({ ...safeData, id: data.id });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const timestamp = new Date().toISOString();

      if (settings.id) {
        const { error } = await supabase
          .from('company_settings')
          .update({
            ...settings,
            updated_at: timestamp,
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_settings')
          .insert({
            ...settings,
            updated_at: timestamp,
          });

        if (error) throw error;
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
      {/* Basic Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="company_name" className="text-[10px]">Company Name</Label>
            <Input
              id="company_name"
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="license_number" className="text-[10px]">License Number</Label>
            <Input
              id="license_number"
              value={settings.license_number}
              onChange={(e) => setSettings({ ...settings, license_number: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="mobile" className="text-[10px]">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={settings.mobile}
              onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
              placeholder="+975 2 322489"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[10px]">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="website" className="text-[10px]">Website</Label>
            <Input
              id="website"
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="address" className="text-[10px]">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={2}
              className="resize-none text-xs"
              placeholder="Thimphu, Bhutan"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tax_id" className="text-[10px]">Tax ID</Label>
            <Input
              id="tax_id"
              value={settings.tax_id}
              onChange={(e) => setSettings({ ...settings, tax_id: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gst_number" className="text-[10px]">GST Number</Label>
            <Input
              id="gst_number"
              value={settings.gst_number}
              onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Bank Details
        </h3>

        <Tabs value={activeCurrency} onValueChange={(v) => setActiveCurrency(v as 'INR' | 'USD' | 'EUR')} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="INR" className="text-xs">INR (₹)</TabsTrigger>
            <TabsTrigger value="USD" className="text-xs">USD ($)</TabsTrigger>
            <TabsTrigger value="EUR" className="text-xs">EUR (€)</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCurrency}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bank_name" className="text-[10px]">Bank Name</Label>
                <Input
                  id="bank_name"
                  value={settings.bank_details[activeCurrency].bank_name}
                  onChange={(e) => setSettings({
                    ...settings,
                    bank_details: {
                      ...settings.bank_details,
                      [activeCurrency]: {
                        ...settings.bank_details[activeCurrency],
                        bank_name: e.target.value,
                      },
                    },
                  })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="account_number" className="text-[10px]">Account Number</Label>
                <Input
                  id="account_number"
                  value={settings.bank_details[activeCurrency].account_number}
                  onChange={(e) => setSettings({
                    ...settings,
                    bank_details: {
                      ...settings.bank_details,
                      [activeCurrency]: {
                        ...settings.bank_details[activeCurrency],
                        account_number: e.target.value,
                      },
                    },
                  })}
                  className="h-8 text-xs"
                />
              </div>

              {activeCurrency === 'INR' ? (
                <div className="space-y-1">
                  <Label htmlFor="ifsc" className="text-[10px]">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    value={settings.bank_details.INR.ifsc}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank_details: {
                        ...settings.bank_details,
                        INR: {
                          ...settings.bank_details.INR,
                          ifsc: e.target.value,
                        },
                      },
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="swift" className="text-[10px]">SWIFT Code</Label>
                  <Input
                    id="swift"
                    value={activeCurrency === 'USD' ? settings.bank_details.USD.swift : settings.bank_details.EUR.swift}
                    onChange={(e) => setSettings({
                      ...settings,
                      bank_details: {
                        ...settings.bank_details,
                        [activeCurrency]: {
                          ...settings.bank_details[activeCurrency],
                          swift: e.target.value,
                        },
                      },
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="branch" className="text-[10px]">Branch</Label>
                <Input
                  id="branch"
                  value={settings.bank_details[activeCurrency].branch}
                  onChange={(e) => setSettings({
                    ...settings,
                    bank_details: {
                      ...settings.bank_details,
                      [activeCurrency]: {
                        ...settings.bank_details[activeCurrency],
                        branch: e.target.value,
                      },
                    },
                  })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Media */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Social Media</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="facebook_url" className="text-[10px]">Facebook</Label>
            <Input
              id="facebook_url"
              type="url"
              value={settings.facebook_url}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              placeholder="https://facebook.com/himalayanmarvels"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="instagram_url" className="text-[10px]">Instagram</Label>
            <Input
              id="instagram_url"
              type="url"
              value={settings.instagram_url}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              placeholder="https://instagram.com/himalayanmarvels"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 h-9 px-4 text-xs font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
