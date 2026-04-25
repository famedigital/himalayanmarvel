'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CloudinaryUpload from './CloudinaryUpload';
import { Plus, X, GripVertical, Image as ImageIcon, Save, Loader2, Pencil } from 'lucide-react';

interface TourCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  link: string;
}

interface TourCategoriesManagerProps {
  initialCategories: TourCategory[];
}

export default function TourCategoriesManager({ initialCategories }: TourCategoriesManagerProps) {
  const [categories, setCategories] = useState<TourCategory[]>(initialCategories);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const supabase = createClient();

  const addCategory = () => {
    const newCategory: TourCategory = {
      id: `cat-${Date.now()}`,
      title: 'New Category',
      subtitle: 'X Days',
      description: 'Category description goes here.',
      image: '',
      price: 'From $0',
      link: '/tours',
    };
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory.id);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    if (editingCategory === id) setEditingCategory(null);
  };

  const updateCategory = (id: string, updates: Partial<TourCategory>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from('settings')
        .upsert({
          key: 'tour_categories',
          value: categories,
          updated_at: new Date().toISOString(),
        });

      alert('Tour categories saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
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
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Add New Button */}
      <div className="flex gap-4">
        <button
          onClick={addCategory}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="font-medium text-gray-900 truncate">
                  {category.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-4 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <CloudinaryUpload
                  onUploadComplete={(image) => updateCategory(category.id, { image })}
                  onRemove={() => updateCategory(category.id, { image: '' })}
                  value={category.image}
                  label="Upload category image"
                  folder="himalayanmarvel/categories"
                  size="md"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateCategory(category.id, { title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (e.g., "7-14 Days")
                </label>
                <input
                  type="text"
                  value={category.subtitle}
                  onChange={(e) => updateCategory(category.id, { subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={category.description}
                  onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (e.g., "From $2,499")
                </label>
                <input
                  type="text"
                  value={category.price}
                  onChange={(e) => updateCategory(category.id, { price: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (e.g., "/tours?category=cultural")
                </label>
                <input
                  type="text"
                  value={category.link}
                  onChange={(e) => updateCategory(category.id, { link: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
          <h3 className="text-gray-900 font-semibold text-lg mb-2">No categories yet</h3>
          <p className="text-gray-900/50">Add your first tour category</p>
        </div>
      )}
    </div>
  );
}
