'use client';

import { Building2, CheckCircle2, Clock } from 'lucide-react';

export interface HotelConfirmation {
  status: 'confirmed' | 'pending' | 'none';
  hotel: string;
}

interface HotelStatusIndicatorProps {
  confirmed: number;
  total: number;
}

export function HotelStatusIndicator({ confirmed, total }: HotelStatusIndicatorProps) {
  if (total === 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/20 text-gray-600 dark:text-gray-400">
        <Building2 className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">No hotels</span>
      </div>
    );
  }

  const pending = total - confirmed;
  const allConfirmed = confirmed === total;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
        allConfirmed
          ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          : 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      }`}
    >
      <Building2 className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">
        {confirmed}/{total} Confirmed
      </span>
      {pending > 0 && (
        <>
          <span className="text-xs opacity-60">•</span>
          <span className="text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pending} pending
          </span>
        </>
      )}
      {allConfirmed && (
        <CheckCircle2 className="w-3.5 h-3.5" />
      )}
    </div>
  );
}

/**
 * Parse hotel confirmations with status prefix convention
 * Convention: "CONFIRMED: Taj Tashi" or "PENDING: Hotel Druk"
 */
export function parseHotelConfirmations(details: string | null | undefined): HotelConfirmation[] {
  if (!details) return [];

  const status = details.toUpperCase().startsWith('CONFIRMED') ? 'confirmed' : 'pending';
  const hotelName = details.replace(/^(CONFIRMED|PENDING):\s*/i, '');

  return [{ status, hotel: hotelName }];
}
