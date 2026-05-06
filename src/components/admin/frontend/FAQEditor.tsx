'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQEditorProps {
  initialData?: { items?: FAQ[] };
  onSave: (data: any) => void;
}

export default function FAQEditor({ initialData, onSave }: FAQEditorProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(
    initialData?.items || [
      {
        id: '1',
        question: 'Do I need a visa to visit Bhutan?',
        answer: 'Yes, all international tourists require a visa to enter Bhutan. We handle all visa processing as part of our tour packages.',
      },
      {
        id: '2',
        question: 'What is the daily tariff in Bhutan?',
        answer: 'Bhutan has a Daily Sustainable Development Fee (SDF) of $100 per person per night for guests from countries other than India and Bangladesh.',
      },
      {
        id: '3',
        question: 'When is the best time to visit Bhutan?',
        answer: 'The best times to visit are spring (March-May) and autumn (September-November). These seasons offer clear skies, pleasant temperatures.',
      },
      {
        id: '4',
        question: 'How do I reach Bhutan?',
        answer: 'You can fly to Paro International Airport via Drukair or Bhutan Airlines from several connecting cities.',
      },
      {
        id: '5',
        question: 'Can I customize my itinerary?',
        answer: 'Absolutely! All our tour packages can be tailored to your preferences.',
      },
    ]
  );
  const [saving, setSaving] = useState(false);

  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: '',
    };
    setFaqs([...faqs, newFAQ]);
  };

  const removeFAQ = (id: string) => {
    if (faqs.length <= 1) {
      toast.error('You must have at least one FAQ');
      return;
    }
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(
      faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSave = async () => {
    // Validate
    const hasEmpty = faqs.some((faq) => !faq.question.trim() || !faq.answer.trim());
    if (hasEmpty) {
      toast.error('Please fill in all questions and answers');
      return;
    }

    setSaving(true);
    await onSave({ items: faqs });
    setSaving(false);
    toast.success('FAQ saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            FAQ Section
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage frequently asked questions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addFAQ}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
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

      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Section Title
        </label>
        <input
          type="text"
          defaultValue="Frequently Asked Questions"
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="Frequently Asked Questions"
        />
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* FAQ Header */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                FAQ {index + 1}
              </span>
              <button
                onClick={() => removeFAQ(faq.id)}
                className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* FAQ Fields */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Enter your question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter the answer..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No FAQs yet</p>
          <button
            onClick={addFAQ}
            className="text-amber-500 hover:text-amber-600 font-medium"
          >
            Add your first FAQ
          </button>
        </div>
      )}
    </div>
  );
}
