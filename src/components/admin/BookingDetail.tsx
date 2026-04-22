'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Booking, Tour } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Users,
  DollarSign,
  MapPin,
  Download,
  Share2,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function BookingDetail() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<(Booking & { tour?: Tour }) | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, tour:tours(*)')
        .eq('id', params.id)
        .single();

      if (data) {
        setBooking(data as Booking & { tour?: Tour });
      }
      setLoading(false);
    };

    fetchBooking();
  }, [params.id]);

  const downloadPDF = async () => {
    if (!booking) return;

    const element = document.getElementById('booking-details');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`booking-${booking.client_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const shareViaWhatsApp = () => {
    if (!booking) return;

    const tourTitle = booking.tour?.title || 'a tour';
    const message = encodeURIComponent(
      `Hello ${booking.client_name},\n\n` +
      `Your booking for ${tourTitle} is ${booking.status.toUpperCase()}.\n\n` +
      `📅 Travel Date: ${booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : 'TBD'}\n` +
      `👥 Guests: ${booking.no_of_pax}\n` +
      `💰 Amount: ${booking.amount ? `$${booking.amount.toLocaleString()}` : 'TBD'}\n\n` +
      `Please let us know if you have any questions!`
    );

    const phone = booking.phone ? booking.phone.replace(/[^\d+]/g, '') : '97577270465';
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/admin/bookings/${booking?.id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 text-lg">Booking not found</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/bookings')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{booking.client_name}</h1>
            <p className="text-gray-500">Booking Details</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Card */}
      <div id="booking-details" className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmation</h2>
              <p className="text-gray-500 text-sm">Himalayan Marvels - Bhutan Tours</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.client_name}</p>
              </div>
            </div>
            {booking.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{booking.email}</p>
                </div>
              </div>
            )}
            {booking.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{booking.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Number of Pax</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.no_of_pax}</p>
              </div>
            </div>
            {booking.passport_origin && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Passport Origin</p>
                  <p className="font-medium text-gray-900 dark:text-white">{booking.passport_origin}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tour Information */}
        {booking.tour && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tour Information</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="font-semibold text-gray-900 dark:text-white">{booking.tour.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                {booking.tour.duration && (
                  <span>{booking.tour.duration} days</span>
                )}
                {booking.tour.price && (
                  <span>${Number(booking.tour.price).toLocaleString()} / person</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Important Dates</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {booking.booking_date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
            {booking.travel_date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(booking.travel_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
          {booking.amount && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${booking.amount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {booking.payment_receipts && booking.payment_receipts.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Payment Receipts</p>
              <div className="space-y-2">
                {booking.payment_receipts.map((receipt: any) => (
                  <div key={receipt.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${Number(receipt.amount).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(receipt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <a
                      href={receipt.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-500 hover:text-orange-600"
                    >
                      View
                    </a>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500">Total Paid</span>
                  <span className="font-bold text-green-500">
                    ${booking.payment_receipts.reduce((sum: number, r: any) => sum + Number(r.amount), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-gray-700 dark:text-gray-300">{booking.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 text-center">
            For any questions, contact us at{' '}
            <a href="mailto:info@himalayanmarvels.com" className="text-orange-500 hover:text-orange-600">
              info@himalayanmarvels.com
            </a>
            {' '}or WhatsApp at{' '}
            <a href="https://wa.me/97577270465" className="text-orange-500 hover:text-orange-600">
              +975 77 270 465
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
