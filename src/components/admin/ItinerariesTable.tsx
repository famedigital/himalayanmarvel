'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Eye, Download, Loader2, Copy, Receipt } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirm } from './DeleteConfirm';
import { ItineraryTableRowActions } from './ItineraryTableRowActions';
import type { ItineraryDay } from '@/lib/supabase/itinerary-types';
import { formatDateCondensed } from '@/lib/utils';

interface Itinerary {
  id: string;
  title: string;
  guest_names: string;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'final';
  created_at: string;
  itinerary_days?: { count: number }[];
}

interface Booking {
  id: string;
  itinerary_id: string;
  status: string;
  travel_date?: string;
}

interface Invoice {
  id: string;
  itinerary_id: string;
  status: string;
  payment_amount?: number;
  invoice_data?: {
    total_amount?: number;
    currency_symbol?: string;
  };
}

interface ItinerariesTableProps {
  itineraries: Itinerary[];
  bookings?: Booking[];
  invoices?: Invoice[];
}

export function ItinerariesTable({ itineraries, bookings = [], invoices = [] }: ItinerariesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [items, setItems] = useState(itineraries);

  const deletingItem = items.find(i => i.id === deleteId);

  // Helper function to get booking for an itinerary
  const getBookingForItinerary = (itineraryId: string) => {
    return bookings.find(b => b.itinerary_id === itineraryId);
  };

  // Helper function to get invoice for an itinerary
  const getInvoiceForItinerary = (itineraryId: string) => {
    return invoices.find(inv => inv.itinerary_id === itineraryId);
  };

  // Helper function to get intelligent status
  const getIntelligentStatus = (itinerary: Itinerary) => {
    const booking = getBookingForItinerary(itinerary.id);
    const invoice = getInvoiceForItinerary(itinerary.id);

    if (booking && booking.travel_date) {
      const travelDate = new Date(booking.travel_date);
      const today = new Date();
      const daysUntil = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 7) {
        return { status: 'departing-soon', label: `Departing in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`, color: 'red' };
      } else if (daysUntil <= 30) {
        return { status: 'upcoming', label: `Upcoming (${daysUntil} days)`, color: 'orange' };
      }
    }

    if (invoice && invoice.status !== 'paid') {
      return { status: 'payment-pending', label: 'Payment Pending', color: 'amber' };
    }

    if (booking) {
      return { status: 'confirmed', label: 'Confirmed', color: 'green' };
    }

    if (invoice) {
      return { status: 'invoiced', label: 'Invoiced', color: 'blue' };
    }

    if (itinerary.status === 'final') {
      return { status: 'final', label: 'Final', color: 'purple' };
    }

    return { status: 'draft', label: 'Draft', color: 'gray' };
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setItems(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setDuplicating(id);
    try {
      const supabase = createClient();

      // Get full itinerary with days and section openers
      const { data: itinerary, error: fetchError } = await supabase
        .from('itineraries')
        .select('*, itinerary_days(*), itinerary_section_openers(*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create new itinerary (copy without id)
      const { data: newItinerary, error: insertError } = await supabase
        .from('itineraries')
        .insert({
          title: `${itinerary.title} (Copy)`,
          subtitle: itinerary.subtitle,
          logo: itinerary.logo,
          guest_names: itinerary.guest_names,
          start_date: itinerary.start_date,
          end_date: itinerary.end_date,
          cover_image: itinerary.cover_image,
          letter_date: itinerary.letter_date,
          letter_salutation: itinerary.letter_salutation,
          letter_body: itinerary.letter_body,
          letter_signature_name: itinerary.letter_signature_name,
          letter_signature_title: itinerary.letter_signature_title,
          status: 'draft',
          pricing: itinerary.pricing,
          terms: itinerary.terms,
          checklist: itinerary.checklist
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Copy days
      if (itinerary.itinerary_days && itinerary.itinerary_days.length > 0) {
        const daysToInsert = itinerary.itinerary_days.map((day: any) => ({
          itinerary_id: newItinerary.id,
          day_number: day.day_number,
          title: day.title,
          subtitle: day.subtitle,
          altitude: day.altitude,
          distance: day.distance,
          duration: day.duration,
          high_point: day.high_point,
          night_location: day.night_location,
          description: day.description,
          drop_cap: day.drop_cap,
          breakfast: day.breakfast,
          lunch: day.lunch,
          dinner: day.dinner,
          snacks: day.snacks,
          weather_text: day.weather_text,
          temperature: day.temperature,
          image_url: day.image_url,
          image_alt: day.image_alt,
          highlights: day.highlights,
          pull_quote: day.pull_quote,
          special_boxes: day.special_boxes
        }));

        await supabase.from('itinerary_days').insert(daysToInsert);
      }

      // Copy section openers
      if (itinerary.itinerary_section_openers && itinerary.itinerary_section_openers.length > 0) {
        const openersToInsert = itinerary.itinerary_section_openers.map((opener: any) => ({
          itinerary_id: newItinerary.id,
          section_number: opener.section_number,
          title: opener.title,
          subtitle: opener.subtitle,
          background_image: opener.background_image,
          overlay_color: opener.overlay_color,
          page_number: opener.page_number
        }));

        await supabase.from('itinerary_section_openers').insert(openersToInsert);
      }

      // Refresh list
      const { data: updated } = await supabase
        .from('itineraries')
        .select('*, itinerary_days(count)')
        .order('created_at', { ascending: false });

      setItems(updated || []);
    } catch (error) {
      console.error('Duplicate failed:', error);
      alert('Failed to duplicate. Please try again.');
    } finally {
      setDuplicating(null);
    }
  };

  const handlePreviewHTML = async (id: string) => {
    try {
      console.log('[ItinerariesTable] Previewing HTML for itinerary:', id);
      const response = await fetch(`/api/itineraries/${id}/html`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[ItinerariesTable] Server error:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to generate HTML');
      }

      const html = await response.text();
      console.log('[ItinerariesTable] HTML generated, length:', html.length);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('[ItinerariesTable] Preview failed:', error);
      alert(`Failed to preview HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGenerateHTML = async (id: string) => {
    setGenerating(id);
    try {
      const response = await fetch(`/api/itineraries/${id}/html`);
      if (!response.ok) throw new Error('Failed to generate HTML');

      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary-${id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate HTML. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
          <FileText className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-stone-700 mb-2">No itineraries yet</h3>
        <p className="text-stone-500 tracking-wide">Create your first custom guest itinerary</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Itinerary</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Guest(s)</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Dates</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Days</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Created</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itinerary, index) => (
              <tr
                key={itinerary.id}
                className={`transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                } hover:bg-muted/40`}
              >
                <td className="py-3 px-4">
                  <div>
                    <Link href={`/admin/itineraries/${itinerary.id}`} className="font-medium text-sm text-foreground truncate max-w-[200px] hover:text-amber-600 transition-colors">
                      {itinerary.title}
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                      {itinerary.itinerary_days?.[0]?.count || 0} Days • Private Tour
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{itinerary.guest_names}</td>
                <td className="py-3 px-4">
                  {itinerary.start_date && itinerary.end_date ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xs text-foreground tabular-nums">{formatDateCondensed(itinerary.start_date)}</span>
                      <span className="text-muted-foreground">—</span>
                      <span className="font-mono text-xs text-foreground tabular-nums">{formatDateCondensed(itinerary.end_date)}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">{new Date(itinerary.start_date).getFullYear()}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <span className="text-muted-foreground text-xs">{itinerary.itinerary_days?.[0]?.count || 0} days</span>
                </td>
                <td className="py-3 px-4">
                  {(() => {
                    const statusInfo = getIntelligentStatus(itinerary);
                    const colorClasses = {
                      red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800',
                      orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800',
                      amber: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800',
                      green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800',
                      blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800',
                      purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800',
                      gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    };
                    return (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase border ${colorClasses[statusInfo.color as keyof typeof colorClasses]}`}>
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {new Date(itinerary.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="py-3 px-4">
                  <ItineraryTableRowActions
                    id={itinerary.id}
                    title={itinerary.title}
                    viewHref={`/admin/itineraries/${itinerary.id}`}
                    editHref={`/admin/itineraries/${itinerary.id}`}
                    invoiceHref={`/admin/invoices/new/${itinerary.id}`}
                    onPreview={() => handlePreviewHTML(itinerary.id)}
                    onDownload={() => handleGenerateHTML(itinerary.id)}
                    onDuplicate={() => handleDuplicate(itinerary.id)}
                    onDelete={() => setDeleteId(itinerary.id)}
                    isDuplicating={duplicating === itinerary.id}
                    isGenerating={generating === itinerary.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && deletingItem && (
        <DeleteConfirm
          itemName={deletingItem.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
