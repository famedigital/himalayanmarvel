'use client';

import { useState } from 'react';
import { Plus, Trash2, Mail, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  responseTime?: string;
}

interface ConciergeFormData {
  title?: string;
  description?: string;
  formFields?: FormField[];
  contactInfo?: ContactInfo;
  successMessage?: string;
}

interface ConciergeInquiryEditorProps {
  initialData?: ConciergeFormData;
  onSave: (data: any) => void;
}

export default function ConciergeInquiryEditor({
  initialData,
  onSave,
}: ConciergeInquiryEditorProps) {
  const [data, setData] = useState<ConciergeFormData>(
    initialData || {
      title: 'Speak With Our',
      description: 'Every journey begins with a conversation, not a form. Share your vision, and we\'ll craft a journey that\'s exclusively yours.',
      formFields: [
        { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
        { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+1 234 567 8900', required: false },
      ],
      contactInfo: {
        email: 'info@himalayanmarvels.com',
        phone: '+975-77270465',
        whatsapp: '+975-77270465',
        responseTime: 'Within 24 hours',
      },
      successMessage: 'Thank you! Our concierge will contact you within 24 hours.',
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Concierge form saved');
  };

  const addFormField = () => {
    setData({
      ...data,
      formFields: [
        ...(data.formFields || []),
        {
          name: `field_${Date.now()}`,
          label: '',
          type: 'text',
          placeholder: '',
          required: false,
        }
      ]
    });
  };

  const removeFormField = (index: number) => {
    if ((data.formFields || []).length <= 1) {
      toast.error('At least one form field is required');
      return;
    }
    setData({
      ...data,
      formFields: (data.formFields || []).filter((_, i) => i !== index),
    });
  };

  const updateFormField = (index: number, field: string, value: any) => {
    setData({
      ...data,
      formFields: (data.formFields || []).map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Concierge Form
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contact form customization
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

      {/* Form Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Form Header</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Form Title
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Speak With Our"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Form Description
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
            placeholder="Every journey begins with a conversation..."
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Form Fields</h4>
          <button
            onClick={addFormField}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            Add Field
          </button>
        </div>

        <div className="space-y-3">
          {(data.formFields || []).map((field, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-gray-500">Field {index + 1}</span>
                <button
                  onClick={() => removeFormField(index)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateFormField(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) => updateFormField(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder}
                  onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`required-${index}`}
                  checked={field.required}
                  onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor={`required-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
                  Required field
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Contact Information Display</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={data.contactInfo?.email || ''}
              onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, email: e.target.value } })}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="info@himalayanmarvels.com"
            />
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={data.contactInfo?.phone || ''}
              onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, phone: e.target.value } })}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="+975-77270465"
            />
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={data.contactInfo?.whatsapp || ''}
              onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, whatsapp: e.target.value } })}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="+975-77270465"
            />
          </div>

          <div>
            <input
              type="text"
              value={data.contactInfo?.responseTime || ''}
              onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, responseTime: e.target.value } })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="Within 24 hours"
            />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Success Message</h4>
        <textarea
          value={data.successMessage || ''}
          onChange={(e) => setData({ ...data, successMessage: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-sm"
          placeholder="Thank you! Our concierge will contact you within 24 hours."
        />
      </div>
    </div>
  );
}
