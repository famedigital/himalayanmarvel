'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CloudinaryUpload from './CloudinaryUpload';
import { Plus, X, GripVertical, Image as ImageIcon, Video, Save, Loader2, Copy } from 'lucide-react';

interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  logo?: string;
  subtitle?: string;
  link?: string;
  description?: string;
  keywords?: string[];
  experienceLabel?: string;
  ctaText?: string;
  isPrimary?: boolean;
}

interface HeroManagerProps {
  initialSlides: HeroSlide[];
  initialSettingId?: string | null;
}

export default function HeroManager({ initialSlides, initialSettingId = null }: HeroManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [settingId, setSettingId] = useState<string | null>(initialSettingId);
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

  const duplicateSlide = (id: string) => {
    const slideToDuplicate = slides.find(s => s.id === id);
    if (!slideToDuplicate) return;

    const newSlide: HeroSlide = {
      ...slideToDuplicate,
      id: Date.now().toString(),
      isPrimary: false, // Duplicates are never primary by default
    };
    setSlides([...slides, newSlide]);
  };

  const setPrimarySlide = (id: string) => {
    setSlides(slides.map(s => ({
      ...s,
      isPrimary: s.id === id
    })));
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const timestamp = new Date().toISOString();

      if (settingId) {
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            value: slides,
            updated_at: timestamp,
          })
          .eq('id', settingId);

        if (updateError) throw updateError;
      } else {
        const { data: insertedRow, error: insertError } = await supabase
          .from('settings')
          .insert({
            key: 'hero_slides',
            value: slides,
            updated_at: timestamp,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        if (insertedRow?.id) {
          setSettingId(insertedRow.id);
        }
      }

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
                <span className={`font-medium ${slide.isPrimary ? 'text-orange-600' : 'text-gray-900'}`}>
                  {slide.isPrimary && '★ '}
                  Slide {index + 1} ({slide.type})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Primary Toggle */}
                <button
                  onClick={() => setPrimarySlide(slide.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    slide.isPrimary
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {slide.isPrimary ? 'Primary' : 'Make Primary'}
                </button>
                {/* Duplicate Button */}
                <button
                  onClick={() => duplicateSlide(slide.id)}
                  className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Duplicate slide"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => removeSlide(slide.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete slide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <CloudinaryUpload
                  onUploadComplete={(logo) => updateSlide(slide.id, { logo })}
                  onRemove={() => updateSlide(slide.id, { logo: '' })}
                  value={slide.logo}
                  label="Upload hero logo"
                  folder="himalayanmarvel/hero/logo"
                  aspect="square"
                  size="md"
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

              {/* CTA Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text (optional)
                </label>
                <input
                  type="text"
                  value={slide.ctaText || ''}
                  onChange={(e) => updateSlide(slide.id, { ctaText: e.target.value })}
                  placeholder="Begin a conversation"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Experience Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Label (optional)
                </label>
                <input
                  type="text"
                  value={slide.experienceLabel || ''}
                  onChange={(e) => updateSlide(slide.id, { experienceLabel: e.target.value })}
                  placeholder="Experience"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={slide.description || ''}
                  onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                  placeholder="Bhutan is not a destination. It's a shift in perspective."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Keywords (comma separated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typewriter Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={slide.keywords?.join(', ') || ''}
                  onChange={(e) => updateSlide(slide.id, { keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                  placeholder="Sacred Landscapes, Living Traditions, Moments of Stillness"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">These words will cycle with the typewriter effect</p>
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
