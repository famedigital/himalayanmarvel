'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export type NavContent = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

interface NavigationEditorProps {
  initialData?: NavContent | null;
  onSave: (data: NavContent) => Promise<void> | void;
}

export default function NavigationEditor({ initialData, onSave }: NavigationEditorProps) {
  const [data, setData] = useState<NavContent>(
    initialData || {
      phone: '+975 77270465',
      email: 'info@himalayanmarvels.com',
      whatsapp: '97577270465',
      ctaLabel: 'Plan Journey',
      ctaHref: '/concierge',
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success('Navigation settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Navigation</h3>
          <p className="text-sm text-gray-500 mt-1">
            Contact details shown in the site header. Layout stays unchanged.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Phone className="w-4 h-4" /> Phone
          </label>
          <input
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MessageCircle className="w-4 h-4" /> WhatsApp (digits only)
          </label>
          <input
            value={data.whatsapp || ''}
            onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background"
            placeholder="97577270465"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">CTA label</label>
            <input
              value={data.ctaLabel || ''}
              onChange={(e) => setData({ ...data, ctaLabel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">CTA href</label>
            <input
              value={data.ctaHref || ''}
              onChange={(e) => setData({ ...data, ctaHref: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
