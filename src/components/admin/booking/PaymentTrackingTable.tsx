'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Calendar, CreditCard, Wallet, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_type: 'advance' | 'installment' | 'full';
  payment_method: 'bank_transfer' | 'upi' | 'card' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  notes?: string;
  receipt_url?: string;
  payment_date?: string;
  created_at: string;
}

interface PaymentTrackingTableProps {
  bookingId: string;
  totalAmount: number;
  currency: string;
  advanceAmount?: number;
  onRefresh?: () => void;
}

export function PaymentTrackingTable({
  bookingId,
  totalAmount,
  currency,
  advanceAmount,
  onRefresh,
}: PaymentTrackingTableProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPayments();
  }, [bookingId]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingBalance = () => {
    return totalAmount - getTotalPaid();
  };

  const getPaymentProgress = () => {
    const paid = getTotalPaid();
    return totalAmount > 0 ? (paid / totalAmount) * 100 : 0;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { icon: any; label: string; className: string }> = {
      completed: {
        icon: CheckCircle2,
        label: 'Completed',
        className: 'bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400',
      },
      pending: {
        icon: Clock,
        label: 'Pending',
        className: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
      },
      failed: {
        icon: XCircle,
        label: 'Failed',
        className: 'bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400',
      },
    };

    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={cn('gap-1 text-xs', variant.className)}>
        <Icon className="w-3 h-3" />
        {variant.label}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, any> = {
      bank_transfer: Building2,
      upi: Wallet,
      card: CreditCard,
      cash: Wallet,
      other: AlertCircle,
    };

    const Icon = icons[method] || AlertCircle;
    return <Icon className="w-4 h-4 text-muted-foreground" />;
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      advance: 'Advance Payment',
      installment: 'Installment',
      full: 'Full Payment',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPaid = getTotalPaid();
  const remainingBalance = getRemainingBalance();
  const progress = getPaymentProgress();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Payment History</span>
          <Badge variant="outline" className="text-xs">
            {payments.length} payment{payments.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <IndianRupee className="w-3 h-3" />
              Total Amount
            </div>
            <p className="text-xl font-semibold">
              {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
              {totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 text-xs mb-1">
              <CheckCircle2 className="w-3 h-3" />
              Amount Paid
            </div>
            <p className="text-xl font-semibold text-green-700 dark:text-green-400">
              {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
              {totalPaid.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 text-xs mb-1">
              <AlertCircle className="w-3 h-3" />
              Remaining
            </div>
            <p className={cn(
              'text-xl font-semibold',
              remainingBalance > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'
            )}>
              {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
              {remainingBalance.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Payment Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                progress >= 100
                  ? 'bg-green-600'
                  : progress >= 50
                  ? 'bg-blue-600'
                  : 'bg-amber-600'
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Payments Table */}
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No payments recorded yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : new Date(payment.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {getPaymentTypeLabel(payment.payment_type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-sm font-semibold">
                      {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
                      {payment.amount.toLocaleString('en-IN')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span className="text-sm capitalize">{payment.payment_method.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {payment.transaction_id ? (
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {payment.transaction_id}
                      </code>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.notes ? (
                      <span className="text-xs text-muted-foreground max-w-[150px] truncate block">
                        {payment.notes}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">
                  Total Payments ({payments.length})
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono font-bold">
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
                    {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
                  </span>
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
