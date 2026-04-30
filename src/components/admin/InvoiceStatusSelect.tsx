'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InvoiceStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

const statusOptions = [
  { value: 'draft', label: 'Draft', description: 'Not yet ready to send' },
  { value: 'pending', label: 'Pending', description: 'Invoice sent, awaiting payment' },
  { value: 'confirmed', label: 'Confirmed', description: 'Booking confirmed' },
  { value: 'partial_payment', label: 'Partial Payment', description: 'Partial payment received' },
  { value: 'paid', label: 'Paid', description: 'Full payment received' },
  { value: 'cancelled', label: 'Cancelled', description: 'Invoice cancelled' },
  { value: 'refund', label: 'Refund', description: 'Refund processed' },
];

export function InvoiceStatusSelect({
  value,
  onChange,
  label = 'Status',
  id = 'status',
  disabled = false,
}: InvoiceStatusSelectProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[10px] font-medium text-muted-foreground">
        {label}
      </Label>
      <Select
        value={value || 'pending'}
        onValueChange={(nextValue) => onChange(nextValue ?? 'pending')}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-[9px] text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
