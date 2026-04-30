'use client';

import { Filter, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvoiceStatusFilterProps {
  currentFilter: string;
  onFilterChange: (status: string) => void;
  counts?: Record<string, number>;
}

const statusOptions = [
  { value: 'all', label: 'All Invoices', color: 'text-gray-700 dark:text-gray-300' },
  { value: 'pending', label: 'Pending', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'confirmed', label: 'Confirmed', color: 'text-green-600 dark:text-green-400' },
  { value: 'partial_payment', label: 'Partial Payment', color: 'text-blue-600 dark:text-blue-400' },
  { value: 'paid', label: 'Paid', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600 dark:text-red-400' },
  { value: 'refund', label: 'Refund', color: 'text-orange-600 dark:text-orange-400' },
  { value: 'draft', label: 'Draft', color: 'text-gray-500 dark:text-gray-400' },
];

export function InvoiceStatusFilter({ currentFilter, onFilterChange, counts }: InvoiceStatusFilterProps) {
  const currentLabel = statusOptions.find(opt => opt.value === currentFilter)?.label || 'All Invoices';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2 h-8 text-xs')}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>{currentLabel}</span>
        {currentFilter !== 'all' && (
          <X
            className="w-3 h-3 ml-1 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onFilterChange('all');
            }}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex items-center justify-between ${
              currentFilter === option.value ? 'bg-accent' : ''
            }`}
          >
            <span className={option.color}>{option.label}</span>
            {counts && counts[option.value] !== undefined && (
              <span className="text-xs text-muted-foreground ml-2">
                {counts[option.value]}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
