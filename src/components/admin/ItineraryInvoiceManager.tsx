'use client';

import { useState, useEffect } from 'react';
import { Receipt, CreditCard, Calendar, IndianRupee, Check, Clock, AlertCircle, Plus, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ItineraryInvoiceManagerProps {
  itineraryId: string;
  itinerary: any;
  booking?: any;
}

export function ItineraryInvoiceManager({ itineraryId, itinerary, booking }: ItineraryInvoiceManagerProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<any>(null);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    payment_status: 'pending',
    payment_method: '',
    payment_amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_notes: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, [itineraryId]);

  const fetchInvoices = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('created_at', { ascending: false });

      setInvoices(data || []);
      if (data && data.length > 0) {
        setActiveInvoice(data[0]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!activeInvoice) return;

    setSaving(true);
    try {
      const supabase = createClient();

      // Calculate new payment amount (add to existing)
      const currentPaid = activeInvoice.payment_amount || 0;
      const additionalPayment = parseFloat(paymentForm.payment_amount) || 0;
      const newTotalPaid = currentPaid + additionalPayment;

      // Update invoice_data with payment information (store everything in JSONB)
      const updatedInvoiceData = {
        ...activeInvoice.invoice_data,
        payment_status: paymentForm.payment_status,
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
        payment_notes: paymentForm.payment_notes,
        payment_amount: newTotalPaid,
        payment_history: [
          ...(activeInvoice.invoice_data?.payment_history || []),
          {
            amount: additionalPayment,
            date: paymentForm.payment_date,
            method: paymentForm.payment_method,
            notes: paymentForm.payment_notes,
            timestamp: new Date().toISOString(),
          }
        ]
      };

      // Try to update with payment_amount column first, fall back to just invoice_data
      const { error: columnError } = await supabase
        .from('invoices')
        .update({
          invoice_data: updatedInvoiceData,
          payment_amount: newTotalPaid,
          payment_status: paymentForm.payment_status,
          payment_method: paymentForm.payment_method,
          payment_date: paymentForm.payment_date,
          payment_notes: paymentForm.payment_notes,
          status: paymentForm.payment_status === 'paid' ? 'paid' : activeInvoice.status,
        })
        .eq('id', activeInvoice.id);

      if (columnError) {
        console.log('Payment columns not found, storing in invoice_data only');
        // Fallback: only update invoice_data
        const { error: fallbackError } = await supabase
          .from('invoices')
          .update({
            invoice_data: updatedInvoiceData,
            status: paymentForm.payment_status === 'paid' ? 'paid' : activeInvoice.status,
          })
          .eq('id', activeInvoice.id);

        if (fallbackError) throw fallbackError;
      }

      await fetchInvoices();
      alert('Payment information updated successfully!');

      // Reset payment form
      setPaymentForm({
        payment_status: 'pending',
        payment_method: '',
        payment_amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_notes: '',
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment information');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      partial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Invoices</h3>

        {invoices.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No invoices yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Generate an invoice to start tracking payments
            </p>
            <Link
              href={`/admin/invoices/new/${itineraryId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Generate Invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  activeInvoice?.id === invoice.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
                onClick={() => setActiveInvoice(invoice)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {invoice.invoice_data?.invoice_number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {invoice.invoice_data?.package_name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {getStatusBadge(invoice.payment_status || 'pending')}
                      <span className="text-xs text-gray-500">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {invoice.invoice_data?.currency_symbol || '₹'}{invoice.invoice_data?.total_amount?.toLocaleString('en-IN') || '0'}
                    </p>
                    {invoice.payment_amount !== undefined && invoice.payment_amount < (invoice.invoice_data?.total_amount || 0) && (
                      <p className="text-xs text-green-600">
                        Paid: {invoice.invoice_data?.currency_symbol || '₹'}{(invoice.payment_amount || 0).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Management */}
      {activeInvoice && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Payment Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Summary */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeInvoice.invoice_data?.currency_symbol || '₹'}{activeInvoice.invoice_data?.total_amount?.toLocaleString('en-IN') || '0'}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {activeInvoice.invoice_data?.currency_symbol || '₹'}{(activeInvoice.payment_amount || activeInvoice.invoice_data?.payment_amount || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-orange-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance Due</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {activeInvoice.invoice_data?.currency_symbol || '₹'}{Math.max(0, (activeInvoice.invoice_data?.total_amount || 0) - (activeInvoice.payment_amount || activeInvoice.invoice_data?.payment_amount || 0)).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Payment Update Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentForm.payment_status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial Payment</option>
                  <option value="paid">Fully Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  placeholder="Bank Transfer, UPI, Cash, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Payment Amount
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-l-lg">
                    <IndianRupee className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={paymentForm.payment_amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_amount: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Enter amount to add"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This will be added to the current paid amount</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.payment_date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Notes
                </label>
                <textarea
                  value={paymentForm.payment_notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  placeholder="Reference number, bank details, etc."
                />
              </div>

              <button
                onClick={handleUpdatePayment}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                {saving ? <Clock className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Update Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
