'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CloudinaryUpload from './CloudinaryUpload';
import {
  Calendar,
  User,
  Mail,
  Phone,
  Users,
  DollarSign,
  MapPin,
  FileText,
  Save,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { Booking, Tour, Itinerary } from '@/lib/supabase/types';

interface BookingFormProps {
  booking?: Booking;
  isEdit?: boolean;
}

export default function BookingForm({ booking, isEdit = false }: BookingFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadingItineraries, setLoadingItineraries] = useState(true);

  // Form state
  const [itineraryId, setItineraryId] = useState(booking?.itinerary_id || '');
  const [clientName, setClientName] = useState(booking?.client_name || '');
  const [email, setEmail] = useState(booking?.email || '');
  const [phone, setPhone] = useState(booking?.phone || '');
  const [noOfPax, setNoOfPax] = useState(booking?.no_of_pax || 1);
  const [passportOrigin, setPassportOrigin] = useState(booking?.passport_origin || '');
  const [passportPhoto, setPassportPhoto] = useState(booking?.passport_photo || '');
  const [amount, setAmount] = useState(booking?.amount || 0);
  const [status, setStatus] = useState(booking?.status || 'pending');
  const [bookingDate, setBookingDate] = useState(
    booking?.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : ''
  );
  const [travelDate, setTravelDate] = useState(
    booking?.travel_date ? new Date(booking.travel_date).toISOString().split('T')[0] : ''
  );
  const [notes, setNotes] = useState(booking?.notes || '');

  // Payment receipts
  const [paymentReceipts, setPaymentReceipts] = useState<any[]>(
    booking?.payment_receipts || []
  );
  const [newReceiptAmount, setNewReceiptAmount] = useState('');
  const [newReceiptUrl, setNewReceiptUrl] = useState('');

  // Fetch itineraries on mount
  useEffect(() => {
    const fetchItineraries = async () => {
      const { data } = await supabase
        .from('itineraries')
        .select('*')
        .eq('status', 'final')
        .order('created_at', { ascending: false });

      if (data) {
        setItineraries(data);
      }
      setLoadingItineraries(false);
    };

    fetchItineraries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        itinerary_id: itineraryId || null,
        client_name: clientName,
        email,
        phone,
        no_of_pax: noOfPax,
        passport_origin: passportOrigin,
        passport_photo: passportPhoto,
        amount,
        status,
        booking_date: bookingDate || null,
        travel_date: travelDate || null,
        notes,
        payment_receipts: paymentReceipts,
        updated_at: new Date().toISOString(),
      };

      if (isEdit && booking?.id) {
        const { error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', booking.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookings')
          .insert([{
            ...bookingData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      router.push('/admin/bookings');
      router.refresh();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentReceipt = () => {
    if (newReceiptUrl && newReceiptAmount) {
      setPaymentReceipts([
        ...paymentReceipts,
        {
          id: Date.now(),
          url: newReceiptUrl,
          amount: parseFloat(newReceiptAmount),
          date: new Date().toISOString(),
        },
      ]);
      setNewReceiptAmount('');
      setNewReceiptUrl('');
    }
  };

  const removePaymentReceipt = (id: number) => {
    setPaymentReceipts(paymentReceipts.filter(r => r.id !== id));
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello ${clientName}, regarding your itinerary ${itineraries.find(i => i.id === itineraryId)?.title || ''}...`
    );
    window.open(`https://wa.me/97577270465?text=${message}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Itinerary Selection */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Itinerary Information</h2>

        {loadingItineraries ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div>
            <label htmlFor="itinerary" className="block text-sm font-medium text-gray-900/70 mb-2">
              Select Itinerary
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <select
                id="itinerary"
                value={itineraryId}
                onChange={(e) => setItineraryId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-white">Select an itinerary</option>
                <option disabled className="bg-gray-100">──────────</option>
                {itineraries.map((itinerary) => (
                  <option key={itinerary.id} value={itinerary.id} className="bg-white">
                    {itinerary.title} {itinerary.guest_names ? `(${itinerary.guest_names})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Client Information */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Client Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <div className="md:col-span-2">
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-900/70 mb-2">
              Client Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900/70 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900/70 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          {/* Number of Pax */}
          <div>
            <label htmlFor="pax" className="block text-sm font-medium text-gray-900/70 mb-2">
              Number of Pax
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="pax"
                type="number"
                min="1"
                value={noOfPax}
                onChange={(e) => setNoOfPax(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Passport Origin */}
          <div>
            <label htmlFor="passportOrigin" className="block text-sm font-medium text-gray-900/70 mb-2">
              Passport Origin
            </label>
            <input
              id="passportOrigin"
              type="text"
              value={passportOrigin}
              onChange={(e) => setPassportOrigin(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              placeholder="United States"
            />
          </div>

          {/* Passport Photo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900/70 mb-2">
              Passport Photo
            </label>
            <CloudinaryUpload
              onUploadComplete={setPassportPhoto}
              onRemove={() => setPassportPhoto('')}
              value={passportPhoto}
              label="Upload passport photo"
              folder="himalayanmarvel/passports"
              aspect="passport"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-900/70 mb-2">
              Total Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900/70 mb-2">
              Booking Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'confirmed' | 'paid' | 'cancelled')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="pending" className="bg-white">Pending</option>
              <option value="confirmed" className="bg-white">Confirmed</option>
              <option value="paid" className="bg-white">Paid</option>
              <option value="cancelled" className="bg-white">Cancelled</option>
            </select>
          </div>

          {/* Booking Date */}
          <div>
            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-900/70 mb-2">
              Booking Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="bookingDate"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Travel Date */}
          <div>
            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-900/70 mb-2">
              Travel Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
              <input
                id="travelDate"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Payment Receipts */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Receipts</h3>

          {/* Existing Receipts */}
          {paymentReceipts.length > 0 && (
            <div className="space-y-3 mb-4">
              {paymentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <a
                      href={receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 font-medium"
                    >
                      ${Number(receipt.amount).toLocaleString()}
                    </a>
                    <span className="text-gray-900/50 text-sm">
                      {new Date(receipt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePaymentReceipt(receipt.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Receipt */}
          <div className="border border-dashed border-gray-300 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={newReceiptAmount}
                onChange={(e) => setNewReceiptAmount(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
              />
              <div className="md:col-span-2 flex gap-4">
                <CloudinaryUpload
                  onUploadComplete={setNewReceiptUrl}
                  onRemove={() => setNewReceiptUrl('')}
                  value={newReceiptUrl}
                  label="Upload receipt"
                  folder="himalayanmarvel/receipts"
                />
                {newReceiptUrl && newReceiptAmount && (
                  <button
                    type="button"
                    onClick={addPaymentReceipt}
                    className="self-start px-4 py-3 bg-orange-500 hover:bg-orange-600 text-gray-900 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Total Paid */}
          {paymentReceipts.length > 0 && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-gray-900/70">Total Paid: </span>
              <span className="text-green-400 font-semibold">
                ${paymentReceipts.reduce((sum, r) => sum + Number(r.amount), 0).toLocaleString()}
              </span>
              {amount > 0 && (
                <span className="text-gray-900/50 ml-4">
                  of ${amount.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notes</h2>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
          placeholder="Additional notes about this booking..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <button
          type="button"
          onClick={openWhatsApp}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-gray-900 font-medium rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Open WhatsApp
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/bookings')}
            className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? 'Update Booking' : 'Create Booking'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
