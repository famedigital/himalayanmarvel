import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/admin/BookingForm';
import { Booking } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getBooking(id: string) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  return booking;
}

export default async function EditBookingPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Booking</h1>
        <p className="text-gray-500">Update booking details for {booking.client_name}</p>
      </div>

      <BookingForm booking={booking as Booking} isEdit={true} />
    </div>
  );
}
