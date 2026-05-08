'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  quoteSource: string;
  image: string;
  icon: string;
  color: string;
}

interface CinematicData {
  chapters?: Chapter[];
}

interface CinematicScrollEditorProps {
  initialData?: CinematicData;
  onSave: (data: any) => void;
}

const ICON_OPTIONS = ['Star', 'Mountain', 'Compass', 'Camera', 'MapPin', 'Sparkles'];

const COLOR_OPTIONS = [
  'from-purple-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
];

export default function CinematicScrollEditor({
  initialData,
  onSave,
}: CinematicScrollEditorProps) {
  const [data, setData] = useState<CinematicData>(
    initialData || {
      chapters: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if ((data.chapters || []).length < 2) {
      toast.error('Please add at least 2 chapters');
      return;
    }
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Cinematic Scroll saved');
  };

  const addChapter = () => {
    const newId = (data.chapters?.length || 0) + 1;
    setData({
      ...data,
      chapters: [
        ...(data.chapters || []),
        {
          id: newId,
          title: `Chapter ${newId}`,
          subtitle: '',
          description: '',
          quote: '',
          quoteSource: '',
          image: '',
          icon: 'Star',
          color: COLOR_OPTIONS[newId % COLOR_OPTIONS.length],
        },
      ],
    });
  };

  const removeChapter = (id: number) => {
    if ((data.chapters || []).length <= 2) {
      toast.error('You must have at least 2 chapters');
      return;
    }
    setData({
      ...data,
      chapters: (data.chapters || []).filter((c) => c.id !== id),
    });
  };

  const updateChapter = (id: number, field: string, value: any) => {
    setData({
      ...data,
      chapters: (data.chapters || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
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
            Story chapters with images and quotes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addChapter}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
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

      <div className="space-y-6">
        {(data.chapters || []).map((chapter, index) => (
          <div
            key={chapter.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-500 font-display font-bold">
                    0{chapter.id}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Chapter {chapter.id}
                </h4>
              </div>
              <button
                onClick={() => removeChapter(chapter.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove chapter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="The Call"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={chapter.subtitle}
                    onChange={(e) => updateChapter(chapter.id, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="In a world that never stops"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={chapter.description}
                  onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                  placeholder="You feel disconnected. Overwhelmed. Yearning for something real..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quote
                  </label>
                  <textarea
                    value={chapter.quote}
                    onChange={(e) => updateChapter(chapter.id, 'quote', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    placeholder="The journey of a thousand miles begins with a single step..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quote Source
                  </label>
                  <input
                    type="text"
                    value={chapter.quoteSource}
                    onChange={(e) => updateChapter(chapter.id, 'quoteSource', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Lao Tzu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter Image
                </label>
                <ImageInput
                  value={chapter.image}
                  onChange={(url) => updateChapter(chapter.id, 'image', url)}
                  onRemove={() => updateChapter(chapter.id, 'image', '')}
                  label="Upload chapter image"
                  folder="himalayanmarvel/chapters"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={chapter.icon}
                    onChange={(e) => updateChapter(chapter.id, 'icon', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <select
                    value={chapter.color}
                    onChange={(e) => updateChapter(chapter.id, 'color', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {COLOR_OPTIONS.map((color) => (
                      <option key={color} value={color}>
                        {color.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(data.chapters || []).length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No chapters yet. Add your first chapter to start the journey.
            </p>
            <button
              onClick={addChapter}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Chapter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
