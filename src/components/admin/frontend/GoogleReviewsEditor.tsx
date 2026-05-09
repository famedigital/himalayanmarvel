'use client';

import { useState } from 'react';
import { Plus, Trash2, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface TopReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsData {
  rating?: number;
  reviewCount?: number;
  reviewSource?: string;
  reviewLink?: string;
  badgeText?: string;
  topReviews?: TopReview[];
}

interface GoogleReviewsEditorProps {
  initialData?: ReviewsData;
  onSave: (data: any) => void;
}

export default function GoogleReviewsEditor({
  initialData,
  onSave,
}: GoogleReviewsEditorProps) {
  const [data, setData] = useState<ReviewsData>(
    initialData || {
      rating: 4.9,
      reviewCount: 0,
      reviewSource: 'Google',
      reviewLink: 'https://share.google/jcfuEHOacCjzAmGaM',
      badgeText: 'Verified Excellence',
      topReviews: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!data.rating || data.rating < 0 || data.rating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Google Reviews section saved');
  };

  const addReview = () => {
    setData({
      ...data,
      topReviews: [
        ...(data.topReviews || []),
        {
          author: '',
          rating: 5,
          text: '',
          date: '',
        },
      ],
    });
  };

  const removeReview = (index: number) => {
    setData({
      ...data,
      topReviews: (data.topReviews || []).filter((_, i) => i !== index),
    });
  };

  const updateReview = (index: number, field: string, value: any) => {
    setData({
      ...data,
      topReviews: (data.topReviews || []).map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Google Reviews & Ratings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage Google rating display and top reviews
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

      {/* Main Rating Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Rating Display</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={data.rating || 4.9}
              onChange={(e) => setData({ ...data, rating: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="4.9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Review Count
            </label>
            <input
              type="number"
              min="0"
              value={data.reviewCount || 0}
              onChange={(e) => setData({ ...data, reviewCount: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review Link (Google Business Profile)
          </label>
          <input
            type="url"
            value={data.reviewLink || ''}
            onChange={(e) => setData({ ...data, reviewLink: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="https://google.com/maps/reviews..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Badge Text
          </label>
          <input
            type="text"
            value={data.badgeText || 'Verified Excellence'}
            onChange={(e) => setData({ ...data, badgeText: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Verified Excellence"
          />
        </div>
      </div>

      {/* Top Reviews */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Top Reviews (Optional)</h4>
          <button
            onClick={addReview}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        </div>

        {(data.topReviews || []).map((review, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                Review {index + 1}
              </h5>
              <button
                onClick={() => removeReview(index)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateReview(index, 'rating', star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Text
              </label>
              <textarea
                value={review.text}
                onChange={(e) => updateReview(index, 'text', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-sm"
                placeholder="Amazing experience..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={review.author}
                onChange={(e) => updateReview(index, 'author', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="Author name"
              />
              <input
                type="text"
                value={review.date}
                onChange={(e) => updateReview(index, 'date', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="March 2024"
              />
            </div>
          </div>
        ))}

        {(data.topReviews || []).length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No top reviews added. Click "Add Review" to showcase reviews.
          </p>
        )}
      </div>
    </div>
  );
}
