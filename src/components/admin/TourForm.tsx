'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CloudinaryUpload from './CloudinaryUpload';
import GalleryManager from './GalleryManager';
import {
  Map,
  Calendar,
  DollarSign,
  Tag,
  Save,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Tour, ItineraryDay } from '@/lib/supabase/types';
import { FormError } from './form';

// Zod validation schema for tour form
const tourSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  price: z
    .number()
    .min(0, 'Price must be a positive number')
    .optional()
    .or(z.literal(0)),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be at least 1 day'),
  category: z
    .string()
    .optional()
    .or(z.literal('')),
});

type TourFormData = z.infer<typeof tourSchema>;

interface TourFormProps {
  tour?: Tour;
  isEdit?: boolean;
}

export default function TourForm({ tour, isEdit = false }: TourFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Form state with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: tour?.title || '',
      slug: tour?.slug || '',
      description: tour?.description || '',
      duration: tour?.duration || 1,
      price: tour?.price || 0,
      category: tour?.category || '',
    },
  });

  // Watch title for slug auto-generation
  const title = watch('title');
  const slug = watch('slug');

  // Additional state for arrays and objects
  const [heroImage, setHeroImage] = useState(tour?.hero_image || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(tour?.gallery_images || []);
  const [isPublished, setIsPublished] = useState(tour?.is_published || false);

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(tour?.highlights || ['']);

  // Inclusions
  const [inclusions, setInclusions] = useState<string[]>(tour?.inclusions || ['']);

  // Exclusions
  const [exclusions, setExclusions] = useState<string[]>(tour?.exclusions || ['']);

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(tour?.itinerary || []);

  // Generate slug from title
  useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', generatedSlug);
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: TourFormData) => {
    setLoading(true);
    setServerError('');

    try {
      const tourData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        duration: data.duration,
        price: data.price,
        category: data.category,
        hero_image: heroImage,
        gallery_images: galleryImages,
        highlights: highlights.filter((h) => h.trim() !== ''),
        inclusions: inclusions.filter((i) => i.trim() !== ''),
        exclusions: exclusions.filter((e) => e.trim() !== ''),
        itinerary,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      if (isEdit && tour?.id) {
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tour.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('tours').insert([
          {
            ...tourData,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      router.push('/admin/tours');
      router.refresh();
    } catch (error) {
      console.error('Error saving tour:', error);
      setServerError('Failed to save tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addListItem = (
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    setItems([...items, '']);
  };

  const removeListItem = (
    index: number,
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateListItem = (
    index: number,
    value: string,
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: [],
    };
    setItinerary([...itinerary, newDay]);
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = itinerary.filter((_, i) => i !== index);
    // Re-number days
    newItinerary.forEach((day, i) => (day.day = i + 1));
    setItinerary(newItinerary);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Server Error */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-500 text-sm">{serverError}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Tour Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-gray-200 focus:ring-orange-500/50'
              }`}
              placeholder="e.g., 7-Day Cultural Tour of Bhutan"
            />
            <FormError error={errors.title} />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Slug
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.slug
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-gray-200 focus:ring-orange-500/50'
              }`}
              placeholder="e.g., 7-day-cultural-tour-bhutan"
            />
            <FormError error={errors.slug} />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Duration (Days)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="duration"
                type="number"
                min="1"
                {...register('duration', { valueAsNumber: true })}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.duration
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-200 focus:ring-orange-500/50'
                }`}
              />
            </div>
            <FormError error={errors.duration} />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Price (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.price
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-200 focus:ring-orange-500/50'
                }`}
              />
            </div>
            <FormError error={errors.price} />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <select
                id="category"
                {...register('category')}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-white">
                  Select category
                </option>
                <option value="Cultural Tours" className="bg-white">
                  Cultural Tours
                </option>
                <option value="Trekking Adventures" className="bg-white">
                  Trekking Adventures
                </option>
                <option value="Festival Tours" className="bg-white">
                  Festival Tours
                </option>
                <option value="Wellness Retreats" className="bg-white">
                  Wellness Retreats
                </option>
                <option value="Private Tours" className="bg-white">
                  Private Tours
                </option>
              </select>
            </div>
            <FormError error={errors.category} />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900/70 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-gray-200 focus:ring-orange-500/50'
              }`}
              placeholder="Describe the tour experience..."
            />
            <div className="flex justify-between items-center mt-1">
              <FormError error={errors.description} />
              {watch('description') && (
                <span className="text-xs text-gray-900/40">
                  {watch('description').length} / 2000
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>

        <div className="space-y-6">
          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-900/70 mb-2">
              Hero Image
            </label>
            <CloudinaryUpload
              onUploadComplete={setHeroImage}
              onRemove={() => setHeroImage('')}
              value={heroImage}
              label="Upload hero image"
              folder="himalayanmarvel/tours"
              size="md"
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-900/70 mb-2">
              Gallery Images
            </label>
            <GalleryManager
              images={galleryImages}
              onChange={setGalleryImages}
              folder="himalayanmarvel/tours"
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Highlights</h2>
          <button
            type="button"
            onClick={() => addListItem(highlights, setHighlights)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={highlight}
                onChange={(e) =>
                  updateListItem(index, e.target.value, highlights, setHighlights)
                }
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="e.g., Visit Tiger's Nest Monastery"
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(index, highlights, setHighlights)}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inclusions */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Inclusions</h2>
          <button
            type="button"
            onClick={() => addListItem(inclusions, setInclusions)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {inclusions.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateListItem(index, e.target.value, inclusions, setInclusions)
                }
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="e.g., 3-star hotel accommodations"
              />
              {inclusions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(index, inclusions, setInclusions)}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exclusions */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Exclusions</h2>
          <button
            type="button"
            onClick={() => addListItem(exclusions, setExclusions)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {exclusions.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateListItem(index, e.target.value, exclusions, setExclusions)
                }
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="e.g., International airfare"
              />
              {exclusions.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeListItem(index, exclusions, setExclusions)
                  }
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Itinerary</h2>
          <button
            type="button"
            onClick={addItineraryDay}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Day
          </button>
        </div>

        {itinerary.length === 0 ? (
          <div className="text-center py-12">
            <Map className="w-12 h-12 text-gray-900/20 mx-auto mb-4" />
            <p className="text-gray-900/50">No days added yet</p>
            <button
              type="button"
              onClick={addItineraryDay}
              className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
            >
              + Add first day
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {itinerary.map((day, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Day {day.day}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900/70 mb-2">
                      Day Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) =>
                        updateItineraryDay(index, 'title', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                      placeholder="e.g., Arrival in Paro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900/70 mb-2">
                      Description
                    </label>
                    <textarea
                      value={day.description}
                      onChange={(e) =>
                        updateItineraryDay(index, 'description', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
                      placeholder="Describe the day's activities..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900/70 mb-2">
                      Activities
                    </label>
                    <textarea
                      value={
                        Array.isArray(day.activities)
                          ? day.activities.join('\n')
                          : ''
                      }
                      onChange={(e) =>
                        updateItineraryDay(
                          index,
                          'activities',
                          e.target.value.split('\n').filter((a) => a.trim())
                        )
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
                      placeholder="One activity per line&#10;e.g.,&#10;Visit Paro Dzong&#10;Check into hotel&#10;Welcome dinner"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 bg-gray-50 text-orange-500 focus:ring-orange-500/50"
          />
          <span className="text-gray-900">Publish tour</span>
        </label>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/tours')}
            className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? 'Update Tour' : 'Create Tour'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
