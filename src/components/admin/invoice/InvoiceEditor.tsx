'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractInvoiceDataFromItinerary } from '@/lib/invoice/invoice-data-extractor';
import type { ItineraryInvoiceData } from '@/lib/templates/invoice-html-generator';
import { InvoiceEditorForm } from './InvoiceEditorForm';
import { InvoicePreviewPane } from './InvoicePreviewPane';
import { createClient } from '@/lib/supabase/client';

interface Itinerary {
  id: string;
  title: string;
  subtitle?: string;
  logo?: string;
  guest_names: string;
  start_date?: string;
  end_date?: string;
  pricing?: {
    currency?: string;
    symbol?: string;
    total?: string;
    items?: Array<{ label: string; description?: string; amount: string }>;
    inclusions?: string[];
    exclusions?: string[];
  };
  terms?: {
    booking_payment?: string;
    cancellation_policy?: string;
    [key: string]: any;
  };
}

interface Booking {
  id?: string;
  guide_details?: string | null;
  car_details?: string | null;
  hotel_details?: string | null;
  amount?: number;
  currency?: string;
}

interface InvoiceEditorProps {
  itinerary: Itinerary;
  booking?: Booking;
}

export function InvoiceEditor({ itinerary, booking }: InvoiceEditorProps) {
  const router = useRouter();
  const supabase = createClient();

  // Initialize invoice data from itinerary
  const [invoiceData, setInvoiceData] = useState<ItineraryInvoiceData>(() =>
    extractInvoiceDataFromItinerary(itinerary, booking)
  );

  // Track invoice status separately (stored in DB, not in invoice_data)
  const [invoiceStatus, setInvoiceStatus] = useState<string>('draft');
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = `invoice-draft-${itinerary.id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore draft if it's from the same itinerary
        if (parsed.invoice_number.includes(itinerary.id.substring(0, 8))) {
          setInvoiceData(parsed);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Load existing invoice to get current status
    const loadExistingInvoice = async () => {
      const { data: existing } = await supabase
        .from('invoices')
        .select('status, invoice_data')
        .eq('itinerary_id', itinerary.id)
        .maybeSingle();

      if (existing) {
        setInvoiceStatus(existing.status || 'draft');
        // Optionally restore invoice data from existing
        if (existing.invoice_data) {
          setInvoiceData(existing.invoice_data);
        }
      }
      setIsLoadingExisting(false);
    };

    loadExistingInvoice();
  }, [itinerary.id, supabase]);

  // Save draft on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftKey = `invoice-draft-${itinerary.id}`;
      localStorage.setItem(draftKey, JSON.stringify(invoiceData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [invoiceData, itinerary.id]);

  /**
   * Save invoice to database
   */
  const handleSave = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Auth error:', userError);
        router.push('/admin/login');
        return;
      }

      console.log('Saving invoice for itinerary:', itinerary.id);
      console.log('Invoice data:', invoiceData);

      // Check if invoice already exists for this itinerary
      const { data: existing, error: fetchError } = await supabase
        .from('invoices')
        .select('id')
        .eq('itinerary_id', itinerary.id)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid error if not found

      if (fetchError) {
        console.error('Error checking existing invoice:', fetchError);
        throw fetchError;
      }

      if (existing) {
        console.log('Updating existing invoice:', existing.id);
        // Update existing invoice
        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            invoice_number: invoiceData.invoice_number,
            invoice_data: invoiceData,
            status: invoiceStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating invoice:', updateError);
          throw updateError;
        }
      } else {
        console.log('Creating new invoice');
        // Create new invoice
        const { error: insertError } = await supabase
          .from('invoices')
          .insert({
            itinerary_id: itinerary.id,
            invoice_number: invoiceData.invoice_number,
            invoice_data: invoiceData,
            share_token: generateShareToken(),
            status: invoiceStatus,
          });

        if (insertError) {
          console.error('Error inserting invoice:', insertError);
          throw insertError;
        }
      }

      // Clear draft
      localStorage.removeItem(`invoice-draft-${itinerary.id}`);

      toast({
        title: 'Invoice saved successfully',
        description: `Status: ${invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1)}`,
      });

      router.push('/admin/invoices');
    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert(`Failed to save invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Generate share token for invoice
   */
  function generateShareToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 h-8 px-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Back</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-base font-medium text-foreground truncate">
                Invoice Editor
              </h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block truncate">
                {itinerary.title} • {itinerary.guest_names}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
                {invoiceData.invoice_number}
              </p>
            </div>
            <Button
              onClick={handleSave}
              size="sm"
              className="gap-1.5 h-8 px-3 text-xs font-medium"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Left Column - Form (60%) */}
          <div className="flex-1 lg:flex-[0.6] overflow-y-auto">
            <div className="p-3 sm:p-4">
              <InvoiceEditorForm
                data={invoiceData}
                onChange={setInvoiceData}
                status={invoiceStatus}
                onStatusChange={setInvoiceStatus}
                isLoadingExisting={isLoadingExisting}
              />
            </div>
          </div>

          {/* Right Column - Preview (40%) */}
          <div className="flex-1 lg:flex-[0.4] lg:overflow-y-auto bg-muted/30 border-l border-border">
            <InvoicePreviewPane data={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
