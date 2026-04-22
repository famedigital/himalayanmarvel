'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CloudinaryUpload from './CloudinaryUpload';
import { Plus, X, GripVertical, Image as ImageIcon, Video, Save, Loader2 } from 'lucide-react';

interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

interface HeroManagerProps {
  initialSlides: HeroSlide[];
}

export default function HeroManager({ initialSlides }: HeroManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const supabase = createClient();

  const addSlide = (type: 'image' | 'video') => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      type,
      url: '',
      thumbnail: '',
    };
    setSlides([...slides, newSlide]);
    setEditingSlide(newSlide.id);
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
    if (editingSlide === id) setEditingSlide(null);
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from('settings')
        .upsert({
          key: 'hero_slides',
          value: slides,
          updated_at: new Date().toISOString(),
        });

      alert('Hero slides saved successfully!');
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

      {/* Add New Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => addSlide('image')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          Add Image Slide
        </button>
        <button
          onClick={() => addSlide('video')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Video className="w-4 h-4" />
          Add Video Slide
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Slide Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="font-medium text-gray-900">
                  Slide {index + 1} ({slide.type})
                </span>
              </div>
              <button
                onClick={() => removeSlide(slide.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Content */}
            <div className="p-4 space-y-4">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {slide.type === 'video' ? 'Video URL (MP4)' : 'Image'}
                </label>
                {slide.type === 'image' ? (
                  <CloudinaryUpload
                    onUploadComplete={(url) => updateSlide(slide.id, { url })}
                    onRemove={() => updateSlide(slide.id, { url: '' })}
                    value={slide.url}
                    label="Upload hero image"
                    folder="himalayanmarvel/hero"
                    aspect="video"
                    size="lg"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={slide.url}
                      onChange={(e) => updateSlide(slide.id, { url: e.target.value })}
                      placeholder="https://res.cloudinary.com/.../video.mp4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                    {slide.url && (
                      <video
                        src={slide.url}
                        controls
                        className="w-full rounded-xl aspect-video object-cover"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail for video */}
              {slide.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Thumbnail (shown when video not playing)
                  </label>
                  <CloudinaryUpload
                    onUploadComplete={(thumbnail) => updateSlide(slide.id, { thumbnail })}
                    onRemove={() => updateSlide(slide.id, { thumbnail: '' })}
                    value={slide.thumbnail}
                    label="Upload thumbnail"
                    folder="himalayanmarvel/hero/thumbnails"
                    aspect="video"
                    size="lg"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={slide.title || ''}
                  onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                  placeholder="Discover the Land of the Thunder Dragon"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (optional)
                </label>
                <input
                  type="text"
                  value={slide.subtitle || ''}
                  onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                  placeholder="Luxury tours in the Himalayan Kingdom"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call-to-Action Link (optional)
                </label>
                <input
                  type="text"
                  value={slide.link || ''}
                  onChange={(e) => updateSlide(slide.id, { link: e.target.value })}
                  placeholder="/tours"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
          <h3 className="text-gray-900 font-semibold text-lg mb-2">No slides yet</h3>
          <p className="text-gray-900/50">Add your first hero image or video</p>
        </div>
      )}
    </div>
  );
}
