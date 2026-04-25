'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Building2 } from 'lucide-react';

export default function BankDetailsManager() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankDetails, setBankDetails] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'bank_details')
      .single();

    if (data?.value) {
      // If it's an object, convert to text; if already text, use as-is
      if (typeof data.value === 'object') {
        setBankDetails(JSON.stringify(data.value, null, 2));
      } else {
        setBankDetails(data.value);
      }
    } else {
      // Default placeholder
      setBankDetails(`Bank: Bhutan National Bank
Account Name: Himalayan Marvels
Account Number: [Your Account Number]
SWIFT Code: BNBTBTBT
Bank Address: Thimphu, Bhutan
Currency: USD

[Add any additional payment details or instructions below]`);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    await supabase
      .from('settings')
      .upsert({
        key: 'bank_details',
        value: bankDetails,
        description: 'Bank wire transfer details for payments',
      });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bank Details</h2>
          <p className="text-sm text-gray-500">Payment information for clients (flexible format)</p>
        </div>
      </div>

      <textarea
        value={bankDetails}
        onChange={(e) => setBankDetails(e.target.value)}
        rows={12}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
      />

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}
