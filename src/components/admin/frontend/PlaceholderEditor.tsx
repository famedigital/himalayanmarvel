'use client';

import { useState } from 'react';

interface PlaceholderEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
  sectionName: string;
}

export default function PlaceholderEditor({
  initialData,
  onSave,
  sectionName,
}: PlaceholderEditorProps) {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sectionName} Editor
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Edit the content for this section
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

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {sectionName} editor coming soon...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          This will allow you to edit all content in the {sectionName} section
        </p>
      </div>

      {Object.keys(data).length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Current data stored: {JSON.stringify(data, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
}
