'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface Slide {
  id: string;
  image: string;
  text: string;
}

interface CinematicScrollData {
  sectionTitle?: string;
  slides?: Slide[];
}

interface CinematicScrollEditorProps {
  initialData?: CinematicScrollData;
  onSave: (data: any) => void;
}

export default function CinematicScrollEditor({
  initialData,
  onSave,
}: CinematicScrollEditorProps) {
  const [data, setData] = useState<CinematicScrollData>(
    initialData || {
      sectionTitle: 'The Journey of a Lifetime',
      slides: [
        {
          id: '1',
          image: '',
          text: 'Where ancient traditions meet timeless beauty',
        },
      ],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Cinematic Scroll saved');
  };

  const addSlide = () => {
    setData({
      ...data,
      slides: [
        ...(data.slides || []),
        {
          id: Date.now().toString(),
          image: '',
          text: '',
        },
      ],
    });
  };

  const removeSlide = (id: string) => {
    setData({
      ...data,
      slides: (data.slides || []).filter((s: Slide) => s.id !== id),
    });
  };

  const updateSlide = (id: string, field: string, value: string) => {
    setData({
      ...data,
      slides: (data.slides || []).map((s: Slide) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Cinematic Scroll
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scroll-based storytelling sections
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addSlide}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Slide
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Section Title
        </label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="The Journey of a Lifetime"
        />
      </div>

      <div className="space-y-4">
        {(data.slides || []).map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Slide {index + 1}
              </h4>
              <button
                onClick={() => removeSlide(slide.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageInput
                value={slide.image}
                onChange={(url) => updateSlide(slide.id, 'image', url)}
                onRemove={() => updateSlide(slide.id, 'image', '')}
                label="Slide Image"
                folder="himalayanmarvel/cinematic"
              />

              <textarea
                value={slide.text}
                onChange={(e) => updateSlide(slide.id, 'text', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Slide text overlay..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
