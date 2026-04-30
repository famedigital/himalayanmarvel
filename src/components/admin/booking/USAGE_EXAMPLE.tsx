/**
 * PAYMENT TRACKING COMPONENTS - USAGE EXAMPLE
 *
 * This file demonstrates how to use the payment tracking components
 * in your booking detail pages.
 *
 * Components:
 * - PaymentTrackingTable: Displays payment history and progress
 * - AdvancePaymentModal: Records advance payments
 * - InstallmentModal: Records installment payments
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  PaymentTrackingTable,
  AdvancePaymentModal,
  InstallmentModal,
} from '@/components/admin/booking';

interface Booking {
  id: string;
  guest_name: string;
  tour?: { title: string };
  total_price: number;
  currency: string;
  advance_amount: number;
}

export function BookingPaymentSection({ booking }: { booking: Booking }) {
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate amount paid from payment records
  // This should be fetched from the payments table
  const amountPaid = 0; // Replace with actual calculation

  const handlePaymentSuccess = () => {
    // Refresh the payment tracking table
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setAdvanceModalOpen(true)}
          variant="default"
        >
          Record Advance Payment
        </Button>
        <Button
          onClick={() => setInstallmentModalOpen(true)}
          variant="outline"
          disabled={amountPaid >= booking.total_price}
        >
          Record Installment
        </Button>
      </div>

      {/* Payment Tracking Table */}
      <PaymentTrackingTable
        key={refreshKey}
        bookingId={booking.id}
        totalAmount={booking.total_price}
        currency={booking.currency}
        advanceAmount={booking.advance_amount}
        onRefresh={handlePaymentSuccess}
      />

      {/* Advance Payment Modal */}
      <AdvancePaymentModal
        isOpen={advanceModalOpen}
        onClose={() => setAdvanceModalOpen(false)}
        bookingId={booking.id}
        guestName={booking.guest_name}
        tourName={booking.tour?.title || 'N/A'}
        totalAmount={booking.total_price}
        currency={booking.currency}
        advanceAmount={booking.advance_amount}
        onSuccess={handlePaymentSuccess}
      />

      {/* Installment Modal */}
      <InstallmentModal
        isOpen={installmentModalOpen}
        onClose={() => setInstallmentModalOpen(false)}
        bookingId={booking.id}
        guestName={booking.guest_name}
        tourName={booking.tour?.title || 'N/A'}
        totalAmount={booking.total_price}
        currency={booking.currency}
        amountPaid={amountPaid}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

/**
 * DATABASE SETUP
 *
 * Make sure you have a 'payments' table in your Supabase database:
 *
 * CREATE TABLE payments (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
 *   amount DECIMAL(10,2) NOT NULL,
 *   currency VARCHAR(3) NOT NULL DEFAULT 'INR',
 *   payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('advance', 'installment', 'full')),
 *   payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bank_transfer', 'upi', 'card', 'cash', 'other')),
 *   status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
 *   transaction_id VARCHAR(255),
 *   notes TEXT,
 *   receipt_url TEXT,
 *   payment_date TIMESTAMP WITH TIME ZONE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_payments_booking_id ON payments(booking_id);
 * CREATE INDEX idx_payments_status ON payments(status);
 * CREATE INDEX idx_payments_payment_type ON payments(payment_type);
 *
 * STORAGE BUCKET
 *
 * Create a storage bucket named 'payment-receipts' for uploading receipts:
 * - Enable public access if needed
 * - Add RLS policies to allow authenticated users to upload
 */

export default BookingPaymentSection;
