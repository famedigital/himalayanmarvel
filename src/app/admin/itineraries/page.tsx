import { createClient } from '@/lib/supabase/server';
import { ItinerariesTable } from '@/components/admin/ItinerariesTable';
import { Plus, FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ItinerariesPage() {
  const supabase = await createClient();

  const { data: itineraries } = await supabase
    .from('itineraries')
    .select('*, itinerary_days(count)')
    .order('created_at', { ascending: false });

  // Calculate stats
  const totalItineraries = itineraries?.length || 0;
  const draftItineraries = itineraries?.filter(i => i.status === 'draft').length || 0;
  const finalItineraries = itineraries?.filter(i => i.status === 'final').length || 0;

  // Get booking stats
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, itineraries(*)')
    .in('status', ['confirmed', 'paid']);

  const confirmedBookings = bookings?.length || 0;
  const upcomingBookings = bookings?.filter(b => {
    if (!b.travel_date) return false;
    const travelDate = new Date(b.travel_date);
    const today = new Date();
    const daysUntil = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  }).length || 0;

  // Get invoice stats
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  const pendingPayments = invoices?.filter(inv => inv.status !== 'paid').length || 0;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-wide">Itineraries</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage custom tour itineraries</p>
          </div>
          <Link
            href="/admin/itineraries/new"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-500/20 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Itinerary
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Itineraries */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Total Itineraries</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalItineraries}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-blue-700 dark:text-blue-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {draftItineraries} Draft
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {finalItineraries} Final
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-1">Confirmed Bookings</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{confirmedBookings}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-700 dark:text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Ready for operations</span>
              </div>
            </div>
            <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{pendingPayments}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-3 h-3" />
                <span>Awaiting payment</span>
              </div>
            </div>
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Upcoming Departures */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">Upcoming (30 days)</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{upcomingBookings}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-purple-700 dark:text-purple-400">
                <Calendar className="w-3 h-3" />
                <span>Departing soon</span>
              </div>
            </div>
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <ItinerariesTable itineraries={itineraries || []} bookings={bookings || []} invoices={invoices || []} />
    </>
  );
}
