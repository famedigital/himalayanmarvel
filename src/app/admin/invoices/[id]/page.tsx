/**
 * Invoice detail / payment status editor
 * Uses invoice_data JSONB schema (canonical).
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateItineraryInvoiceHTML } from '@/lib/templates/invoice-html-generator';
import { InvoiceStatusBadge } from '@/components/admin/InvoiceStatusBadge';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  'draft',
  'pending',
  'confirmed',
  'partial_payment',
  'paid',
  'cancelled',
  'refund',
] as const;

export default function InvoiceDetailPage({
  params,
}: {
  params?: Promise<{ id?: string | string[] }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params ?? Promise.resolve<{ id?: string | string[] }>({}));
  const rawId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  const invoiceId = rawId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [status, setStatus] = useState('draft');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId || invoiceId === 'new') {
      router.replace('/admin/itineraries');
      return;
    }
    fetchInvoice(invoiceId);
  }, [invoiceId, router]);

  const fetchInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setInvoice(result.data);
        setStatus(result.data.status || 'draft');
        setInvoiceData(result.data.invoice_data || {});
      } else {
        toast.error(result.error || 'Invoice not found');
        router.push('/admin/invoices');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!invoiceId) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          invoice_data: invoiceData,
          invoice_number: invoiceData?.invoice_number,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setInvoice(result.data);
        toast.success('Invoice updated');
      } else {
        toast.error(result.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!invoiceData) return;
    const html = await generateItineraryInvoiceHTML(invoiceData);
    setPreviewHtml(html);
  };

  const copyShareLink = async () => {
    if (!invoice?.share_token) return;
    const url = `${window.location.origin}/invoice/${invoice.share_token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Share link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice || !invoiceData) {
    return null;
  }

  const itineraryId = invoice.itinerary_id;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Invoices
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground font-mono">
              {invoice.invoice_number}
            </h1>
            <p className="text-xs text-muted-foreground">
              {invoiceData.guest_name} · {invoiceData.package_name}
            </p>
          </div>
          <InvoiceStatusBadge status={status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {itineraryId && (
            <Link
              href={`/admin/invoices/new/${itineraryId}`}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Full editor
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            Preview
          </Button>
          {invoice.share_token && (
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              {copied ? (
                <Check className="w-3.5 h-3.5 mr-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1" />
              )}
              Share
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Workflow */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Flow:</strong> Itinerary → Invoice (set status to
        confirmed/partial/paid) → Operations assignments unlock on the itinerary detail page.
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Payment status</h2>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Total</label>
              <input
                type="number"
                value={invoiceData.total_amount ?? 0}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    total_amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Advance paid</label>
              <input
                type="number"
                value={invoiceData.advance_payment ?? 0}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    advance_payment: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          {invoice.share_token && (
            <a
              href={`/invoice/${invoice.share_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:underline"
            >
              Open guest link <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Guest & package</h2>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Guest name</label>
            <input
              value={invoiceData.guest_name || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, guest_name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Package</label>
            <input
              value={invoiceData.package_name || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, package_name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input
              value={invoiceData.guest_email || ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, guest_email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          {itineraryId && (
            <Link
              href={`/admin/itineraries/${itineraryId}`}
              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:underline"
            >
              Open itinerary <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {previewHtml && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between bg-muted px-3 py-2">
            <span className="text-xs font-medium">Preview</span>
            <Button variant="ghost" size="sm" onClick={() => setPreviewHtml(null)}>
              Close
            </Button>
          </div>
          <iframe title="Invoice preview" srcDoc={previewHtml} className="w-full h-[70vh] bg-white" />
        </div>
      )}
    </div>
  );
}
