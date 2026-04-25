'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Custom labels for specific routes
const customLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  tours: 'Tours',
  bookings: 'Bookings',
  itineraries: 'Itineraries',
  blog: 'Blog',
  'tour-categories': 'Categories',
  'bank-details': 'Bank Details',
  hero: 'Hero Slider',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
  create: 'Create',
};

// Generate label for a path segment
function getLabel(segment: string): string {
  // Handle custom labels
  if (customLabels[segment]) {
    return customLabels[segment];
  }

  // Handle ID-like segments (UUIDs, numbers)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return 'Details';
  }

  if (/^\d+$/.test(segment)) {
    return 'Item';
  }

  // Convert slug-style to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface BreadcrumbsProps {
  pathname: string;
  className?: string;
}

export default function Breadcrumbs({
  pathname,
  className,
}: BreadcrumbsProps) {
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);

    // Remove 'admin' prefix from display
    const filteredSegments = segments.filter((s) => s !== 'admin');

    if (filteredSegments.length === 0) {
      return [{ label: 'Dashboard', href: '/admin/dashboard' }];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/admin/dashboard' },
    ];

    let href = '/admin';
    const seenHrefs = new Set<string>(['/admin/dashboard']);
    for (const segment of filteredSegments) {
      href += `/${segment}`;
      if (seenHrefs.has(href)) continue;
      seenHrefs.add(href);
      breadcrumbs.push({
        label: getLabel(segment),
        href,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={cn('flex items-center text-sm', className)}>
      <ol className="flex items-center gap-1.5">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = index === 0 ? Home : undefined;

          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {Icon && <Icon className="w-4 h-4 inline mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
