'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, IndianRupee, FileText, Download, Edit, Check, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface OverviewTabProps {
  itineraryId: string;
  itinerary: any;
}

export function OverviewTab({ itineraryId, itinerary }: OverviewTabProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(itinerary?.status || 'draft');
  const [hasBooking, setHasBooking] = useState(false);
  const [hasInvoice, setHasInvoice] = useState(false);

  useEffect(() => {
    checkRelatedData();
  }, [itineraryId]);

  const checkRelatedData = async () => {
    try {
      const supabase = createClient();

      // Check for bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('itinerary_id', itineraryId)
        .single();

      setHasBooking(!!bookings);

      // Check for invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id')
        .eq('itinerary_id', itineraryId)
        .single();

      setHasInvoice(!!invoices);
    } catch (error) {
      console.error('Error checking related data:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('itineraries')
        .update({ status: newStatus })
        .eq('id', itineraryId);

      if (error) throw error;

      setStatus(newStatus);
      alert(`Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = async () => {
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
      a.download = `itinerary-${itinerary?.title?.replace(/\s+/g, '-') || 'itinerary'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTotalPrice = (data: any) => {
    if (data.pricing && typeof data.pricing === 'object' && data.pricing.total) {
      return parseFloat(data.pricing.total.toString()) || 0;
    }
    if (data.total_price) {
      return parseFloat(data.total_price.toString()) || 0;
    }
    return 0;
  };

  const getCurrencySymbol = (data: any) => {
    if (data.pricing && typeof data.pricing === 'object' && data.pricing.currency) {
      return data.pricing.currency === 'USD' ? '$' : data.pricing.currency === 'EUR' ? '€' : '₹';
    }
    if (data.currency) {
      return data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : '₹';
    }
    return '₹';
  };

  const getStatusBadge = () => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      final: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };

    const labels = {
      draft: 'Draft',
      final: 'Final',
      cancelled: 'Cancelled',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || 'Draft'}
      </span>
    );
  };

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Itinerary not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {itinerary.title || 'Untitled Itinerary'}
              </h2>
              {getStatusBadge()}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Created on {new Date(itinerary.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {status === 'draft' && (
              <button
                onClick={() => handleUpdateStatus('final')}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold text-sm"
              >
                <Check className="w-4 h-4" />
                Accept Itinerary
              </button>
            )}
            {status === 'final' && (
              <button
                onClick={() => handleUpdateStatus('draft')}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-semibold text-sm"
              >
                <Clock className="w-4 h-4" />
                Back to Draft
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Itinerary Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Guest Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guest Name</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.guest_name || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Number of Guests</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.num_guests || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.guest_email || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.guest_phone || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Travel Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.start_date ? new Date(itinerary.start_date).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.end_date ? new Date(itinerary.end_date).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {itinerary.destination || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Itinerary Content */}
          {itinerary.itinerary_data && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Itinerary Content
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {typeof itinerary.itinerary_data === 'string'
                    ? itinerary.itinerary_data
                    : JSON.stringify(itinerary.itinerary_data, null, 2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Pricing
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {getCurrencySymbol(itinerary)}{getTotalPrice(itinerary).toLocaleString('en-IN')}
                </span>
              </div>
              {itinerary.price_per_person && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Per Person</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {getCurrencySymbol(itinerary)}{itinerary.price_per_person.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/admin/itineraries/${itineraryId}/edit`}
                className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm text-center justify-center"
              >
                <Edit className="w-4 h-4" />
                Edit Itinerary
              </Link>
              <button
                onClick={handleDownloadHTML}
                className="flex items-center gap-2 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
            </div>
          </div>

          {/* Workflow Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Workflow Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${status === 'draft' || status === 'final' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Draft Itinerary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${status === 'final' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasInvoice ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Invoice Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasBooking ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">Operations Assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
