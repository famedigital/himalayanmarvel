'use client';

import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  quote: string;
  reviewer: string;
  date: string;
  rating: number;
}

interface TripAdvisorReviewsData {
  badgeImage?: string;
  reviews?: Review[];
}

interface TripAdvisorReviewsEditorProps {
  initialData?: TripAdvisorReviewsData;
  onSave: (data: any) => void;
}

export default function TripAdvisorReviewsEditor({
  initialData,
  onSave,
}: TripAdvisorReviewsEditorProps) {
  const [data, setData] = useState<TripAdvisorReviewsData>(
    initialData || {
      badgeImage: '',
      reviews: [
        {
          id: '1',
          quote: 'An absolutely incredible experience. Himalayan Marvels planned every detail perfectly.',
          reviewer: 'Sarah Johnson',
          date: 'March 2024',
          rating: 5,
        },
      ],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Reviews saved');
  };

  const addReview = () => {
    setData({
      ...data,
      reviews: [
        ...(data.reviews || []),
        {
          id: Date.now().toString(),
          quote: '',
          reviewer: '',
          date: '',
          rating: 5,
        },
      ],
    });
  };

  const removeReview = (id: string) => {
    setData({
      ...data,
      reviews: (data.reviews || []).filter((r: Review) => r.id !== id),
    });
  };

  const updateReview = (id: string, field: string, value: any) => {
    setData({
      ...data,
      reviews: (data.reviews || []).map((r: Review) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            TripAdvisor Reviews
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customer reviews and ratings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addReview}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Review
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
        {(data.reviews || []).map((review: Review, index: number) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Review {index + 1}
              </h4>
              <button
                onClick={() => removeReview(review.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateReview(review.id, 'rating', star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={review.quote}
                onChange={(e) =>
                  updateReview(review.id, 'quote', e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Review quote..."
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={review.reviewer}
                  onChange={(e) =>
                    updateReview(review.id, 'reviewer', e.target.value)
                  }
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Reviewer name"
                />

                <input
                  type="text"
                  value={review.date}
                  onChange={(e) =>
                    updateReview(review.id, 'date', e.target.value)
                  }
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="March 2024"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
