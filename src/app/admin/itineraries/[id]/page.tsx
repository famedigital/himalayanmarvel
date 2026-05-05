/**
 * Admin Itinerary Edit/Create Page
 * Form for creating and editing tour itineraries
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Plus, Trash2, Loader2, Calendar, Users, CheckCircle, XCircle, Receipt, Download, User, Car, Hotel, IdCard, FileText, LayoutDashboard, Settings, Briefcase } from 'lucide-react';
import { generateItineraryHTML, ItineraryData, ItineraryDay } from '@/lib/templates/itinerary-template';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { InvoiceGeneratorModal } from '@/components/admin/InvoiceGeneratorModal';
import { ItineraryInvoiceManager } from '@/components/admin/ItineraryInvoiceManager';
import { OperationsAssignmentPanel } from '@/components/admin/OperationsAssignmentPanel';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function ItineraryFormPage({ params }: { params?: Promise<{ id?: string | string[] }> }) {
  const router = useRouter();
  const resolvedParams = use(params ?? Promise.resolve<{ id?: string | string[] }>({}));
  const rawId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  const isNew = rawId === 'new' || !rawId;
  const itineraryId = isNew ? undefined : rawId;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'days' | 'pricing' | 'terms' | 'checklist' | 'operations'>('basics');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [fullItinerary, setFullItinerary] = useState<any>(null);
  const [form, setForm] = useState<ItineraryForm>({
    title: '',
    guest_name: '',
    duration_days: 7,
    duration_nights: 6,
    start_date: '',
    end_date: '',
    letter_body: [''],
    itinerary_days: [],
    total_price: 0,
    status: 'draft',
    is_published: false,
  });

  useEffect(() => {
    if (!isNew && itineraryId) {
      fetchItinerary(itineraryId);
    }
  }, [isNew, itineraryId]);

  // Auto-generate slug from title for new itineraries
  useEffect(() => {
    if (isNew && form.title && !form.slug) {
      const generatedSlug = form.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [isNew, form.title, form.slug]);

  const fetchItinerary = async (id: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFullItinerary(data);
      setForm({
        ...data,
        letter_body: Array.isArray(data.letter_body)
          ? data.letter_body
          : (typeof data.letter_body === 'string' ? [data.letter_body] : ['']),
        itinerary_days: data.itinerary_days || [],
        price_inclusions: typeof data.price_inclusions === 'string'
          ? (() => { try { return JSON.parse(data.price_inclusions); } catch { return undefined; } })()
          : data.price_inclusions,
        inclusions_list: typeof data.inclusions_list === 'string'
          ? (() => { try { return JSON.parse(data.inclusions_list); } catch { return undefined; } })()
          : data.inclusions_list,
        terms: typeof data.terms_conditions === 'string'
          ? (() => { try { return JSON.parse(data.terms_conditions); } catch { return undefined; } })()
          : data.terms_conditions,
        packing_checklist: typeof data.packing_checklist === 'string'
          ? (() => { try { return JSON.parse(data.packing_checklist); } catch { return undefined; } })()
          : data.packing_checklist,
      });
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

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
          schedule: [],
          highlights: [],
          meals: [],
        },
      ],
    });
    setActiveTab('days');
  };

  const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
    const newDays = [...form.itinerary_days];
    newDays[index] = { ...newDays[index], ...updates };
    setForm({ ...form, itinerary_days: newDays });
  };

  const removeDay = (index: number) => {
    if (!confirm('Remove this day?')) return;
    const newDays = form.itinerary_days.filter((_, i) => i !== index);
    setForm({ ...form, itinerary_days: newDays });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Generate HTML template
      const itineraryTemplate = generateItineraryHTML({
        title: form.title,
        subtitle: form.subtitle,
        guest_name: form.guest_name,
        duration_days: form.duration_days,
        duration_nights: form.duration_nights,
        start_date: form.start_date,
        end_date: form.end_date,
        destinations: form.destinations,
        cover_image_url: form.cover_image_url,
        letter_date: form.letter_date,
        letter_salutation: form.letter_salutation,
        letter_body: form.letter_body,
        letter_signature_name: form.letter_signature_name,
        letter_signature_title: form.letter_signature_title,
        days: form.itinerary_days,
        total_price: form.total_price,
        currency: form.currency,
        price_inclusions: form.price_inclusions,
        inclusions_list: form.inclusions_list,
        terms: form.terms,
        packing_checklist: form.packing_checklist,
        contact_phone: form.contact_phone,
        contact_email: form.contact_email,
        contact_website: form.contact_website,
      });

      // Generate slug if not provided
      let slug = form.slug;
      if (!slug && form.title) {
        slug = form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 100);
      }

      const payload = {
        ...form,
        slug,
        itinerary_template: itineraryTemplate,
        letter_body: JSON.stringify(form.letter_body),
        price_inclusions: form.price_inclusions ? JSON.stringify(form.price_inclusions) : null,
        inclusions_list: form.inclusions_list ? JSON.stringify(form.inclusions_list) : null,
        terms_conditions: form.terms ? JSON.stringify(form.terms) : null,
        packing_checklist: form.packing_checklist ? JSON.stringify(form.packing_checklist) : null,
      };

      const url = isNew ? '/admin/api/itineraries' : `/admin/api/itineraries/${itineraryId}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/admin/itineraries/${result.data.id || itineraryId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save itinerary');
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!itineraryId) {
      alert('Please save the itinerary first before previewing.');
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
    if (!itineraryId) return;

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

  // Tabs
  const tabs = [
    { id: 'basics' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'letter' as const, label: 'Letter', icon: FileText },
    { id: 'days' as const, label: 'Days', icon: Calendar },
    { id: 'pricing' as const, label: 'Pricing', icon: Save },
    { id: 'terms' as const, label: 'Terms', icon: FileText },
    { id: 'checklist' as const, label: 'Checklist', icon: FileText },
    { id: 'operations' as const, label: 'Operations', icon: Briefcase },
    { id: 'invoices' as const, label: 'Invoices', icon: Receipt },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/itineraries"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 transition-all duration-200 border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={2} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent bg-[length:var(--tw-gradient-to-r)] from-0% via-50% to-100% bg-[length:var(--tw-from-pos)] bg-[length:var(--tw-to-pos)]">
              {isNew ? 'Create New Itinerary' : form.title}
            </h1>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
              {isNew ? 'Craft a new tour itinerary' : 'Manage your itinerary'}
              {form.status && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  form.status === 'draft'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800'
                    : form.status === 'final'
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800'
                    : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {form.status === 'draft' ? 'Draft' : form.status === 'final' ? 'Final' : form.status}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <>
              {/* Status Actions */}
              {form.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('final')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 font-semibold"
                  title="Mark as accepted by client"
                >
                  <CheckCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Accept</span>
                </button>
              )}
              {(form.status === 'draft' || form.status === 'final') && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-500/30 font-semibold"
                  title="Cancel this itinerary"
                >
                  <XCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Cancel</span>
                </button>
              )}
              {/* Invoice Button */}
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/30 font-semibold"
                title="Generate invoice for this itinerary"
              >
                <Receipt className="w-4 h-4" strokeWidth={2} />
                <span>Generate Invoice</span>
              </button>
            </>
          )}
          <button
            onClick={handlePreview}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold shadow-sm"
          >
            <Eye className="w-4 h-4" strokeWidth={2} />
            <span>Preview</span>
          </button>
          <button
            onClick={handleDownload}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold shadow-sm"
          >
            <Download className="w-4 h-4" strokeWidth={2} />
            <span>Download</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-600/30 font-semibold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={2} />}
            {saving ? <span>Saving...</span> : <span>Save Itinerary</span>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Day
              </button>
            </div>

            {form.itinerary_days.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No days added yet</p>
                <button
                  onClick={addDay}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
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
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => updateDay(index, { description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        placeholder="Full day exploring Thimphu's cultural treasures..."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Day Image</label>
                      <CloudinaryUpload
                        onUploadComplete={(url) => updateDay(index, { image_url: url })}
                        onRemove={() => updateDay(index, { image_url: undefined })}
                        value={day.image_url}
                        label="Upload Day Image"
                        folder="himalayanmarvel/itineraries"
                        aspect="video"
                        size="md"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                value={form.price_inclusions?.map(inc => `${inc.title} - ${inc.description}`).join('\n') || ''}
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
                value={form.inclusions_list?.join('\n') || ''}
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
                value={form.terms?.map(term => `${term.title} - ${term.content}`).join('\n') || ''}
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
                value={form.packing_checklist?.map(cat => `${cat.category}: ${cat.items.join(', ')}`).join('\n') || ''}
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

        {activeTab === 'operations' && (
          <OperationsTabContent itineraryId={itineraryId} guestName={form.guest_name} />
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoices & Payments</h2>
            <ItineraryInvoiceManager
              itineraryId={itineraryId}
              itinerary={form}
            />
          </div>
        )}
      </div>

      {/* Status & Publish */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish</label>
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-900 dark:text-white">Published</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && fullItinerary && (
        <InvoiceGeneratorModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          itinerary={fullItinerary}
        />
      )}
    </div>
  );
}

// Operations Tab Component
function OperationsTabContent({ itineraryId, guestName }: { itineraryId?: string; guestName: string }) {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (itineraryId) {
      checkForBooking();
    }
  }, [itineraryId]);

  const checkForBooking = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .single();

      setBooking(data);
    } catch (error) {
      console.error('Error checking for booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Receipt className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Create Booking First
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Generate an invoice to create a confirmed booking for {guestName}
        </p>
        <button
          onClick={() => {
            if (itineraryId) {
              window.location.href = `/admin/itineraries/${itineraryId}`;
            }
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          <Receipt className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <Receipt className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Confirmed Booking for {guestName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
          Status: <span className="font-semibold text-green-700 dark:text-green-400">{booking.status}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Travel Date: {booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : 'TBD'}
        </p>
        <Link
          href={`/admin/operations/${booking.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold mt-4"
        >
          Manage Operations
          <Receipt className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <User className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Guides</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {booking.guide_details ? 'Assigned' : 'Not assigned'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <Car className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Transport</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {booking.car_details ? 'Assigned' : 'Not assigned'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <Hotel className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Hotels</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {booking.hotel_details ? 'Booked' : 'Not booked'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <IdCard className="w-8 h-8 text-orange-600 mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Passports</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Track documents
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <FileText className="w-8 h-8 text-red-600 mb-3" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Permits</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Track applications
          </p>
        </div>
      </div>
    </div>
  );
}
