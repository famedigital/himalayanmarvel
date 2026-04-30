'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCompanySettings } from '@/lib/hooks/useCompanySettings';
import {
  IndianRupee,
  Building2,
  Wallet,
  CreditCard,
  Receipt,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  guestName: string;
  tourName: string;
  totalAmount: number;
  currency: string;
  advanceAmount: number;
  onSuccess?: () => void;
}

export function AdvancePaymentModal({
  isOpen,
  onClose,
  bookingId,
  guestName,
  tourName,
  totalAmount,
  currency,
  advanceAmount,
  onSuccess,
}: AdvancePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: advanceAmount,
    payment_method: 'bank_transfer',
    transaction_id: '',
    notes: '',
    receipt_url: '',
  });
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      loadCompanySettings();
      setFormData(prev => ({ ...prev, amount: advanceAmount }));
    }
  }, [isOpen, advanceAmount]);

  const loadCompanySettings = async () => {
    try {
      const settings = await getCompanySettings();
      setCompanySettings(settings);
    } catch (error) {
      console.error('Error loading company settings:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}/receipts/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, receipt_url: data.publicUrl }));
      toast.success('Receipt uploaded successfully');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error('Failed to upload receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (formData.amount > advanceAmount) {
      toast.error(`Amount cannot exceed advance due (${currency} ${advanceAmount.toLocaleString('en-IN')})`);
      return;
    }

    if (formData.payment_method === 'bank_transfer' && !formData.transaction_id) {
      toast.error('Please enter transaction ID for bank transfer');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('payments').insert({
        booking_id: bookingId,
        amount: formData.amount,
        currency: currency,
        payment_type: 'advance',
        payment_method: formData.payment_method,
        status: 'completed',
        transaction_id: formData.transaction_id || null,
        notes: formData.notes || null,
        receipt_url: formData.receipt_url || null,
        payment_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Advance payment recorded successfully');
      onSuccess?.();
      onClose();
      setFormData({
        amount: advanceAmount,
        payment_method: 'bank_transfer',
        transaction_id: '',
        notes: '',
        receipt_url: '',
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBankDetails = () => {
    if (!companySettings?.bank_details) return null;

    const currencyKey = currency === 'INR' ? 'INR' : currency === 'USD' ? 'USD' : 'EUR';
    return companySettings.bank_details[currencyKey];
  };

  const bankDetails = getBankDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Record Advance Payment
          </DialogTitle>
          <DialogDescription>
            Mark advance payment as received for {guestName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Guest</p>
                  <p className="font-medium text-sm">{guestName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tour</p>
                  <p className="font-medium text-sm line-clamp-1">{tourName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-semibold text-sm">
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
                    {totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Advance Due</p>
                  <p className="font-semibold text-sm text-amber-600">
                    {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
                    {advanceAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details for Reference */}
          {bankDetails && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Bank Details for Payment Reference</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currency}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
                  {bankDetails.bank_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium">{bankDetails.bank_name}</span>
                    </div>
                  )}
                  {bankDetails.account_number && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{bankDetails.account_number}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(bankDetails.account_number, 'Account number')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {bankDetails.ifsc && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">IFSC:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{bankDetails.ifsc}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(bankDetails.ifsc, 'IFSC code')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {bankDetails.swift && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SWIFT:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{bankDetails.swift}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(bankDetails.swift, 'SWIFT code')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {bankDetails.branch && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="font-medium">{bankDetails.branch}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Received *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    className="pl-9"
                    min={0}
                    max={advanceAmount}
                    step={0.01}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum: {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{' '}
                  {advanceAmount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => handleInputChange('payment_method', value)}
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        UPI
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Card
                      </div>
                    </SelectItem>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.payment_method === 'bank_transfer' && (
              <div className="space-y-2">
                <Label htmlFor="transaction_id">Transaction ID / Reference Number *</Label>
                <Input
                  id="transaction_id"
                  value={formData.transaction_id}
                  onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                  placeholder="Enter transaction ID"
                  className="font-mono"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any notes about this payment..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt Upload (Optional)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  disabled={uploadingReceipt}
                  className="relative"
                >
                  {uploadingReceipt ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploadingReceipt ? 'Uploading...' : 'Upload Receipt'}
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </Button>
                {formData.receipt_url && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Receipt uploaded
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(formData.receipt_url, '_blank')}
                    >
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Recording Payment...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Record Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
