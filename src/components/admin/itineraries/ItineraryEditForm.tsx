/**
 * Admin Itinerary Edit/Create Form
 * Comprehensive form for creating and editing tour itineraries
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye, Plus, Trash2, Loader2, Calendar, CheckCircle, XCircle, X, Receipt, Download } from 'lucide-react';
import { generateItineraryHTML, ItineraryData, ItineraryDay as TemplateItineraryDay } from '@/lib/templates/itinerary-template';

// Extend the template interface to add images field
interface ItineraryDay extends TemplateItineraryDay {
  images?: string[]; // Multiple images per day
}
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { createClient } from '@/lib/supabase/client';

interface ItineraryForm {
  id?: string;
  title: string;
  slug?: string;
  subtitle?: string;
  guest_name: string;
  duration_days: number;
  duration_nights: number;
  start_date: string;
  end_date: string;
  destinations?: string[];
  cover_title?: string;
  cover_subtitle?: string;
  cover_image_url?: string;
  letter_date?: string;
  letter_salutation?: string;
  letter_body: string[];
  letter_signature_name?: string;
  letter_signature_title?: string;
  itinerary_days: ItineraryDay[];
  total_price: number;
  currency?: string;
  price_inclusions?: { title: string; description: string; }[];
  inclusions_list?: string[];
  terms?: { title: string; content: string; }[];
  packing_checklist?: { category: string; items: string[]; }[];
  contact_phone?: string;
  contact_email?: string;
  contact_website?: string;
  status: string;
  is_published: boolean;
}

interface ItineraryEditFormProps {
  itineraryId: string;
  initialData?: any;
}

export function ItineraryEditForm({ itineraryId, initialData }: ItineraryEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState<ItineraryForm>({
    title: '',
    slug: '',
    subtitle: '',
    guest_name: '',
    duration_days: 7,
    duration_nights: 6,
    start_date: '',
    end_date: '',
    destinations: [],
    cover_title: '',
    cover_subtitle: '',
    cover_image_url: undefined,
    letter_date: '',
    letter_salutation: '',
    letter_body: [''],
    letter_signature_name: '',
    letter_signature_title: '',
    itinerary_days: [],
    total_price: 0,
    currency: 'INR',
    price_inclusions: [],
    inclusions_list: [],
    terms: [],
    packing_checklist: [],
    contact_phone: '',
    contact_email: '',
    contact_website: '',
    status: 'draft',
    is_published: false,
  });

  useEffect(() => {
    if (initialData) {
      // Parse pricing from JSONB if it exists
      let totalPrice = initialData.total_price || 0;
      if (initialData.pricing && typeof initialData.pricing === 'object') {
        totalPrice = parseFloat(initialData.pricing.total?.toString() || '0') || 0;
      }

      setForm({
        title: initialData.title || '',
        slug: initialData.slug || '',
        subtitle: initialData.subtitle || '',
        guest_name: initialData.guest_name || initialData.guest_names || '',
        duration_days: initialData.duration_days || 7,
        duration_nights: initialData.duration_nights || 6,
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        destinations: initialData.destinations || [],
        cover_title: initialData.cover_title || '',
        cover_subtitle: initialData.cover_subtitle || '',
        cover_image_url: initialData.cover_image_url || initialData.cover_image || undefined,
        letter_date: initialData.letter_date || '',
        letter_salutation: initialData.letter_salutation || '',
        letter_body: Array.isArray(initialData.letter_body)
          ? initialData.letter_body
          : (typeof initialData.letter_body === 'string' ? [initialData.letter_body] : ['']),
        letter_signature_name: initialData.letter_signature_name || '',
        letter_signature_title: initialData.letter_signature_title || '',
        itinerary_days: Array.isArray(initialData.itinerary_days)
          ? initialData.itinerary_days.map((day: any, index: number) => ({
              day: day.day || index + 1,
              title: day.title || '',
              date: day.date || '',
              activity: day.activity || '',
              night: day.night || '',
              description: day.description || '',
              image_url: day.image_url || undefined,
              schedule: day.schedule || [],
              highlights: day.highlights || [],
              meals: day.meals || [],
              subsections: day.subsections || [],
            }))
          : [],
        total_price: totalPrice,
        currency: initialData.currency || (initialData.pricing?.currency) || 'INR',
        price_inclusions: typeof initialData.price_inclusions === 'string'
          ? (() => { try { return JSON.parse(initialData.price_inclusions); } catch { return undefined; } })()
          : Array.isArray(initialData.price_inclusions) ? initialData.price_inclusions : [],
        inclusions_list: typeof initialData.inclusions_list === 'string'
          ? (() => { try { return JSON.parse(initialData.inclusions_list); } catch { return undefined; } })()
          : Array.isArray(initialData.inclusions_list) ? initialData.inclusions_list : [],
        terms: typeof initialData.terms_conditions === 'string'
          ? (() => {
              try {
                const parsed = JSON.parse(initialData.terms_conditions);
                return Array.isArray(parsed) ? parsed : [];
              } catch { return []; }
            })()
          : Array.isArray(initialData.terms) ? initialData.terms : [],
        packing_checklist: typeof initialData.packing_checklist === 'string'
          ? (() => {
              try {
                const parsed = JSON.parse(initialData.packing_checklist);
                return Array.isArray(parsed) ? parsed : [];
              } catch { return []; }
            })()
          : typeof initialData.checklist === 'object' && initialData.checklist !== null
          ? Object.entries(initialData.checklist).map(([category, items]) => ({
              category,
              items: Array.isArray(items) ? items : []
            }))
          : [],
        contact_phone: initialData.contact_phone || '',
        contact_email: initialData.contact_email || '',
        contact_website: initialData.contact_website || '',
        status: initialData.status || 'draft',
        is_published: initialData.is_published || false,
      });
      setLoading(false);
    }
  }, [initialData]);

  // Auto-generate slug from title for new itineraries
  useEffect(() => {
    if (form.title && !form.slug) {
      const generatedSlug = form.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title, form.slug]);

  const addDay = () => {
    const dayNumber = form.itinerary_days.length + 1;
    setForm({
      ...form,
      itinerary_days: [
        ...form.itinerary_days,
        {
          day: dayNumber,
          title: `Day ${dayNumber}: Title`,
          date: '',
          activity: 'Full Day Sightseeing',
          night: '',
          description: '',
          images: [],
          schedule: [],
          highlights: [],
          meals: [],
        },
      ],
    });
    setActiveTab('days');
  };

  const addDayImage = (dayIndex: number, imageUrl: string) => {
    setForm(prevForm => {
      const newDays = [...prevForm.itinerary_days];
      if (!newDays[dayIndex].images) {
        newDays[dayIndex].images = [];
      }
      newDays[dayIndex].images = [...newDays[dayIndex].images, imageUrl];
      return { ...prevForm, itinerary_days: newDays };
    });
    toast.success('Image added to gallery');
  };

  const removeDayImage = (dayIndex: number, imageIndex: number) => {
    const newDays = [...form.itinerary_days];
    if (newDays[dayIndex].images) {
      newDays[dayIndex].images = newDays[dayIndex].images?.filter((_, i) => i !== imageIndex) || [];
    }
    setForm({ ...form, itinerary_days: newDays });
    toast.success('Image removed from gallery');
  };

  const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
    const newDays = [...form.itinerary_days];
    newDays[index] = {
      day: newDays[index].day,
      title: newDays[index].title,
      date: newDays[index].date,
      activity: newDays[index].activity || '',
      night: newDays[index].night,
      description: newDays[index].description,
      image_url: newDays[index].image_url,
      images: newDays[index].images || [],
      schedule: newDays[index].schedule || [],
      highlights: newDays[index].highlights || [],
      meals: newDays[index].meals || [],
      subsections: newDays[index].subsections || [],
      ...updates,
    };
    setForm({ ...form, itinerary_days: newDays });
  };

  const removeDay = (index: number) => {
    if (!confirm('Remove this day?')) return;
    const newDays = form.itinerary_days.filter((_, i) => i !== index);
    setForm({ ...form, itinerary_days: newDays });
    toast.success('Day removed');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      toast.loading('Saving itinerary...', { id: 'save-itinerary' });

      // Convert itinerary days to database format
      const itineraryDaysPayload = form.itinerary_days.map((day, index) => ({
        day_number: day.day || index + 1,
        title: day.title,
        date: day.date,
        subtitle: day.activity,
        night_location: day.night,
        description: day.description,
        image_url: day.image_url,
        images: day.images || [], // Add images array
        highlights: day.highlights || [],
        breakfast: day.meals?.includes('Breakfast') || day.meals?.includes('breakfast') ? true : false,
        lunch: day.meals?.includes('Lunch') || day.meals?.includes('lunch') ? true : false,
        dinner: day.meals?.includes('Dinner') || day.meals?.includes('dinner') ? true : false,
      }));

      // Generate slug if not provided
      let slug = form.slug;
      if (!slug && form.title) {
        slug = form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 100);
      }

      // Build pricing object to match database structure
      const pricing = {
        items: (Array.isArray(form.price_inclusions) ? form.price_inclusions : []).map(item => ({
          label: item.title,
          amount: "",
          description: item.description
        })),
        total: form.total_price.toString(),
        symbol: form.currency === 'INR' ? '₹' : form.currency === 'USD' ? '$' : '€',
        currency: form.currency || 'INR',
        exclusions: [],
        inclusions: Array.isArray(form.inclusions_list) ? form.inclusions_list : [],
        total_label: "Total Package Price"
      };

      // Build terms object (flat structure, not array)
      const terms: Record<string, string> = {};
      if (Array.isArray(form.terms)) {
        form.terms.forEach(term => {
          const key = term.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
          terms[key] = term.content;
        });
      }

      // Build checklist object (category arrays, not array of objects)
      const checklist: Record<string, string[]> = {};
      if (Array.isArray(form.packing_checklist)) {
        form.packing_checklist.forEach(cat => {
          const key = cat.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
          checklist[key] = cat.items;
        });
      }

      const payload = {
        title: form.title,
        subtitle: form.subtitle || null,
        logo: null,
        guest_names: form.guest_name,
        no_of_pax: 2,
        entry_point: "Paro Airport",
        exit_point: "Paro Airport",
        start_date: form.start_date,
        end_date: form.end_date,
        cover_image: form.cover_image_url || null,
        letter_date: form.letter_date || null,
        letter_salutation: form.letter_salutation || null,
        letter_body: form.letter_body, // Already an array, don't stringify
        letter_signature_name: form.letter_signature_name || null,
        letter_signature_title: form.letter_signature_title || null,
        pricing: pricing,
        terms: terms,
        checklist: checklist,
        status: form.status,
        back_cover: null,
        header_footer: null,
      };

      const response = await fetch(`/api/admin/itineraries/${itineraryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Itinerary saved successfully!', { id: 'save-itinerary' });
        setTimeout(() => {
          router.push(`/admin/itineraries/${itineraryId}`);
        }, 1000);
      } else {
        const error = await response.json();
        console.error('Server error response:', error);
        toast.error(
          error.error || 'Failed to save itinerary',
          { id: 'save-itinerary', duration: 5000 }
        );
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary', { id: 'save-itinerary' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/html`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate HTML');
      }
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview failed:', error);
      alert(`Failed to preview HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownload = async () => {
    if (!itineraryId) {
      alert('Please save the itinerary first before downloading.');
      return;
    }
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/html`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate HTML');
      }
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary-${form.title.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStatusChange = async (newStatus: 'draft' | 'final' | 'cancelled') => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('itineraries')
        .update({ status: newStatus })
        .eq('id', itineraryId);

      if (error) throw error;

      setForm({ ...form, status: newStatus });
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'days' | 'pricing' | 'terms' | 'checklist'>('basics');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl -z-10 rounded-2xl border border-gray-200/50 dark:border-gray-700/50" />

        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/itineraries/${itineraryId}`}
                className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" strokeWidth={1.5} />
              </Link>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    {form.title}
                  </h1>
                  {form.status && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${
                      form.status === 'draft'
                        ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : form.status === 'final'
                        ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100/80 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {form.status === 'draft' ? 'Draft' : form.status === 'final' ? 'Final' : form.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  Edit itinerary
                </p>
              </div>
            </div>

            {/* Right Section - Action Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 text-xs font-medium"
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Preview</span>
              </button>
              <button
                onClick={handleDownload}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Export</span>
              </button>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <button
                onClick={handleSave}
                disabled={saving}
                className="group inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-150 shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Tabs */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-1">
        <nav className="flex gap-1">
          {[
            { id: 'basics' as const, label: 'Basics', icon: null },
            { id: 'letter' as const, label: 'Letter', icon: null },
            { id: 'days' as const, label: 'Days', icon: Calendar },
            { id: 'pricing' as const, label: 'Pricing', icon: Save },
            { id: 'terms' as const, label: 'Terms', icon: null },
            { id: 'checklist' as const, label: 'Checklist', icon: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'basics' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Auto-generated from title"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle || ''}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="A Journey to the Land of Happiness"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest Name *</label>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destinations</label>
                <input
                  type="text"
                  value={form.destinations?.join(', ') || ''}
                  onChange={(e) => setForm({ ...form, destinations: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Thimphu, Punakha, Paro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Days) *</label>
                <input
                  type="number"
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Nights) *</label>
                <input
                  type="number"
                  value={form.duration_nights}
                  onChange={(e) => setForm({ ...form, duration_nights: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
              <CloudinaryUpload
                onUploadComplete={(url) => setForm({ ...form, cover_image_url: url })}
                onRemove={() => setForm({ ...form, cover_image_url: undefined })}
                value={form.cover_image_url}
                label="Upload Cover Image"
                folder="himalayanmarvel/itineraries"
                aspect="video"
                size="md"
              />
            </div>
          </div>
        )}

        {activeTab === 'letter' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome Letter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="text"
                  value={form.letter_date || ''}
                  onChange={(e) => setForm({ ...form, letter_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="May 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salutation</label>
                <input
                  type="text"
                  value={form.letter_salutation || ''}
                  onChange={(e) => setForm({ ...form, letter_salutation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Namaste, [Guest Name]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Letter Body (one paragraph per line)</label>
              <textarea
                value={form.letter_body.join('\n')}
                onChange={(e) => setForm({ ...form, letter_body: e.target.value.split('\n') })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Welcome to Bhutan – the Land of Gross National Happiness!&#10;&#10;Your journey begins with..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Signature Name</label>
                <input
                  type="text"
                  value={form.letter_signature_name || ''}
                  onChange={(e) => setForm({ ...form, letter_signature_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Tshering Lhamo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Signature Title</label>
                <input
                  type="text"
                  value={form.letter_signature_title || ''}
                  onChange={(e) => setForm({ ...form, letter_signature_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="COO"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'days' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Day-by-Day Itinerary</h2>
              <button
                onClick={addDay}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-sm shadow-blue-600/20 transition-all duration-200 text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                Add Day
              </button>
            </div>

            {form.itinerary_days.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-400" strokeWidth={1.5} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">No days added yet</p>
                <button
                  onClick={addDay}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-sm shadow-blue-600/20 transition-all duration-200 text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                  Add First Day
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {form.itinerary_days.map((day, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                        Day {day.day}
                      </h3>
                      <button
                        onClick={() => removeDay(index)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Text Fields */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateDay(index, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Day 1: Arrival in Thimphu"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <input
                              type="text"
                              value={day.date}
                              onChange={(e) => updateDay(index, { date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="May 16, 2026"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity</label>
                            <input
                              type="text"
                              value={day.activity || ''}
                              onChange={(e) => updateDay(index, { activity: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Full Day Sightseeing"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Night Stay</label>
                            <input
                              type="text"
                              value={day.night}
                              onChange={(e) => updateDay(index, { night: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Thimphu"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                          <textarea
                            value={day.description}
                            onChange={(e) => updateDay(index, { description: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="Full day exploring Thimphu's cultural treasures..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Highlights (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={day.highlights?.join(', ') || ''}
                              onChange={(e) => updateDay(index, { highlights: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Giant Golden Buddha, Takin Reserve, Simply Bhutan Museum"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Meals (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={day.meals?.join(', ') || ''}
                              onChange={(e) => updateDay(index, { meals: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Breakfast, Lunch, Dinner"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Images */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Images</label>

                        {/* Primary Image Upload */}
                        <CloudinaryUpload
                          onUploadComplete={(url) => updateDay(index, { image_url: url })}
                          onRemove={() => updateDay(index, { image_url: undefined })}
                          value={day.image_url}
                          label="Upload Primary Image"
                          folder="himalayanmarvel/itineraries"
                          aspect="video"
                          size="md"
                          enableBrowse={true}
                        />

                        {/* Image URL Input */}
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Or paste image URL:</label>
                          <input
                            type="url"
                            value={day.image_url || ''}
                            onChange={(e) => updateDay(index, { image_url: e.target.value || undefined })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        {/* Add More Images Upload */}
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Add More Images</label>
                          <CloudinaryUpload
                            onUploadComplete={(url) => addDayImage(index, url)}
                            label="Upload Additional Image"
                            folder="himalayanmarvel/itineraries"
                            aspect="video"
                            size="md"
                            enableBrowse={true}
                          />
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Or paste additional image URL:</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                id={`add-image-url-${index}`}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                                placeholder="https://example.com/image.jpg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`add-image-url-${index}`) as HTMLInputElement;
                                  if (!input) {
                                    toast.error('Input field not found');
                                    return;
                                  }
                                  const url = input.value.trim();
                                  if (!url) {
                                    toast.error('Please enter an image URL');
                                    return;
                                  }
                                  addDayImage(index, url);
                                  input.value = '';
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Gallery Grid */}
                        {day.images && day.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {day.images.map((imageUrl, imageIndex) => (
                              <div key={imageIndex} className="relative group">
                                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 relative">
                                  {imageUrl.includes('res.cloudinary.com') || imageUrl.includes('cloudinary.com') ? (
                                    <Image
                                      src={imageUrl}
                                      alt={`Gallery image ${imageIndex + 1}`}
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={imageUrl}
                                      alt={`Gallery image ${imageIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <button
                                  onClick={() => removeDayImage(index, imageIndex)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  type="button"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Price *</label>
                <input
                  type="number"
                  value={form.total_price}
                  onChange={(e) => setForm({ ...form, total_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                <select
                  value={form.currency || 'INR'}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Package Inclusions (Title - Description pairs, one per line)
              </label>
              <textarea
                value={Array.isArray(form.price_inclusions) ? form.price_inclusions.map(inc => `${inc.title} - ${inc.description}`).join('\n') : ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(l => l.trim());
                  const inclusions = lines.map(line => {
                    const [title, ...descriptionParts] = line.split(' - ');
                    return { title: title.trim(), description: descriptionParts.join(' - ').trim() };
                  });
                  setForm({ ...form, price_inclusions: inclusions });
                }}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Luxury Accommodation - Premium hotels throughout Bhutan&#10;Premium Transport - Toyota Prado or similar SUV&#10;English-Speaking Guide - Licensed guide throughout your journey"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What's Included (one item per line)
              </label>
              <textarea
                value={Array.isArray(form.inclusions_list) ? form.inclusions_list.join('\n') : ''}
                onChange={(e) => setForm({ ...form, inclusions_list: e.target.value.split('\n').filter(s => s.trim()) })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Premium Accommodation (6 nights)&#10;Daily breakfast & dinner&#10;Airport transfers"
              />
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Terms & Conditions</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Terms (Title - Content pairs, one per line)
              </label>
              <textarea
                value={Array.isArray(form.terms) ? form.terms.map(term => `${term.title} - ${term.content}`).join('\n') : ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(l => l.trim());
                  const terms = lines.map(line => {
                    const [title, ...contentParts] = line.split(' - ');
                    return { title: title.trim(), content: contentParts.join(' - ').trim() };
                  });
                  setForm({ ...form, terms });
                }}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Tiger's Nest Trek - The trek is suitable for families with moderate fitness levels...&#10;Travel Documents - Valid passports (minimum 6 months validity) are required..."
              />
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Packing Checklist</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checklist (Category: Item1, Item2, Item3 - one category per line)
              </label>
              <textarea
                value={Array.isArray(form.packing_checklist) ? form.packing_checklist.map(cat => `${cat.category}: ${cat.items.join(', ')}`).join('\n') : ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(l => l.trim());
                  const checklist = lines.map(line => {
                    const [category, ...itemsParts] = line.split(':');
                    const items = itemsParts.join(':').split(',').map(s => s.trim()).filter(s => s);
                    return { category: category.trim(), items };
                  });
                  setForm({ ...form, packing_checklist: checklist });
                }}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Essential Documents: Valid Passports, Voter ID, Travel insurance, Flight tickets&#10;Trekking Essentials: Sturdy hiking shoes, Comfortable socks, Light backpack, Water bottle&#10;Clothing: Comfortable walking shoes, Light woolens, Windproof jacket"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
