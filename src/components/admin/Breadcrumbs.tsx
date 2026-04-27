'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  // Filter out 'admin' and build breadcrumbs
  const breadcrumbs = segments
    .filter((s) => s !== 'admin')
    .map((segment, index, arr) => {
      // Custom labels
      const labels: Record<string, string> = {
        dashboard: 'Dashboard',
        tours: 'Tours',
        bookings: 'Bookings',
        itineraries: 'Itineraries',
        invoices: 'Invoices',
        blog: 'Blog',
        new: 'New',
        settings: 'Settings',
        hero: 'Hero Slider',
      };

      // Skip IDs/UUIDs
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
        /^\d+$/.test(segment)
      ) {
        return null;
      }

      const label = labels[segment] ||
        segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const href = '/' + segments.slice(0, segments.indexOf(segment) + 1).join('/');

      return { label, href };
    })
    .filter((crumb): crumb is { label: string; href: string } => crumb !== null);

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center gap-2">
        <li>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
