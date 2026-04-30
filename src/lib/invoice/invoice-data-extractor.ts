/**
 * Invoice Data Extraction Utilities
 * Extracts and transforms itinerary/booking data into invoice format
 */

import type { ItineraryInvoiceData } from '@/lib/templates/invoice-html-generator';

export interface Itinerary {
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

export interface Booking {
  id?: string;
  guide_details?: string | null;
  car_details?: string | null;
  hotel_details?: string | null;
  amount?: number;
  currency?: string;
  payment_receipts?: Array<{ amount: number; date?: string }>;
}

/**
 * Generate invoice number in format: BSP/YYYY/XXXX
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BSP/${year}/${randomId}`;
}

/**
 * Calculate duration from dates
 */
export function calculateDuration(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} Days / ${days - 1} Nights`;
}

/**
 * Format date range
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const options = { day: 'numeric', month: 'short', year: 'numeric' } as const;
  return `${new Date(startDate).toLocaleDateString('en-IN', options)} - ${new Date(endDate).toLocaleDateString('en-IN', options)}`;
}

/**
 * Parse logistics details from TEXT field
 * Expected format: "Name, Phone, License/Plate"
 */
export interface ParsedLogistics {
  name: string;
  phone: string;
  extra: string; // License for guide, Plate for driver
}

export function parseLogistics(details: string | null): ParsedLogistics | null {
  if (!details) return null;

  const parts = details.split(',').map(s => s.trim());
  return {
    name: parts[0] || '',
    phone: parts[1] || '',
    extra: parts[2] || '',
  };
}

/**
 * Parse hotel confirmations with status prefix convention
 * Convention: "CONFIRMED: Taj Tashi" or "PENDING: Hotel Druk"
 */
export interface HotelConfirmation {
  status: 'confirmed' | 'pending' | 'none';
  hotel: string;
}

export function parseHotelConfirmations(details: string | null): HotelConfirmation[] {
  if (!details) return [];

  const status = details.toUpperCase().startsWith('CONFIRMED') ? 'confirmed' : 'pending';
  const hotelName = details.replace(/^(CONFIRMED|PENDING):\s*/i, '');

  return [{ status, hotel: hotelName }];
}

/**
 * Extract invoice data from itinerary
 * Optionally merge with booking logistics
 */
export function extractInvoiceDataFromItinerary(
  itinerary: Itinerary,
  booking?: Booking
): ItineraryInvoiceData {

  // Base data from itinerary
  const base: ItineraryInvoiceData = {
    invoice_number: generateInvoiceNumber(),
    invoice_date: new Date().toISOString().split('T')[0],

    // Guest details
    guest_name: itinerary.guest_names || 'Guest',

    // Package details
    package_name: itinerary.title || 'Bhutan Journey',
    package_duration: itinerary.start_date && itinerary.end_date
      ? calculateDuration(itinerary.start_date, itinerary.end_date)
      : undefined,
    travel_dates: itinerary.start_date && itinerary.end_date
      ? formatDateRange(itinerary.start_date, itinerary.end_date)
      : undefined,

    // Pricing from JSONB
    currency: itinerary.pricing?.currency || 'INR',
    currency_symbol: itinerary.pricing?.symbol || '₹',
    total_amount: parseFloat(itinerary.pricing?.total || '0'),
    advance_payment: 0, // Will be set by user
    balance_due: 0, // Calculated after advance is set

    // Terms from JSONB
    booking_payment: itinerary.terms?.booking_payment,
    cancellation_policy: itinerary.terms?.cancellation_policy,
  };

  // Calculate inclusions from pricing
  if (itinerary.pricing?.inclusions) {
    base.inclusions = itinerary.pricing.inclusions;
  }

  // Merge booking logistics if available
  if (booking) {
    // These will be displayed in the invoice
    // Can be added to the invoice template as needed
  }

  return base;
}

/**
 * Calculate balance due from total and advance
 */
export function calculateBalanceDue(totalAmount: number, advancePayment: number): number {
  return totalAmount - advancePayment;
}
