'use client';

import { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
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
      badgeText: '',
      badgeIcon: 'Gem',
      sectionTitle: '',
      inclusions: [
        { icon: '', text: 'Private Transport' },
        { icon: '', text: 'Private Guide' },
        { icon: '', text: 'Luxury Stays' },
        { icon: '', text: 'Visa Handling' },
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Travelers' },
        { value: 4.9, suffix: '/5', label: 'Rating' },
        { value: 100, suffix: '%', label: 'Happy' },
      ],
      journeyPackages: [],
      socialLinks: [],
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

  const addInclusion = () => {
    setData({ ...data, inclusions: [...(data.inclusions || []), { text: '' }] });
  };

  const removeInclusion = (index: number) => {
    if ((data.inclusions || []).length <= 1) {
      toast.error('At least one inclusion is required');
      return;
    }
    setData({
      ...data,
      inclusions: (data.inclusions || []).filter((_x: any, i: number) => i !== index),
    });
  };

  const updateInclusion = (index: number, value: string) => {
    setData({
      ...data,
      inclusions: (data.inclusions || []).map((item: any, i: number) =>
        i === index ? { ...item, text: value } : item
      ),
    });
  };

  const addStat = () => {
    setData({
      ...data,
      stats: [...(data.stats || []), { value: 0, suffix: '', label: '' }]
    });
  };

  const removeStat = (index: number) => {
    setData({
      ...data,
      stats: (data.stats || []).filter((_x: any, i: number) => i !== index),
    });
  };

  const updateStat = (index: number, field: string, value: any) => {
    setData({
      ...data,
      stats: (data.stats || []).map((stat: any, i: number) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    });
  };

  const addJourneyPackage = () => {
    setData({
      ...data,
      journeyPackages: [
        ...(data.journeyPackages || []),
        { title: '', description: '', image: '', link: '' }
      ]
    });
  };

  const removeJourneyPackage = (index: number) => {
    setData({
      ...data,
      journeyPackages: (data.journeyPackages || []).filter((_x: any, i: number) => i !== index),
    });
  };

  const updateJourneyPackage = (index: number, field: string, value: string) => {
    setData({
      ...data,
      journeyPackages: (data.journeyPackages || []).map((pkg: any, i: number) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    });
  };

  const addSocialLink = () => {
    setData({
      ...data,
      socialLinks: [
        ...(data.socialLinks || []),
        { platform: '', url: '', icon: '' }
      ]
    });
  };

  const removeSocialLink = (index: number) => {
    setData({
      ...data,
      socialLinks: (data.socialLinks || []).filter((_x: any, i: number) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    setData({
      ...data,
      socialLinks: (data.socialLinks || []).map((link: any, i: number) =>
        i === index ? { ...link, [field]: value } : link
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Trust Architecture
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Licenses, partnerships, stats, and trust signals
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

      {/* Badge Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Badge Display</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Badge Text
            </label>
            <input
              type="text"
              value={data.badgeText || ''}
              onChange={(e) => setData({ ...data, badgeText: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="Spiritual Journeys"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Badge Icon Name
            </label>
            <input
              type="text"
              value={data.badgeIcon || 'Gem'}
              onChange={(e) => setData({ ...data, badgeIcon: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="Gem"
            />
          </div>
        </div>
      </div>

      {/* Inclusions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Inclusions List</h4>
          <button
            onClick={addInclusion}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(data.inclusions || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateInclusion(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="Private Transport"
              />
              <button
                onClick={() => removeInclusion(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Statistics</h4>
          <button
            onClick={addStat}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(data.stats || []).map((stat: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="number"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', parseFloat(e.target.value))}
                className="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="500"
              />
              <input
                type="text"
                value={stat.suffix}
                onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                className="w-16 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="+"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="Travelers"
              />
              <button
                onClick={() => removeStat(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Packages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Journey Packages (Optional)</h4>
          <button
            onClick={addJourneyPackage}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            Add Package
          </button>
        </div>
        <div className="space-y-3">
          {(data.journeyPackages || []).map((pkg: any, index: number) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Package {index + 1}</span>
                <button
                  onClick={() => removeJourneyPackage(index)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={pkg.title}
                  onChange={(e) => updateJourneyPackage(index, 'title', e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={pkg.link}
                  onChange={(e) => updateJourneyPackage(index, 'link', e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  placeholder="Link (/tours)"
                />
              </div>
              <textarea
                value={pkg.description}
                onChange={(e) => updateJourneyPackage(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-sm"
                placeholder="Description"
              />
              <ImageInput
                value={pkg.image}
                onChange={(url) => updateJourneyPackage(index, 'image', url)}
                onRemove={() => updateJourneyPackage(index, 'image', '')}
                label="Package Image"
                folder="himalayanmarvel/journeys"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">Social Links (Optional)</h4>
          <button
            onClick={addSocialLink}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Plus className="w-3 h-3" />
            Add Link
          </button>
        </div>
        <div className="space-y-2">
          {(data.socialLinks || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                className="w-32 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="Instagram"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="https://instagram.com/..."
              />
              <button
                onClick={() => removeSocialLink(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Partnerships & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Partnership Logos
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
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
                label={`Partnership ${i + 1}`}
                folder="himalayanmarvel/partnerships"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certification Logos
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <ImageInput
                key={i}
                value={data.certifications?.[i] || ''}
                onChange={(url) => {
                  const newCertifications = [...(data.certifications || [])];
                  newCertifications[i] = url;
                  setData({ ...data, certifications: newCertifications });
                }}
                onRemove={() => {
                  const newCertifications = [...(data.certifications || [])];
                  newCertifications.splice(i, 1);
                  setData({ ...data, certifications: newCertifications });
                }}
                label={`Certification ${i + 1}`}
                folder="himalayanmarvel/certifications"
              />
            ))}
          </div>
        </div>
      </div>

      {/* License Image */}
      <div>
        <ImageInput
          value={data.licenseImage}
          onChange={(url) => setData({ ...data, licenseImage: url })}
          onRemove={() => setData({ ...data, licenseImage: '' })}
          label="Government License Image"
          folder="himalayanmarvel/licenses"
        />
      </div>
    </div>
  );
}
