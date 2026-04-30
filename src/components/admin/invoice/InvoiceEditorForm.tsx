'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ItineraryInvoiceData } from '@/lib/templates/invoice-html-generator';
import { InvoiceStatusSelect } from '@/components/admin/InvoiceStatusSelect';

interface InvoiceEditorFormProps {
  data: ItineraryInvoiceData;
  onChange: (data: ItineraryInvoiceData) => void;
  status?: string;
  onStatusChange?: (status: string) => void;
  isLoadingExisting?: boolean;
}

export function InvoiceEditorForm({ data, onChange, status = 'draft', onStatusChange, isLoadingExisting = false }: InvoiceEditorFormProps) {
  const updateField = <K extends keyof ItineraryInvoiceData>(field: K, value: ItineraryInvoiceData[K]) => {
    const newData = { ...data, [field]: value };

    // Auto-calculate balance due when total or advance changes
    if (field === 'total_amount' || field === 'advance_payment') {
      const total = typeof newData.total_amount === 'number' ? newData.total_amount : parseFloat(newData.total_amount as string) || 0;
      const advance = typeof newData.advance_payment === 'number' ? newData.advance_payment : parseFloat(newData.advance_payment as string) || 0;
      newData.balance_due = total - advance;
    }

    onChange(newData);
  };

  return (
    <div className="space-y-3">
      {/* Invoice Details Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-amber-500 rounded-full"></span>
          Invoice Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="invoice_number" className="text-[10px] font-medium text-muted-foreground">Invoice Number</Label>
            <Input
              id="invoice_number"
              value={data.invoice_number}
              onChange={(e) => updateField('invoice_number', e.target.value)}
              className="font-mono text-xs h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="invoice_date" className="text-[10px] font-medium text-muted-foreground">Invoice Date</Label>
            <Input
              id="invoice_date"
              type="date"
              value={data.invoice_date}
              onChange={(e) => updateField('invoice_date', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          {onStatusChange && (
            <div className="sm:col-span-2">
              <InvoiceStatusSelect
                value={status}
                onChange={onStatusChange}
                label="Invoice Status"
                id="invoice_status"
                disabled={isLoadingExisting}
              />
            </div>
          )}
        </div>
      </section>

      {/* Guest Details Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-blue-500 rounded-full"></span>
          Guest Details
        </h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="guest_name" className="text-[10px] font-medium text-muted-foreground">Guest Name</Label>
            <Input
              id="guest_name"
              value={data.guest_name}
              onChange={(e) => updateField('guest_name', e.target.value)}
              placeholder="John Doe"
              className="h-8 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="guest_email" className="text-[10px] font-medium text-muted-foreground">Email</Label>
              <Input
                id="guest_email"
                type="email"
                value={data.guest_email || ''}
                onChange={(e) => updateField('guest_email', e.target.value)}
                placeholder="guest@example.com"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="guest_phone" className="text-[10px] font-medium text-muted-foreground">Phone</Label>
              <Input
                id="guest_phone"
                type="tel"
                value={data.guest_phone || ''}
                onChange={(e) => updateField('guest_phone', e.target.value)}
                placeholder="+975 1 234567"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Package Details Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-green-500 rounded-full"></span>
          Package Details
        </h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="package_name" className="text-[10px] font-medium text-muted-foreground">Package Name</Label>
            <Input
              id="package_name"
              value={data.package_name}
              onChange={(e) => updateField('package_name', e.target.value)}
              placeholder="Bhutan Cultural Journey"
              className="h-8 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="package_duration" className="text-[10px] font-medium text-muted-foreground">Duration</Label>
              <Input
                id="package_duration"
                value={data.package_duration || ''}
                onChange={(e) => updateField('package_duration', e.target.value)}
                placeholder="7 Days / 6 Nights"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="travel_dates" className="text-[10px] font-medium text-muted-foreground">Travel Dates</Label>
              <Input
                id="travel_dates"
                value={data.travel_dates || ''}
                onChange={(e) => updateField('travel_dates', e.target.value)}
                placeholder="16 May - 22 May, 2026"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="destination" className="text-[10px] font-medium text-muted-foreground">Destination</Label>
            <Input
              id="destination"
              value={data.destination || ''}
              onChange={(e) => updateField('destination', e.target.value)}
              placeholder="Bhutan"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-purple-500 rounded-full"></span>
          Pricing
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="currency" className="text-[10px] font-medium text-muted-foreground">Currency</Label>
              <Select
                value={data.currency || 'INR'}
                onValueChange={(value) => {
                  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };
                  updateField('currency', value || 'INR');
                  updateField('currency_symbol', symbols[value || 'INR'] || '₹');
                }}
              >
                <SelectTrigger id="currency" className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="total_amount" className="text-[10px] font-medium text-muted-foreground">Total Amount</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {data.currency_symbol || '₹'}
                </span>
                <Input
                  id="total_amount"
                  type="number"
                  value={data.total_amount}
                  onChange={(e) => updateField('total_amount', parseFloat(e.target.value) || 0)}
                  className="pl-7 h-8 text-xs"
                  placeholder="15000"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="advance_payment" className="text-[10px] font-medium text-muted-foreground">Advance Payment</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {data.currency_symbol || '₹'}
                </span>
                <Input
                  id="advance_payment"
                  type="number"
                  value={data.advance_payment}
                  onChange={(e) => updateField('advance_payment', parseFloat(e.target.value) || 0)}
                  className="pl-7 h-8 text-xs"
                  placeholder="5000"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="balance_due" className="text-[10px] font-medium text-muted-foreground">Balance Due</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {data.currency_symbol || '₹'}
                </span>
                <Input
                  id="balance_due"
                  type="number"
                  value={data.balance_due || 0}
                  readOnly
                  className="pl-7 h-8 text-xs bg-muted"
                />
              </div>
              <p className="text-[9px] text-muted-foreground">Auto-calculated</p>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="payment_due_date" className="text-[10px] font-medium text-muted-foreground">Payment Due Date</Label>
            <Input
              id="payment_due_date"
              type="date"
              value={data.payment_due_date || ''}
              onChange={(e) => updateField('payment_due_date', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-orange-500 rounded-full"></span>
          Terms & Conditions
        </h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="booking_payment" className="text-[10px] font-medium text-muted-foreground">Booking Payment Terms</Label>
            <Textarea
              id="booking_payment"
              value={data.booking_payment || ''}
              onChange={(e) => updateField('booking_payment', e.target.value)}
              rows={2}
              placeholder="A 50% non-refundable deposit is required to confirm the booking..."
              className="resize-none text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cancellation_policy" className="text-[10px] font-medium text-muted-foreground">Cancellation Policy</Label>
            <Textarea
              id="cancellation_policy"
              value={data.cancellation_policy || ''}
              onChange={(e) => updateField('cancellation_policy', e.target.value)}
              rows={2}
              placeholder="Cancellations made 30 days prior to arrival..."
              className="resize-none text-xs"
            />
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions Section */}
      <section className="bg-card rounded-lg border border-border p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-teal-500 rounded-full"></span>
          Inclusions & Exclusions
        </h2>

        {/* Inclusions */}
        <div className="space-y-2 mb-3">
          <div className="space-y-1">
            <Label htmlFor="inclusions" className="text-[10px] font-medium text-muted-foreground">
              Package Inclusions
            </Label>
            <Textarea
              id="inclusions"
              value={data.inclusions?.join('\n') || ''}
              onChange={(e) => updateField('inclusions', e.target.value.split('\n').filter(Boolean))}
              rows={3}
              placeholder="Enter each inclusion on a new line"
              className="resize-none text-xs"
            />
          </div>
        </div>

        {/* Exclusions */}
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="exclusions" className="text-[10px] font-medium text-muted-foreground">
              Package Exclusions
            </Label>
            <Textarea
              id="exclusions"
              value={data.exclusions?.join('\n') || ''}
              onChange={(e) => updateField('exclusions', e.target.value.split('\n').filter(Boolean))}
              rows={2}
              placeholder="Enter each exclusion on a new line"
              className="resize-none text-xs"
            />
          </div>
        </div>
      </section>

      {/* Bank Details Section */}
      <section className="bg-amber-500/5 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-800/30 p-3 shadow-sm">
        <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1.5 flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Bank Details
        </h2>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Bank details will be added to the invoice based on the selected currency.
        </p>
        <a
          href="/admin/bank-details"
          className="text-[10px] font-medium text-amber-800 dark:text-amber-400 hover:underline inline-flex items-center gap-1 mt-1"
        >
          Configure in Settings → Bank Details
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      {/* Extra padding at bottom for scroll */}
      <div className="h-6"></div>
    </div>
  );
}
