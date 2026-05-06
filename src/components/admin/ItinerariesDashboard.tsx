'use client';

import { useState } from 'react';
import { Plus, FileText, Calendar, CheckCircle, Clock, AlertCircle, Receipt, Filter } from 'lucide-react';
import Link from 'next/link';
import { ItinerariesTable } from '@/components/admin/ItinerariesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ItinerariesDashboardProps {
  itineraries: any[];
  bookings: any[];
  invoices: any[];
}

export function ItinerariesDashboard({ itineraries, bookings, invoices }: ItinerariesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'invoices'>('itineraries');

  // Calculate stats
  const totalItineraries = itineraries.length || 0;
  const draftItineraries = itineraries.filter(i => i.status === 'draft').length || 0;
  const finalItineraries = itineraries.filter(i => i.status === 'final').length || 0;

  const confirmedBookings = bookings.length || 0;
  const upcomingBookings = bookings.filter(b => {
    if (!b.travel_date) return false;
    const travelDate = new Date(b.travel_date);
    const today = new Date();
    const daysUntil = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  }).length || 0;

  const pendingPayments = invoices.filter(inv => inv.status !== 'paid').length || 0;
  const totalInvoices = invoices.length || 0;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length || 0;

  return (
    <>
      {/* Page Header with Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-wide">Itineraries Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage itineraries, invoices & operations in one place</p>
          </div>
          {activeTab === 'itineraries' && (
            <Link
              href="/admin/itineraries/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-500/20 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              New Itinerary
            </Link>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'itineraries' | 'invoices')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="itineraries" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Itineraries
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              All Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itineraries" className="mt-6 space-y-6">
            {/* Quick Stats for Itineraries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Itineraries Table */}
            <ItinerariesTable itineraries={itineraries} bookings={bookings} invoices={invoices} />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6 space-y-6">
            {/* Invoice Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">Total Invoices</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalInvoices}</p>
                  </div>
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wier mb-1">Paid Invoices</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{paidInvoices}</p>
                  </div>
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{pendingPayments}</p>
                  </div>
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* All Invoices Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Invoices</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage all invoices across all itineraries</p>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">No invoices yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Invoice #</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Guest</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Itinerary</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                              {invoice.invoice_data?.invoice_number}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-100">
                            {invoice.invoice_data?.guest_name}
                          </td>
                          <td className="py-4 px-6">
                            <Link
                              href={`/admin/itineraries/${invoice.itinerary_id}`}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              {invoice.itineraries?.title || 'Unknown'}
                            </Link>
                          </td>
                          <td className="py-4 px-6 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                            {invoice.invoice_data?.currency_symbol || '₹'}{invoice.invoice_data?.total_amount?.toLocaleString('en-IN') || '0'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                              invoice.status === 'partial_payment' ? 'bg-blue-100 text-blue-700' :
                              invoice.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {invoice.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/itineraries/${invoice.itineraryId}?tab=invoices`}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
