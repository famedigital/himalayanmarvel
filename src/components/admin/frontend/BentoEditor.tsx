'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface TourCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  link: string;
}

interface BentoEditorProps {
  initialData?: TourCategory[];
  onSave: (data: any) => void;
}

export default function BentoEditor({ initialData, onSave }: BentoEditorProps) {
  const [categories, setCategories] = useState<TourCategory[]>(
    initialData || [
      {
        id: '1',
        title: 'Cultural Journeys',
        subtitle: '7-14 Days',
        description: 'Discover ancient monasteries, sacred festivals, and timeless Bhutanese traditions in comfort.',
        image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg',
        price: 'From $2,499',
        link: '/tours',
      },
      {
        id: '2',
        title: 'Spiritual & Wellness',
        subtitle: '8-12 Days',
        description: 'Transformative experiences with meditation, hot stone baths, and private monastery visits.',
        image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291877/dochula_r3uler.jpg',
        price: 'From $3,199',
        link: '/tours',
      },
      {
        id: '3',
        title: 'Himalayan Treks',
        subtitle: '12-21 Days',
        description: 'Challenge yourself on legendary routes like Snowman Trek through remote Himalayan wilderness.',
        image: 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg',
        price: 'From $4,499',
        link: '/tours',
      },
    ]
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (categories.length === 0) {
      toast.error('Add at least one category');
      return;
    }
    setSaving(true);
    await onSave(categories);
    setSaving(false);
    toast.success('Bento section saved');
  };

  const addCategory = () => {
    const newId = Date.now().toString();
    setCategories([
      ...categories,
      {
        id: newId,
        title: '',
        subtitle: '',
        description: '',
        image: '',
        price: '',
        link: '/tours',
      },
    ]);
  };

  const removeCategory = (id: string) => {
    if (categories.length <= 1) {
      toast.error('Cannot remove the last category');
      return;
    }
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, field: keyof TourCategory, value: string) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Bento Tour Categories
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage the tour categories displayed in the bento grid
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Category {index + 1} {index === 0 && '(Hero - Larger)'}
                </h4>
              </div>
              <button
                onClick={() => removeCategory(category.id)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Cultural Journeys"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle (Badge)
                </label>
                <input
                  type="text"
                  value={category.subtitle}
                  onChange={(e) => updateCategory(category.id, 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="7-14 Days"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description {index === 0 && '(Shown on hero card)'}
                </label>
                <textarea
                  value={category.description}
                  onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                  placeholder="Discover ancient monasteries..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={category.image}
                  onChange={(e) => updateCategory(category.id, 'image', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  value={category.price}
                  onChange={(e) => updateCategory(category.id, 'price', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="From $2,499"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link URL
                </label>
                <input
                  type="text"
                  value={category.link}
                  onChange={(e) => updateCategory(category.id, 'link', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="/tours"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
