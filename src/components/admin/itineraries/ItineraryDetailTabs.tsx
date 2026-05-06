'use client';

import { useSearchParams } from 'next/navigation';
import { ItineraryTabs } from '@/components/admin/itineraries/ItineraryTabs';
import { OverviewTab } from '@/components/admin/itineraries/OverviewTab';
import { InvoicesTab } from '@/components/admin/itineraries/InvoicesTab';
import { OperationsTab } from '@/components/admin/itineraries/OperationsTab';

interface ItineraryDetailTabsProps {
  itineraryId: string;
  itinerary: any;
  booking: any;
  invoices: any[];
}

export function ItineraryDetailTabs({ itineraryId, itinerary, booking, invoices }: ItineraryDetailTabsProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Check if operations tab should be visible
  // Only show if invoice status is confirmed, partial_payment, or paid
  const hasConfirmedInvoice = invoices.some(inv =>
    inv.status === 'confirmed' ||
    inv.status === 'partial_payment' ||
    inv.status === 'paid' ||
    inv.invoice_data?.payment_status === 'partial' ||
    inv.invoice_data?.payment_status === 'paid'
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab itineraryId={itineraryId} itinerary={itinerary} />;
      case 'invoices':
        return <InvoicesTab itineraryId={itineraryId} itinerary={itinerary} />;
      case 'operations':
        if (!hasConfirmedInvoice) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Operations Not Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You need to confirm or partially pay the invoice before managing operations.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Please go to the Invoices tab and update the payment status.
                </p>
              </div>
            </div>
          );
        }
        return <OperationsTab itineraryId={itineraryId} itinerary={itinerary} booking={booking} />;
      default:
        return <OverviewTab itineraryId={itineraryId} itinerary={itinerary} />;
    }
  };

  return (
    <div className="space-y-6">
      <ItineraryTabs
        itineraryId={itineraryId}
        activeTab={activeTab}
        hasConfirmedInvoice={hasConfirmedInvoice}
      />
      {renderTab()}
    </div>
  );
}
