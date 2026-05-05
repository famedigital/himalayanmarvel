'use client';

import { ArrowLeft, Receipt, Eye, Download } from 'lucide-react';
import Link from 'next/link';

interface ItineraryDetailActionsProps {
  id: string;
  hasBooking: boolean;
}

export function ItineraryDetailActions({ id, hasBooking }: ItineraryDetailActionsProps) {
  const handlePreview = () => {
    window.open(`/api/itineraries/${id}/html`, '_blank');
  };

  const handleGenerateInvoice = () => {
    window.location.href = `/admin/itineraries/${id}`;
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/itineraries/${id}`}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-semibold"
      >
        Edit
      </Link>
      <button
        onClick={handlePreview}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-semibold"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
      {!hasBooking && (
        <button
          onClick={handleGenerateInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
        >
          <Receipt className="w-4 h-4" />
          Generate Invoice
        </button>
      )}
    </div>
  );
}
