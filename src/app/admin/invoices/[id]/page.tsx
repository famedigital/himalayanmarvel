/**
 * Admin Invoice Edit/Create Page
 * Form for creating and editing invoices
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { generateInvoiceHTML } from '@/lib/templates/invoice-template';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

interface InvoiceData {
  id?: string;
  invoice_number?: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  package_name: string;
  package_duration?: string;
  travel_dates?: string;
  destination?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  advance_payment: number;
  balance_due: number;
  payment_status: string;
  payment_method?: string;
  payment_due_date?: string;
  qr_code_url?: string;
  terms?: string;
  status: string;
  notes?: string;
  internal_notes?: string;
}

export default function InvoiceFormPage({ params }: { params: { id?: string[] } }) {
  const router = useRouter();
  const isNew = params.id?.[0] === 'new' || !params.id;
  const invoiceId = isNew ? undefined : params.id?.[0];

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData>({
    guest_name: '',
    package_name: '',
    package_duration: '',
    travel_dates: '',
    destination: 'Bhutan',
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    advance_payment: 0,
    balance_due: 0,
    payment_status: 'pending',
    status: 'draft',
  });

  useEffect(() => {
    if (!isNew && invoiceId) {
      fetchInvoice(invoiceId);
    } else {
      // Auto-generate invoice number for new invoices
      generateInvoiceNumber();
    }
  }, [isNew, invoiceId]);

  const fetchInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`);
      const result = await response.json();

      if (result.success) {
        setInvoice(result.data);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = async () => {
    try {
      const year = new Date().getFullYear();
      const response = await fetch(`/api/admin/invoices/generate-number?year=${year}`);
      if (response.ok) {
        const result = await response.json();
        setInvoice(prev => ({ ...prev, invoice_number: result.invoice_number }));
      }
    } catch (error) {
      // Fallback to simple format
      const year = new Date().getFullYear();
      const invoiceNum = `HMM/${year}/0001`;
      setInvoice(prev => ({ ...prev, invoice_number: invoiceNum }));
    }
  };

  const calculateTotals = () => {
    const subtotal = invoice.subtotal || 0;
    const tax = invoice.tax_amount || 0;
    const discount = invoice.discount_amount || 0;
    const total = subtotal + tax - discount;
    const advance = invoice.advance_payment || 0;
    const balance = total - advance;

    setInvoice(prev => ({
      ...prev,
      total_amount: total,
      balance_due: balance > 0 ? balance : 0,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Generate HTML template
      const invoiceTemplate = await generateInvoiceHTML({
        invoice_number: invoice.invoice_number || '',
        guest_name: invoice.guest_name,
        guest_email: invoice.guest_email,
        guest_phone: invoice.guest_phone,
        package_name: invoice.package_name,
        package_duration: invoice.package_duration,
        travel_dates: invoice.travel_dates,
        destination: invoice.destination,
        subtotal: invoice.subtotal,
        tax_amount: invoice.tax_amount,
        discount_amount: invoice.discount_amount,
        total_amount: invoice.total_amount,
        advance_payment: invoice.advance_payment,
        balance_due: invoice.balance_due,
        payment_due_date: invoice.payment_due_date,
        qr_code_url: invoice.qr_code_url,
        terms: invoice.terms,
      });

      const payload = {
        ...invoice,
        invoice_template: invoiceTemplate,
      };

      const url = isNew ? '/api/admin/invoices' : `/api/admin/invoices/${invoiceId}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/admin/invoices/${result.data.id || invoiceId}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      // Ensure invoice_number is set for preview
      const invoiceForPreview = {
        ...invoice,
        invoice_number: invoice.invoice_number || 'DRAFT',
      };
      const html = await generateInvoiceHTML(invoiceForPreview);
      setPreviewHtml(html);
      setPreviewMode(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPreviewMode(false)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        {loadingPreview ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: previewHtml
            }}
            className="bg-white p-8 rounded-lg shadow"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isNew ? 'Create New Invoice' : `Edit Invoice ${invoice.invoice_number}`}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isNew ? 'Create a new invoice for your guest' : 'Update invoice details'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            disabled={loadingPreview}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Guest Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={invoice.guest_name}
                  onChange={(e) => setInvoice({ ...invoice, guest_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={invoice.guest_email || ''}
                  onChange={(e) => setInvoice({ ...invoice, guest_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={invoice.guest_phone || ''}
                  onChange={(e) => setInvoice({ ...invoice, guest_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Package Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={invoice.package_name}
                  onChange={(e) => setInvoice({ ...invoice, package_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={invoice.package_duration || ''}
                  onChange={(e) => setInvoice({ ...invoice, package_duration: e.target.value })}
                  placeholder="e.g., 7 Days / 6 Nights"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Travel Dates
                </label>
                <input
                  type="text"
                  value={invoice.travel_dates || ''}
                  onChange={(e) => setInvoice({ ...invoice, travel_dates: e.target.value })}
                  placeholder="e.g., May 16-22, 2026"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={invoice.destination || ''}
                  onChange={(e) => setInvoice({ ...invoice, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pricing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subtotal (₹)
                </label>
                <input
                  type="number"
                  value={invoice.subtotal}
                  onChange={(e) => {
                    setInvoice({ ...invoice, subtotal: parseFloat(e.target.value) || 0 });
                    calculateTotals();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Amount (₹)
                </label>
                <input
                  type="number"
                  value={invoice.tax_amount}
                  onChange={(e) => {
                    setInvoice({ ...invoice, tax_amount: parseFloat(e.target.value) || 0 });
                    calculateTotals();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  value={invoice.discount_amount}
                  onChange={(e) => {
                    setInvoice({ ...invoice, discount_amount: parseFloat(e.target.value) || 0 });
                    calculateTotals();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Advance Payment (₹)
                </label>
                <input
                  type="number"
                  value={invoice.advance_payment}
                  onChange={(e) => {
                    setInvoice({ ...invoice, advance_payment: parseFloat(e.target.value) || 0 });
                    calculateTotals();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Calculated Totals */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{invoice.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance Due:</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{invoice.balance_due.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Terms & Conditions
            </h2>
            <textarea
              value={invoice.terms || ''}
              onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter terms and conditions..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invoice Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoice_number || ''}
                  onChange={(e) => setInvoice({ ...invoice, invoice_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={invoice.status}
                  onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={invoice.payment_status}
                  onChange={(e) => setInvoice({ ...invoice, payment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={invoice.payment_method || ''}
                  onChange={(e) => setInvoice({ ...invoice, payment_method: e.target.value })}
                  placeholder="e.g., Bank Transfer, G-Pay"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={invoice.payment_due_date || ''}
                  onChange={(e) => setInvoice({ ...invoice, payment_due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              QR Code for Payment
            </h2>
            <div className="flex justify-center">
              <CloudinaryUpload
                onUploadComplete={(url) => setInvoice({ ...invoice, qr_code_url: url })}
                onRemove={() => setInvoice({ ...invoice, qr_code_url: undefined })}
                value={invoice.qr_code_url}
                label="Upload QR Code"
                folder="himalayanmarvel/qr-codes"
                aspect="square"
                size="sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notes
            </h2>
            <textarea
              value={invoice.notes || ''}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              placeholder="Notes for guest..."
            />
            <textarea
              value={invoice.internal_notes || ''}
              onChange={(e) => setInvoice({ ...invoice, internal_notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm mt-2"
              placeholder="Internal notes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
