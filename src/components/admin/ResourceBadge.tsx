'use client';

import { MapPin, User, Phone } from 'lucide-react';

export interface ParsedLogistics {
  name: string;
  phone: string;
  extra: string;
}

interface ResourceBadgeProps {
  type: 'guide' | 'driver';
  data: ParsedLogistics | null;
}

export function ResourceBadge({ type, data }: ResourceBadgeProps) {
  if (!data) return null;

  const config = type === 'guide'
    ? {
        icon: MapPin,
        label: 'Guide',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
      }
    : {
        icon: User,
        label: 'Driver',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        textColor: 'text-amber-700 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800',
      };

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{data.name}</span>
      {data.phone && (
        <>
          <span className="text-xs opacity-60">•</span>
          <a
            href={`tel:${data.phone}`}
            className="text-xs hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            {data.phone}
          </a>
        </>
      )}
    </div>
  );
}

/**
 * Parse logistics details from TEXT field
 * Expected format: "Name, Phone, License/Plate"
 */
export function parseLogistics(details: string | null | undefined): ParsedLogistics | null {
  if (!details) return null;

  const parts = details.split(',').map(s => s.trim());
  return {
    name: parts[0] || '',
    phone: parts[1] || '',
    extra: parts[2] || '',
  };
}
