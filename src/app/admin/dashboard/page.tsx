import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Map, Calendar, FileText, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const supabase = await createClient();

  const [toursCount, bookingsCount, blogsCount] = await Promise.all([
    supabase.from('tours').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }),
  ]);

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('client_name, amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    tours: toursCount.count || 0,
    bookings: bookingsCount.count || 0,
    blogs: blogsCount.count || 0,
    recentBookings: recentBookings || [],
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Total Tours',
      value: stats.tours,
      icon: Map,
      color: 'from-orange-500 to-amber-500',
      href: '/admin/tours',
    },
    {
      title: 'Total Operations',
      value: stats.bookings,
      icon: Calendar,
      color: 'from-pink-500 to-rose-500',
      href: '/admin/bookings',
    },
    {
      title: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      href: '/admin/blog',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative bg-white dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Operations</h2>
          <Link
            href="/admin/bookings"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-900/20 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No operations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking: any) => (
                  <tr key={booking.created_at} className="border-b border-gray-100 dark:border-gray-800/80">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{booking.client_name}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {booking.amount ? `$${booking.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : booking.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : booking.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/tours/new"
          className="group relative bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
        >
          <Map className="w-8 h-8 text-orange-500 mb-4" />
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-1">Create Tour</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Add a new tour package</p>
        </Link>

        <Link
          href="/admin/bookings/new"
          className="group relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all"
        >
          <Calendar className="w-8 h-8 text-pink-500 mb-4" />
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-1">New Operation</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Add a client booking</p>
        </Link>

        <Link
          href="/admin/blog/new"
          className="group relative bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
        >
          <FileText className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-1">Write Blog</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Publish a new article</p>
        </Link>
      </div>
    </div>
  );
}
