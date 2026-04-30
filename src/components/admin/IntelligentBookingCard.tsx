'use client';

import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import { ResourceBadge, parseLogistics } from './ResourceBadge';
import { HotelStatusIndicator, parseHotelConfirmations } from './HotelStatusIndicator';
import { FinancialHealthBar } from './FinancialHealthBar';

export interface Booking {
  id: string;
  client_name: string;
  travel_date?: string;
  num_pax?: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  guide_details?: string | null;
  car_details?: string | null;
  hotel_details?: string | null;
  hotel_confirmations?: any;
  amount?: number;
  currency?: string;
  payment_receipts?: Array<{ amount: number }>;
  itinerary_id?: string;
  itinerary?: Itinerary;
  tours?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface Itinerary {
  id: string;
  title: string;
}

interface IntelligentBookingCardProps {
  booking: Booking;
}

export function IntelligentBookingCard({ booking }: IntelligentBookingCardProps) {
  const itinerary = booking.itinerary;
  // Parse logistics from TEXT fields
  const guide = parseLogistics(booking.guide_details);
  const driver = parseLogistics(booking.car_details);

  // Parse hotel confirmations
  const hotels = booking.hotel_confirmations && Array.isArray(booking.hotel_confirmations)
    ? booking.hotel_confirmations
    : parseHotelConfirmations(booking.hotel_details);

  const confirmedHotels = hotels.filter((h: any) => h.status === 'confirmed').length;

  // Calculate financial health
  const advancePaid = booking.payment_receipts?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
  const totalAmount = booking.amount || 0;

  // Get currency symbol
  const getCurrencySymbol = (currency?: string) => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
    };
    return symbols[currency || 'INR'] || '₹';
  };

  const currencySymbol = getCurrencySymbol(booking.currency);

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Status badge styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200 hover:border-amber-200 dark:hover:border-amber-800">
      {/* Header: Guest & Itinerary Link */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-serif text-gray-900 dark:text-gray-100 mb-1">
            {booking.client_name}
          </h3>
          {itinerary && (
            <Link
              href={`/admin/itineraries/${itinerary.id}`}
              className="text-sm text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              View Itinerary →
            </Link>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Resources Row */}
      <div className="flex flex-wrap gap-3 mb-4">
        {guide && (
          <ResourceBadge
            type="guide"
            data={guide}
          />
        )}
        {driver && (
          <ResourceBadge
            type="driver"
            data={driver}
          />
        )}
        <HotelStatusIndicator
          confirmed={confirmedHotels}
          total={hotels.length}
        />
      </div>

      {/* Financial Health Bar */}
      <FinancialHealthBar
        advance={advancePaid}
        total={totalAmount}
        currency={booking.currency}
        currencySymbol={currencySymbol}
      />

      {/* Metadata Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
        {booking.travel_date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(booking.travel_date)}</span>
          </div>
        )}
        {booking.num_pax && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{booking.num_pax} pax</span>
          </div>
        )}
        {totalAmount > 0 && (
          <div className="ml-auto text-xs">
            Total: {currencySymbol}{totalAmount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
