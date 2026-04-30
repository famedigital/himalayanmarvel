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
        bookings: 'Operations',
        itineraries: 'Itineraries',
        invoices: 'Invoices',
        blog: 'Blog',
        new: 'New',
        settings: 'Settings',
        hero: 'Hero Slider',
        'tour-categories': 'Categories',
        'bank-details': 'Bank Details',
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
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
