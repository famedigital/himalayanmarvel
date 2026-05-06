'use client';

import { useState } from 'react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface ConciergeInquiryEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export default function ConciergeInquiryEditor({
  initialData,
  onSave,
}: ConciergeInquiryEditorProps) {
  const [data, setData] = useState(
    initialData || {
      title: 'Begin Your Journey',
      description: 'Let us craft your perfect Bhutan experience',
      nameLabel: 'Your Name',
      emailLabel: 'Email Address',
      messageLabel: 'Tell us about your dream journey',
      buttonText: 'Start Planning',
      successMessage: 'Thank you! We\'ll be in touch within 24 hours.',
      backgroundImage: '',
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Concierge form saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Concierge Inquiry Form
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contact form configuration
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
        value={data.backgroundImage}
        onChange={(url) => setData({ ...data, backgroundImage: url })}
        onRemove={() => setData({ ...data, backgroundImage: '' })}
        label="Form Background Image"
        folder="himalayanmarvel/concierge"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Form Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Begin Your Journey"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={data.buttonText}
            onChange={(e) => setData({ ...data, buttonText: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Start Planning"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Form Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          placeholder="Let us craft your perfect Bhutan experience"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name Field Label
          </label>
          <input
            type="text"
            value={data.nameLabel}
            onChange={(e) => setData({ ...data, nameLabel: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Field Label
          </label>
          <input
            type="text"
            value={data.emailLabel}
            onChange={(e) => setData({ ...data, emailLabel: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Email Address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Field Label
          </label>
          <input
            type="text"
            value={data.messageLabel}
            onChange={(e) => setData({ ...data, messageLabel: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Tell us about your dream journey"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Success Message
          </label>
          <textarea
            value={data.successMessage}
            onChange={(e) => setData({ ...data, successMessage: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
            placeholder="Thank you! We'll be in touch within 24 hours."
          />
        </div>
      </div>
    </div>
  );
}
