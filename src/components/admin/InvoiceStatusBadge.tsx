'use client';

import { Badge } from '@/components/ui/badge';

interface InvoiceStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20',
  },
  refund: {
    label: 'Refund',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
  },
  partial_payment: {
    label: 'Partial Payment',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20',
  },
  sent: {
    label: 'Sent',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  },
  viewed: {
    label: 'Viewed',
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20',
  },
};

export function InvoiceStatusBadge({ status, className = '' }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;

  return (
    <Badge
      variant="outline"
      className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 ${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
