import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateMoneyReceiptPDF, generateReceiptNumber } from '@/lib/money-receipt-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Generate receipt number if not exists
    const receiptNumber = `MR-${booking.id.slice(-8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Format date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Format travel date
    const travelDate = booking.travel_date
      ? new Date(booking.travel_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined;

    const pdf = generateMoneyReceiptPDF({
      receipt_number: receiptNumber,
      date,
      client_name: booking.client_name,
      amount: booking.amount || 0,
      booking_id: booking.id,
      travel_date: travelDate,
      no_of_pax: booking.no_of_pax,
    });

    // Convert PDF to base64
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      pdf: `data:application/pdf;base64,${pdfBase64}`,
      receiptNumber,
    });
  } catch (error) {
    console.error('Error generating money receipt:', error);
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
