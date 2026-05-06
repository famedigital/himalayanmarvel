'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface FooterEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export default function FooterEditor({
  initialData,
  onSave,
}: FooterEditorProps) {
  const [data, setData] = useState(
    initialData || {
      logo: '',
      companyName: 'Himalayan Marvels',
      tagline: 'Bhutan\'s Premier Luxury Travel Concierge',
      contact: {
        email: 'info@himalayanmarvels.com',
        phone: '+975-77270465',
        address: 'Thimphu, Bhutan',
      },
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/himalayanmarvels.travel/', icon: 'instagram' },
        { platform: 'facebook', url: 'https://www.facebook.com/himalayanmarvels', icon: 'facebook' },
      ],
      quickLinks: [
        { label: 'About Us', href: '/about' },
        { label: 'Tours', href: '/tours' },
        { label: 'Concierge', href: '/concierge' },
        { label: 'Blog', href: '/blog' },
      ],
      copyright: `© ${new Date().getFullYear()} Himalayan Marvels. All rights reserved.`,
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Footer saved successfully');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Footer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Customize your website footer
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Logo & Branding */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding</h4>

        <ImageInput
          value={data.logo}
          onChange={(url) => setData({ ...data, logo: url })}
          onRemove={() => setData({ ...data, logo: '' })}
          label="Company Logo"
          folder="himalayanmarvel/logo"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => setData({ ...data, companyName: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Himalayan Marvels"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Bhutan's Premier Luxury Travel Concierge"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="info@himalayanmarvels.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="+975-77270465"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <input
              type="text"
              value={data.contact.address}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Thimphu, Bhutan"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h4>
          <button
            onClick={() => setData({
              ...data,
              socialLinks: [...data.socialLinks, { platform: '', url: '', icon: 'link' }]
            })}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          {data.socialLinks.map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => {
                  const newLinks = [...data.socialLinks];
                  newLinks[index] = { ...link, platform: e.target.value };
                  setData({ ...data, socialLinks: newLinks });
                }}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Platform (e.g., Instagram)"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...data.socialLinks];
                  newLinks[index] = { ...link, url: e.target.value };
                  setData({ ...data, socialLinks: newLinks });
                }}
                className="flex-[2] px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="https://instagram.com/himalayanmarvels"
              />
              <button
                onClick={() => {
                  const newLinks = data.socialLinks.filter((_: any, i: number) => i !== index);
                  setData({ ...data, socialLinks: newLinks });
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h4>
          <button
            onClick={() => setData({
              ...data,
              quickLinks: [...data.quickLinks, { label: '', href: '' }]
            })}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.quickLinks.map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...data.quickLinks];
                  newLinks[index] = { ...link, label: e.target.value };
                  setData({ ...data, quickLinks: newLinks });
                }}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Label"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => {
                  const newLinks = [...data.quickLinks];
                  newLinks[index] = { ...link, href: e.target.value };
                  setData({ ...data, quickLinks: newLinks });
                }}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="/about"
              />
              <button
                onClick={() => {
                  const newLinks = data.quickLinks.filter((_: any, i: number) => i !== index);
                  setData({ ...data, quickLinks: newLinks });
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Copyright Text</h4>
        <textarea
          value={data.copyright}
          onChange={(e) => setData({ ...data, copyright: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          placeholder={`© ${new Date().getFullYear()} Himalayan Marvels. All rights reserved.`}
        />
      </div>
    </div>
  );
}
