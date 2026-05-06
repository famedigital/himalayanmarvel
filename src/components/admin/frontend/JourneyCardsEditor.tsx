'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ImageInput } from '../form/ImageInput';
import { toast } from 'sonner';

interface JourneyCard {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
}

interface JourneyCardsData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  cards?: JourneyCard[];
}

interface JourneyCardsEditorProps {
  initialData?: JourneyCardsData;
  onSave: (data: any) => void;
}

export default function JourneyCardsEditor({
  initialData,
  onSave,
}: JourneyCardsEditorProps) {
  const [data, setData] = useState<JourneyCardsData>(
    initialData || {
      sectionTitle: 'Curated Journeys',
      sectionSubtitle: 'Discover Bhutan through experiences designed for the discerning traveler',
      cards: [
        {
          id: '1',
          title: 'Cultural Immersion',
          description: 'Deep dive into Bhutanese traditions, festivals, and way of life',
          image: '',
          ctaText: 'Explore',
        },
        {
          id: '2',
          title: 'Luxury Trekking',
          description: 'Premium trekking experiences with luxury camp accommodations',
          image: '',
          ctaText: 'Discover',
        },
        {
          id: '3',
          title: 'Spiritual Journeys',
          description: 'Meditation retreats and monastery visits for inner peace',
          image: '',
          ctaText: 'Experience',
        },
      ],
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    toast.success('Journey Cards saved');
  };

  const addCard = () => {
    setData({
      ...data,
      cards: [
        ...(data.cards || []),
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          image: '',
          ctaText: 'Explore',
        },
      ],
    });
  };

  const removeCard = (id: string) => {
    setData({
      ...data,
      cards: (data.cards || []).filter((card: JourneyCard) => card.id !== id),
    });
  };

  const updateCard = (id: string, field: string, value: string) => {
    setData({
      ...data,
      cards: (data.cards || []).map((card: JourneyCard) =>
        card.id === id ? { ...card, [field]: value } : card
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Journey Cards
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tour category showcase cards
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addCard}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Card
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={data.sectionTitle || ''}
            onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Curated Journeys"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            value={data.sectionSubtitle || ''}
            onChange={(e) =>
              setData({ ...data, sectionSubtitle: e.target.value })
            }
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Discover Bhutan through experiences..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {(data.cards || []).map((card: JourneyCard, index: number) => (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Card {index + 1}
              </h4>
              <button
                onClick={() => removeCard(card.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <ImageInput
                value={card.image}
                onChange={(url) => updateCard(card.id, 'image', url)}
                onRemove={() => updateCard(card.id, 'image', '')}
                label="Card Image"
                folder="himalayanmarvel/journeys"
              />

              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Card Title"
              />

              <textarea
                value={card.description}
                onChange={(e) =>
                  updateCard(card.id, 'description', e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Card Description"
              />

              <input
                type="text"
                value={card.ctaText}
                onChange={(e) => updateCard(card.id, 'ctaText', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="CTA Button Text"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
