'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Receipt, Eye, Download, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { generateItineraryInvoiceHTML } from '@/lib/templates/invoice-html-generator';
import { InvoiceStatusBadge } from '@/components/admin/InvoiceStatusBadge';
import { InvoiceStatusFilter } from '@/components/admin/InvoiceStatusFilter';

async function getInvoices() {
  const supabase = createClient();

  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      itineraries (
        id,
        title,
        guest_names
      )
    `)
    .order('created_at', { ascending: false });

  return invoices || [];
}

function formatCurrency(amount: number, symbol: string = '₹') {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getInvoices().then((data) => {
      setInvoices(data);
      setFilteredInvoices(data);
    }).finally(() => setLoading(false));
  }, []);

  // Filter invoices by status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(inv => inv.status === statusFilter));
    }
  }, [statusFilter, invoices]);

  // Calculate status counts
  const statusCounts = {
    all: invoices.length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    confirmed: invoices.filter(inv => inv.status === 'confirmed').length,
    partial_payment: invoices.filter(inv => inv.status === 'partial_payment').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    cancelled: invoices.filter(inv => inv.status === 'cancelled').length,
    refund: invoices.filter(inv => inv.status === 'refund').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    const supabase = createClient();
    await supabase.from('invoices').delete().eq('id', id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Workflow Guidance */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Invoices</h1>
            <p className="text-muted-foreground text-xs mt-0.5">Generated from itineraries for billing</p>
          </div>
          <div className="flex items-center gap-2">
            <InvoiceStatusFilter
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
              counts={statusCounts}
            />
            <Link
              href="/admin/itineraries"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all shadow-sm font-medium text-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              Create from Itinerary
            </Link>
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="bg-muted/30 border border-border rounded-lg p-2 flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
            <span className="text-primary text-[10px] font-bold">i</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-foreground">1.</strong> Go to <Link href="/admin/itineraries" className="underline font-medium">Itineraries</Link> → <strong className="text-foreground">2.</strong> Click the <Receipt className="w-2.5 h-2.5 inline mx-0.5" /> icon → <strong className="text-foreground">3.</strong> Edit & Save → <strong className="text-foreground">4.</strong> View here
            </p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="text-center py-10 bg-card border border-border rounded-lg">
          <Receipt className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-foreground mb-1">No invoices yet</h3>
          <p className="text-muted-foreground text-xs mb-3">
            Create an itinerary first, then generate an invoice
          </p>
          <Link
            href="/admin/itineraries"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all shadow-sm font-medium text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Go to Itineraries
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Invoice #</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Guest</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Package</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice: any) => {
                const data = invoice.invoice_data;
                return (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2">
                      <span className="font-mono text-[10px] text-foreground">{data.invoice_number}</span>
                    </td>
                    <td className="px-3 py-2 text-foreground text-xs">{data.guest_name}</td>
                    <td className="px-3 py-2 text-foreground text-xs">{data.package_name}</td>
                    <td className="px-3 py-2 text-right font-medium text-foreground text-xs">
                      {formatCurrency(data.total_amount, data.currency_symbol)}
                      {data.advance_payment > 0 && (
                        <div className="text-[9px] text-muted-foreground">
                          Adv: {formatCurrency(data.advance_payment, data.currency_symbol)}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-3 py-2 text-center text-[10px] text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={async () => {
                            const html = await generateItineraryInvoiceHTML(data);
                            const blob = new Blob([html], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          }}
                          className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
                          title="View"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={async () => {
                            const html = await generateItineraryInvoiceHTML(data);
                            const blob = new Blob([html], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${data.invoice_number.replace(/\//g, '-')}.html`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
                          title="Download"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        {invoice.itineraries && (
                          <Link
                            href={`/admin/invoices/new/${invoice.itineraries.id}`}
                            className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
                            title="Edit"
                          >
                            <Receipt className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && invoices.length > 0 && (
            <div className="text-center py-8 bg-muted/30">
              <p className="text-sm text-muted-foreground">No invoices match the selected status filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
