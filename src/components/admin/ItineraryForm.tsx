'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save,
  Eye,
  Download,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Home,
  Calendar,
  Mail,
  Image as ImageIcon,
  DollarSign,
  FileCheck,
  ListChecks,
  Sparkles
} from 'lucide-react';
import { ItineraryFormData, DayFormData } from '@/lib/supabase/itinerary-types';

interface ItineraryFormProps {
  bookingId?: string;
  initialData?: any;
}

const TEMPLATES = [
  { id: 'forest-classic', name: 'Forest Classic', description: 'Druk Path style' },
  { id: 'navy-photography', name: 'Photography Navy', description: 'For photo tours' },
  { id: 'warm-family', name: 'Warm Family', description: 'Family adventures' }
];

export function ItineraryForm({ bookingId, initialData }: ItineraryFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<string>('cover');
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [template, setTemplate] = useState('forest-classic');
  const [cover, setCover] = useState({
    title: '',
    subtitle: '',
    logo: 'Silverpine Bhutan',
    guest_names: '',
    start_date: '',
    end_date: '',
    cover_image: ''
  });

  const [letter, setLetter] = useState({
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    salutation: 'Kuzu zangpo la,',
    body: '',
    signature_name: 'Tashi Delek',
    signature_title: 'Silverpine Bhutan'
  });

  const [days, setDays] = useState<DayFormData[]>([
    {
      day_number: 1,
      title: '',
      subtitle: '',
      altitude: '',
      distance: '',
      duration: '',
      high_point: '',
      night_location: '',
      description: '',
      drop_cap: true,
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      weather_text: '',
      temperature: '',
      image_url: '',
      image_alt: '',
      highlights: '',
      pull_quote: ''
    }
  ]);

  const [pricing, setPricing] = useState({
    currency: 'USD',
    symbol: '$',
    total: '',
    total_label: 'Total Package Cost',
    items: [{ label: '', description: '', amount: '' }],
    inclusions: '',
    exclusions: ''
  });

  const [terms, setTerms] = useState({
    booking_payment: 'A 30% non-refundable deposit is required to confirm your booking. The remaining balance must be paid 30 days before your arrival date.',
    cancellation_policy: 'Full refund (minus deposit) for cancellations made 60+ days before departure. 50% refund for cancellations 30-60 days before. No refund within 30 days of departure.',
    travel_insurance: 'Travel insurance covering trekking up to 4,500m altitude is mandatory for all participants.',
    health_fitness: 'A good level of physical fitness is required. We recommend consulting your doctor before undertaking high-altitude trekking.',
    liability: 'We act as an agent for hotels, transport, and service providers. We shall not be liable for any injury, damage, loss, delay, or irregularity caused by defects in services.'
  });

  const [checklist, setChecklist] = useState({
    documents: 'Valid passport (6 months validity)\nTravel insurance documents\nBooking confirmation\nPassport photos (4 copies)',
    clothing: 'Hiking boots (broken in)\nTrekking pants (2 pairs)\nThermal underwear\nFleece jacket\nDown jacket\nRain jacket\nWool socks (5 pairs)',
    gear: 'Day backpack (30L)\nWater bottle (2L)\nHeadlamp\nSunscreen SPF 50+\nLip balm\nTrekking poles',
    essentials: 'Personal medications\nAltitude sickness meds\nPain relievers\nBand-aids / blister kit\nHand sanitizer\nWet wipes'
  });

  const [sectionOpeners, setSectionOpeners] = useState([
    { section_number: 1, title: 'THE JOURNEY BEGINS', subtitle: 'Your Adventure Starts', background_image: '' }
  ]);

  const addDay = () => {
    const newDayNumber = days.length + 1;
    setDays([...days, {
      day_number: newDayNumber,
      title: '',
      subtitle: '',
      altitude: '',
      distance: '',
      duration: '',
      high_point: '',
      night_location: '',
      description: '',
      drop_cap: true,
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      weather_text: '',
      temperature: '',
      image_url: '',
      image_alt: '',
      highlights: '',
      pull_quote: ''
    }]);
  };

  const removeDay = (index: number) => {
    if (days.length > 1) {
      const newDays = days.filter((_, i) => i !== index);
      // Renumber days
      newDays.forEach((day, i) => day.day_number = i + 1);
      setDays(newDays);
    }
  };

  const updateDay = (index: number, field: keyof DayFormData, value: any) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addPricingItem = () => {
    setPricing({
      ...pricing,
      items: [...pricing.items, { label: '', description: '', amount: '' }]
    });
  };

  const removePricingItem = (index: number) => {
    const newItems = pricing.items.filter((_, i) => i !== index);
    setPricing({ ...pricing, items: newItems });
  };

  const updatePricingItem = (index: number, field: string, value: string) => {
    const newItems = [...pricing.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setPricing({ ...pricing, items: newItems });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Convert text areas to arrays
      const pricingInclusions = pricing.inclusions.split('\n').filter(i => i.trim());
      const pricingExclusions = pricing.exclusions.split('\n').filter(e => e.trim());

      const checklistDocuments = checklist.documents.split('\n').filter(d => d.trim());
      const checklistClothing = checklist.clothing.split('\n').filter(c => c.trim());
      const checklistGear = checklist.gear.split('\n').filter(g => g.trim());
      const checklistEssentials = checklist.essentials.split('\n').filter(e => e.trim());

      // Insert itinerary
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          title: cover.title,
          subtitle: cover.subtitle,
          logo: cover.logo,
          guest_names: cover.guest_names,
          start_date: cover.start_date || null,
          end_date: cover.end_date || null,
          cover_image: cover.cover_image || null,
          letter_date: letter.date,
          letter_salutation: letter.salutation,
          letter_body: letter.body.split('\n\n').filter(b => b.trim()),
          letter_signature_name: letter.signature_name,
          letter_signature_title: letter.signature_title,
          status: 'draft',
          booking_id: bookingId || null,
          pricing: {
            currency: pricing.currency,
            symbol: pricing.symbol,
            total: pricing.total,
            total_label: pricing.total_label,
            items: pricing.items.filter(i => i.label),
            inclusions: pricingInclusions,
            exclusions: pricingExclusions
          },
          terms: terms,
          checklist: {
            documents: checklistDocuments,
            clothing: checklistClothing,
            gear: checklistGear,
            essentials: checklistEssentials
          }
        })
        .select('id')
        .single();

      if (itineraryError) throw itineraryError;

      // Insert days
      const daysToInsert = days
        .filter(d => d.title)
        .map(day => ({
          itinerary_id: itineraryData.id,
          day_number: day.day_number,
          title: day.title,
          subtitle: day.subtitle || null,
          altitude: day.altitude || null,
          distance: day.distance || null,
          duration: day.duration || null,
          high_point: day.high_point || null,
          night_location: day.night_location || null,
          description: day.description || null,
          drop_cap: day.drop_cap,
          breakfast: day.breakfast || null,
          lunch: day.lunch || null,
          dinner: day.dinner || null,
          snacks: day.snacks || null,
          weather_text: day.weather_text || null,
          temperature: day.temperature || null,
          image_url: day.image_url || null,
          image_alt: day.image_alt || null,
          highlights: day.highlights.split('\n').filter(h => h.trim()),
          pull_quote: day.pull_quote || null
        }));

      if (daysToInsert.length > 0) {
        const { error: daysError } = await supabase
          .from('itinerary_days')
          .insert(daysToInsert);

        if (daysError) throw daysError;
      }

      // Insert section openers
      const openersToInsert = sectionOpeners
        .filter(s => s.title && s.background_image)
        .map((opener, i) => ({
          itinerary_id: itineraryData.id,
          section_number: i + 1,
          title: opener.title,
          subtitle: opener.subtitle || null,
          background_image: opener.background_image,
          page_number: i + 2 // After cover and letter
        }));

      if (openersToInsert.length > 0) {
        const { error: openersError } = await supabase
          .from('itinerary_section_openers')
          .insert(openersToInsert);

        if (openersError) throw openersError;
      }

      router.push('/admin/itineraries');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'cover', label: 'Cover', icon: Home },
    { id: 'letter', label: 'Letter', icon: Mail },
    { id: 'days', label: 'Days', icon: Calendar },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'terms', label: 'Terms', icon: FileCheck },
    { id: 'checklist', label: 'Checklist', icon: ListChecks },
    { id: 'template', label: 'Template', icon: Sparkles }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Itinerary</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cover Tab */}
      {activeTab === 'cover' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cover Page</h2>
              <p className="text-sm text-gray-500">First impression settings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Title</label>
              <input
                type="text"
                value={cover.title}
                onChange={(e) => setCover({ ...cover, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="e.g., DRUK PATH TREK"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={cover.subtitle}
                onChange={(e) => setCover({ ...cover, subtitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="e.g., The Himalayan Kingdom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name(s)</label>
              <input
                type="text"
                value={cover.guest_names}
                onChange={(e) => setCover({ ...cover, guest_names: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="e.g., Michael & Branka Schaedle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
              <input
                type="text"
                value={cover.logo}
                onChange={(e) => setCover({ ...cover, logo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="Silverpine Bhutan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={cover.start_date}
                onChange={(e) => setCover({ ...cover, start_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={cover.end_date}
                onChange={(e) => setCover({ ...cover, end_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input
                type="url"
                value={cover.cover_image}
                onChange={(e) => setCover({ ...cover, cover_image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Letter Tab */}
      {activeTab === 'letter' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Welcome Letter</h2>
              <p className="text-sm text-gray-500">Personalized greeting for guests</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Display</label>
              <input
                type="text"
                value={letter.date}
                onChange={(e) => setLetter({ ...letter, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="October 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salutation</label>
              <input
                type="text"
                value={letter.salutation}
                onChange={(e) => setLetter({ ...letter, salutation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="Kuzu zangpo la, Michael & Branka"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Letter Body (separate paragraphs with blank line)</label>
              <textarea
                value={letter.body}
                onChange={(e) => setLetter({ ...letter, body: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                placeholder="Thank you for choosing us for your trek to Bhutan...&#10;&#10;The Druk Path Trek is a beautiful walk..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature Name</label>
              <input
                type="text"
                value={letter.signature_name}
                onChange={(e) => setLetter({ ...letter, signature_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature Title</label>
              <input
                type="text"
                value={letter.signature_title}
                onChange={(e) => setLetter({ ...letter, signature_title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Days Tab */}
      {activeTab === 'days' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Day-by-Day Itinerary</h2>
                <p className="text-sm text-gray-500">{days.length} days</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addDay}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Day
            </button>
          </div>

          {days.map((day, index) => (
            <DayEditor
              key={index}
              day={day}
              dayNumber={index + 1}
              onUpdate={(field, value) => updateDay(index, field, value)}
              onRemove={() => removeDay(index)}
              canRemove={days.length > 1}
            />
          ))}
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
              <p className="text-sm text-gray-500">Cost breakdown</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={pricing.currency}
                onChange={(e) => setPricing({ ...pricing, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="BTN">BTN (Nu.)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input
                type="text"
                value={pricing.total}
                onChange={(e) => setPricing({ ...pricing, total: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50"
                placeholder="2,650"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Label</label>
              <input
                type="text"
                value={pricing.total_label}
                onChange={(e) => setPricing({ ...pricing, total_label: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Pricing Items</label>
              <button
                type="button"
                onClick={addPricingItem}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {pricing.items.map((item, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updatePricingItem(index, 'label', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Item name"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updatePricingItem(index, 'description', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Description (optional)"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => updatePricingItem(index, 'amount', e.target.value)}
                  className="w-28 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Amount"
                />
                <button
                  type="button"
                  onClick={() => removePricingItem(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                  disabled={pricing.items.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions (one per line)</label>
              <textarea
                value={pricing.inclusions}
                onChange={(e) => setPricing({ ...pricing, inclusions: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50"
                placeholder="3-star premium hotels&#10;All meals&#10;English-speaking guide"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions (one per line)</label>
              <textarea
                value={pricing.exclusions}
                onChange={(e) => setPricing({ ...pricing, exclusions: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50"
                placeholder="International flights&#10;Personal expenses&#10;Travel insurance"
              />
            </div>
          </div>
        </div>
      )}

      {/* Terms Tab */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2>
              <p className="text-sm text-gray-500">Legal and policy information</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(terms).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => setTerms({ ...terms, [key]: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Packing Checklist</h2>
              <p className="text-sm text-gray-500">What guests should bring</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(checklist).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                <textarea
                  value={value}
                  onChange={(e) => setChecklist({ ...checklist, [key]: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/50 text-sm"
                  placeholder="One item per line"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Tab */}
      {activeTab === 'template' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Select Template</h2>
              <p className="text-sm text-gray-500">Choose visual style</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  template === t.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.description}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Openers (Full-page dividers)</label>
            {sectionOpeners.map((opener, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={opener.title}
                  onChange={(e) => {
                    const newOpeners = [...sectionOpeners];
                    newOpeners[index].title = e.target.value;
                    setSectionOpeners(newOpeners);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={opener.subtitle}
                  onChange={(e) => {
                    const newOpeners = [...sectionOpeners];
                    newOpeners[index].subtitle = e.target.value;
                    setSectionOpeners(newOpeners);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Subtitle (optional)"
                />
                <input
                  type="url"
                  value={opener.background_image}
                  onChange={(e) => {
                    const newOpeners = [...sectionOpeners];
                    newOpeners[index].background_image = e.target.value;
                    setSectionOpeners(newOpeners);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Background image URL"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSectionOpeners([...sectionOpeners, {
                section_number: sectionOpeners.length + 1,
                title: '',
                subtitle: '',
                background_image: ''
              }])}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Section Opener
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Day Editor Component
function DayEditor({ day, dayNumber, onUpdate, onRemove, canRemove }: {
  day: DayFormData;
  dayNumber: number;
  onUpdate: (field: keyof DayFormData, value: any) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            {dayNumber}
          </div>
          <span className="font-semibold text-gray-900">
            {day.title || `Day ${dayNumber}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{day.subtitle || 'No subtitle'}</span>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day Title</label>
              <input
                type="text"
                value={day.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., Arrival in Paro • Acclimatization Day"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={day.subtitle}
                onChange={(e) => onUpdate('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Altitude</label>
              <input
                type="text"
                value={day.altitude}
                onChange={(e) => onUpdate('altitude', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., 2,250m"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <input
                type="text"
                value={day.distance}
                onChange={(e) => onUpdate('distance', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., 8 km"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration/Time</label>
              <input
                type="text"
                value={day.duration}
                onChange={(e) => onUpdate('duration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., 3-4 hrs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Night Location</label>
              <input
                type="text"
                value={day.night_location}
                onChange={(e) => onUpdate('night_location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., Paro"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={day.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
              placeholder="Describe the day's activities..."
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={day.drop_cap}
                onChange={(e) => onUpdate('drop_cap', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Use drop cap (large first letter)</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast</label>
              <input
                type="text"
                value={day.breakfast}
                onChange={(e) => onUpdate('breakfast', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lunch</label>
              <input
                type="text"
                value={day.lunch}
                onChange={(e) => onUpdate('lunch', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dinner</label>
              <input
                type="text"
                value={day.dinner}
                onChange={(e) => onUpdate('dinner', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Snacks</label>
              <input
                type="text"
                value={day.snacks}
                onChange={(e) => onUpdate('snacks', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weather Text</label>
              <input
                type="text"
                value={day.weather_text}
                onChange={(e) => onUpdate('weather_text', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., Partly Cloudy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
              <input
                type="text"
                value={day.temperature}
                onChange={(e) => onUpdate('temperature', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="e.g., 18°C"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day Image URL</label>
              <input
                type="url"
                value={day.image_url}
                onChange={(e) => onUpdate('image_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (one per line)</label>
            <textarea
              value={day.highlights}
              onChange={(e) => onUpdate('highlights', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
              placeholder="Traditional Welcome Ceremony&#10;National Museum Visit&#10;Paro Town Exploration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pull Quote (optional)</label>
            <textarea
              value={day.pull_quote}
              onChange={(e) => onUpdate('pull_quote', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm italic"
              placeholder='&quot;A sacred journey to one of Buddhism&apos;s most holy sites...&quot;'
            />
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Remove this day
            </button>
          )}
        </div>
      )}
    </div>
  );
}
