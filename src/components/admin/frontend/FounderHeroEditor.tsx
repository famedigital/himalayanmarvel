'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface FounderHeroEditorProps {
  initialData?: {
    portraitImage?: string;
    founderName?: string;
    quote?: string;
    education?: string[];
    luxuryBrands?: string[];
    licensed?: boolean;
    insured?: boolean;
  };
  onSave: (data: any) => void;
}

export default function FounderHeroEditor({
  initialData,
  onSave,
}: FounderHeroEditorProps) {
  const [data, setData] = useState(
    initialData || {
      portraitImage: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776275660/founder-portrait_pbo8m4.jpg',
      founderName: 'Bivatsu Giri',
      quote: "We don't sell tours. We craft journeys into a kingdom where happiness is the true measure of wealth.",
      education: ['Les Roches (Spain)', 'ICHM (Australia)', 'MBA — University of Canberra'],
      luxuryBrands: ['The Ritz-Carlton', 'Hyatt', 'Kempinski', 'Six Senses'],
      licensed: true,
      insured: true,
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!data.founderName?.trim()) {
      toast.error('Founder name is required');
      return;
    }
    if (!data.quote?.trim()) {
      toast.error('Quote is required');
      return;
    }

    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Founder Hero section saved');
  };

  const addEducation = () => {
    setData({ ...data, education: [...(data.education || []), ''] });
  };

  const removeEducation = (index: number) => {
    if ((data.education || []).length <= 1) {
      toast.error('At least one education credential is required');
      return;
    }
    setData({
      ...data,
      education: (data.education || []).filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, value: string) => {
    setData({
      ...data,
      education: (data.education || []).map((edu, i) => (i === index ? value : edu)),
    });
  };

  const addLuxuryBrand = () => {
    setData({ ...data, luxuryBrands: [...(data.luxuryBrands || []), ''] });
  };

  const removeLuxuryBrand = (index: number) => {
    if ((data.luxuryBrands || []).length <= 1) {
      toast.error('At least one luxury brand is required');
      return;
    }
    setData({
      ...data,
      luxuryBrands: (data.luxuryBrands || []).filter((_, i) => i !== index),
    });
  };

  const updateLuxuryBrand = (index: number, value: string) => {
    setData({
      ...data,
      luxuryBrands: (data.luxuryBrands || []).map((brand, i) =>
        i === index ? value : brand
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Founder Hero Section
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit founder credentials and story
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

      {/* Portrait Image */}
      <ImageInput
        value={data.portraitImage || ''}
        onChange={(url) => setData({ ...data, portraitImage: url })}
        onRemove={() => setData({ ...data, portraitImage: '' })}
        label="Founder Portrait Image"
        folder="himalayanmarvel/founder"
      />

      {/* Founder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Founder Name
        </label>
        <input
          type="text"
          value={data.founderName}
          onChange={(e) => setData({ ...data, founderName: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="Bivatsu Giri"
        />
      </div>

      {/* Quote */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Founder Quote
        </label>
        <textarea
          value={data.quote}
          onChange={(e) => setData({ ...data, quote: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          placeholder="Enter the founder's quote..."
        />
      </div>

      {/* Education Credentials */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Education Credentials
          </label>
          <button
            onClick={addEducation}
            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(data.education || []).map((edu, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={edu}
                onChange={(e) => updateEducation(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="e.g., Les Roches (Spain)"
              />
              <button
                onClick={() => removeEducation(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Brands */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Luxury Brands Worked With
          </label>
          <button
            onClick={addLuxuryBrand}
            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(data.luxuryBrands || []).map((brand, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={brand}
                onChange={(e) => updateLuxuryBrand(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="e.g., The Ritz-Carlton"
              />
              <button
                onClick={() => removeLuxuryBrand(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-amber-500 transition-colors">
          <input
            type="checkbox"
            checked={data.licensed}
            onChange={(e) => setData({ ...data, licensed: e.target.checked })}
            className="w-5 h-5 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Licensed</p>
            <p className="text-sm text-gray-500">Government licensed tour operator</p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-amber-500 transition-colors">
          <input
            type="checkbox"
            checked={data.insured}
            onChange={(e) => setData({ ...data, insured: e.target.checked })}
            className="w-5 h-5 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Insured</p>
            <p className="text-sm text-gray-500">Fully insured operations</p>
          </div>
        </label>
      </div>
    </div>
  );
}
