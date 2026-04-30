import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { generateItineraryInvoiceHTML } from '@/lib/templates/invoice-html-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface InvoicePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { token } = await params;
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, itineraries(*)')
    .eq('share_token', token)
    .single();

  if (!invoice) {
    return {
      title: 'Invoice Not Found',
    };
  }

  return {
    title: `Invoice ${invoice.invoice_number} | ${invoice.invoice_data?.company_name || 'Himalayan Marvels'}`,
    description: `Invoice for ${invoice.invoice_data?.package_name || 'Tour Package'}`,
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { token } = await params;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, itineraries(*)')
    .eq('share_token', token)
    .single();

  if (error || !invoice) {
    notFound();
  }

  // Check if invoice is expired
  if (invoice.expires_at && new Date(invoice.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">⌛</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Expired</h1>
          <p className="text-gray-600">This invoice has expired. Please contact us for a new invoice.</p>
        </div>
      </div>
    );
  }

  // Generate the HTML invoice
  const invoiceHTML = await generateItineraryInvoiceHTML(invoice.invoice_data);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header actions */}
        <div className="bg-white rounded-t-lg p-4 flex justify-between items-center border-b">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Invoice #{invoice.invoice_number}
            </h1>
            {invoice.status === 'paid' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                ✓ Paid
              </span>
            )}
            {invoice.status === 'sent' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                Pending Payment
              </span>
            )}
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Download PDF
          </button>
        </div>

        {/* Invoice Content */}
        <div
          className="bg-white"
          dangerouslySetInnerHTML={{ __html: invoiceHTML }}
        />

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-lg p-4 text-center text-sm text-gray-600">
          <p>
            Generated on {new Date(invoice.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-1">
            Questions? Contact us at{' '}
            <a href={`mailto:${invoice.invoice_data?.company_email || 'info@himalayanmarvels.com'}`} className="text-blue-600 hover:underline">
              {invoice.invoice_data?.company_email || 'info@himalayanmarvels.com'}
            </a>
          </p>
        </div>
      </div>

      {/* Print styles - using global style tag */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              background: white !important;
            }
          }
        `
      }} />
    </div>
  );
}
