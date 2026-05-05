'use client';

import { Receipt } from 'lucide-react';

interface ReadyForOperationsCardProps {
  itineraryId: string;
}

export function ReadyForOperationsCard({ itineraryId }: ReadyForOperationsCardProps) {
  const handleGenerateInvoice = () => {
    window.location.href = `/admin/itineraries/${itineraryId}`;
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            📋 Ready for Operations
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Generate an invoice to create a confirmed booking and start assigning resources
          </p>
        </div>
        <button
          onClick={handleGenerateInvoice}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          <Receipt className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>
    </div>
  );
}
