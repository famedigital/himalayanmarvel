'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface TrustArchitectureEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export default function TrustArchitectureEditor({
  initialData,
  onSave,
}: TrustArchitectureEditorProps) {
  const [data, setData] = useState(
    initialData || {
      licenseImage: '',
      partnerships: [],
      certifications: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Trust Architecture saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Trust Architecture
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Licenses, partnerships, and certifications
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <ImageInput
        value={data.licenseImage}
        onChange={(url) => setData({ ...data, licenseImage: url })}
        onRemove={() => setData({ ...data, licenseImage: '' })}
        label="Government License Image"
        folder="himalayanmarvel/licenses"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Partnership Logos
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <ImageInput
              key={i}
              value={data.partnerships?.[i] || ''}
              onChange={(url) => {
                const newPartnerships = [...(data.partnerships || [])];
                newPartnerships[i] = url;
                setData({ ...data, partnerships: newPartnerships });
              }}
              onRemove={() => {
                const newPartnerships = [...(data.partnerships || [])];
                newPartnerships.splice(i, 1);
                setData({ ...data, partnerships: newPartnerships });
              }}
              label={`Partnership Logo ${i + 1}`}
              folder="himalayanmarvel/partnerships"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
