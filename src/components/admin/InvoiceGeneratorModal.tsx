'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share2, Loader2, FileText, IndianRupee, Calendar, Users, MapPin, Sparkles, Eye } from 'lucide-react';
import { generateItineraryInvoiceHTML, generateInvoiceDataFromItinerary, ItineraryInvoiceData } from '@/lib/templates/invoice-html-generator';

interface InvoiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: any;
}

export function InvoiceGeneratorModal({ isOpen, onClose, itinerary }: InvoiceGeneratorModalProps) {
  const [invoiceData, setInvoiceData] = useState<ItineraryInvoiceData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    if (isOpen && itinerary) {
      // Generate invoice number (you may want to fetch the next invoice number from server)
      const year = new Date().getFullYear();
      const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const invoiceNumber = `BSP/${year}/${randomId}`;

      // Generate invoice data from itinerary
      generateInvoiceDataFromItinerary(itinerary, invoiceNumber).then((data) => {
        // Override with custom company info if needed
        setInvoiceData({
          ...data,
          qr_code_url: '/bsptours_QR.jpeg', // Default QR code path
        });
      });
    }
  }, [isOpen, itinerary]);

  useEffect(() => {
    if (!previewMode || !invoiceData) {
      setPreviewHtml('');
      setPreviewLoading(false);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    generateItineraryInvoiceHTML(invoiceData)
      .then((html) => {
        if (!cancelled) setPreviewHtml(html);
      })
      .catch((error) => {
        console.error('Failed to generate preview:', error);
        if (!cancelled) setPreviewHtml('');
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [previewMode, invoiceData]);

  const handleFieldChange = (field: keyof ItineraryInvoiceData, value: any) => {
    if (invoiceData) {
      setInvoiceData({ ...invoiceData, [field]: value });
    }
  };

  const handleDownloadHTML = async () => {
    if (!invoiceData) return;

    setGenerating(true);
    try {
      const html = await generateItineraryInvoiceHTML(invoiceData);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoice_number.replace(/\//g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateShareLink = async () => {
    if (!invoiceData) return;

    setGeneratingLink(true);
    try {
      // TODO: Implement this - store invoice and generate shareable token
      // For now, show a placeholder
      const response = await fetch('/api/invoices/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary_id: itinerary.id,
          invoice_data: invoiceData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShareLink(result.share_url);
        // Copy to clipboard
        await navigator.clipboard.writeText(result.share_url);
        alert('Share link copied to clipboard!');
      } else {
        throw new Error('Failed to generate share link');
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
      alert('Failed to generate share link. Please try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const calculateDuration = () => {
    if (!itinerary.start_date || !itinerary.end_date) return '';
    const start = new Date(itinerary.start_date);
    const end = new Date(itinerary.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} Days / ${days - 1} Nights`;
  };

  if (!isOpen || !invoiceData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Generate Invoice</h2>
              <p className="text-sm text-gray-500">Create and share invoice for this itinerary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <Users className="w-3 h-3" />
                Guest
              </div>
              <p className="font-semibold text-gray-900">{invoiceData.guest_name}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                Duration
              </div>
              <p className="font-semibold text-gray-900">{invoiceData.package_duration || calculateDuration()}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <IndianRupee className="w-3 h-3" />
                Total
              </div>
              <p className="font-semibold text-gray-900">{invoiceData.currency_symbol} {invoiceData.total_amount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                Status
              </div>
              <p className="font-semibold text-gray-900 capitalize">{itinerary.status}</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Invoice Details
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceData.invoice_number}
                  onChange={(e) => handleFieldChange('invoice_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Invoice Date</label>
                <input
                  type="text"
                  value={invoiceData.invoice_date}
                  onChange={(e) => handleFieldChange('invoice_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={invoiceData.guest_name}
                  onChange={(e) => handleFieldChange('guest_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  value={invoiceData.package_name}
                  onChange={(e) => handleFieldChange('package_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Travel Dates</label>
                <input
                  type="text"
                  value={invoiceData.travel_dates || ''}
                  onChange={(e) => handleFieldChange('travel_dates', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., May 16 - May 22, 2026"
                />
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-600" />
                Pricing Details
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={invoiceData.currency}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  value={invoiceData.total_amount}
                  onChange={(e) => handleFieldChange('total_amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Advance Payment</label>
                <input
                  type="number"
                  value={invoiceData.advance_payment}
                  onChange={(e) => handleFieldChange('advance_payment', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {invoiceData.balance_due !== undefined && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Balance Due</label>
                  <input
                    type="number"
                    value={invoiceData.balance_due}
                    onChange={(e) => handleFieldChange('balance_due', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Due Date (optional)</label>
                <input
                  type="text"
                  value={invoiceData.payment_due_date || ''}
                  onChange={(e) => handleFieldChange('payment_due_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 30 days before travel"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea
              value={invoiceData.booking_payment || ''}
              onChange={(e) => handleFieldChange('booking_payment', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Payment terms and conditions..."
            />
          </div>

          {/* Preview Toggle */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Invoice' : 'Preview Invoice'}
            </button>
          </div>

          {/* Preview */}
          {previewMode && (
            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Invoice Preview</h4>
                <button
                  onClick={handleDownloadHTML}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download HTML
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-auto max-h-96">
                {previewLoading ? (
                  <div className="text-sm text-gray-500">Generating preview…</div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: previewHtml,
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleDownloadHTML}
            disabled={generating}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download HTML
          </button>
          <button
            onClick={handleGenerateShareLink}
            disabled={generatingLink}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {generatingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Generate Share Link
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
