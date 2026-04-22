import BookingForm from '@/components/admin/BookingForm';

export default function NewBookingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Booking</h1>
        <p className="text-gray-500">Create a new client booking</p>
      </div>

      <BookingForm />
    </div>
  );
}
