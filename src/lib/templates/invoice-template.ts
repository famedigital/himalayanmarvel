/**
 * Invoice Template Generator
 * Generates HTML invoice templates based on data
 * Based on the Sekhar family invoice sample
 */

import { getCompanySettings } from '@/lib/hooks/useCompanySettings';

interface InvoiceData {
  invoice_number: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  package_name: string;
  package_duration?: string;
  travel_dates?: string;
  destination?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  advance_payment: number;
  balance_due: number;
  payment_due_date?: string;
  qr_code_url?: string;
  terms?: string;
  items?: InvoiceItem[];
  currency?: 'INR' | 'USD' | 'EUR';
}

interface InvoiceItem {
  description: string;
  duration?: string;
  amount?: string;
}

export async function generateInvoiceHTML(data: InvoiceData): Promise<string> {
  // Fetch company settings from database
  const settings = await getCompanySettings();

  const currency = data.currency || 'INR';
  const bankDetails = settings?.bank_details?.[currency] || settings?.bank_details?.INR;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const items = data.items || [
    {
      description: 'Accommodation\n<span style="font-size: 9px; color: #666;">Premium hotels & resorts throughout Bhutan</span>',
      duration: `${data.package_duration || 'N/A'}`,
      amount: 'Included',
    },
    {
      description: 'Premium Transport\n<span style="font-size: 9px; color: #666;">Toyota Prado or similar luxury SUV</span>',
      duration: 'All Days',
      amount: 'Included',
    },
    {
      description: 'English-Speaking Guide\n<span style="font-size: 9px; color: #666;">Professional, licensed guide throughout your journey</span>',
      duration: 'All Days',
      amount: 'Included',
    },
    {
      description: 'Meals\n<span style="font-size: 9px; color: #666;">Daily breakfast & dinner included</span>',
      duration: 'All Days',
      amount: 'Included',
    },
    {
      description: 'All Monument Fees\n<span style="font-size: 9px; color: #666;">Tiger\'s Nest, Dzongs, Museums, SDF, Visa processing</span>',
      duration: '-',
      amount: 'Included',
    },
  ];

  const defaultTerms = data.terms || `Full refund of advance if cancelled 3+ days before payment. In rare cases of unforeseen circumstances (accommodation/vehicle/guide issues), we reserve the right to provide comparable alternatives. Your comfort remains our priority.
Booking confirmed upon receipt of advance payment. Travel insurance recommended.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${data.invoice_number} | Himalayan Marvels</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap');

        :root {
            --forest-green: #2d5a3d;
            --dark-brown: #4a3728;
            --gold: #c9a961;
            --gray-light: #f5f5f5;
            --gray-border: #ddd;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            background: #e8e8e8;
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .invoice-container {
            max-width: 210mm;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--forest-green);
        }

        .company-info h1 {
            font-family: 'Montserrat', sans-serif;
            font-size: 20px;
            font-weight: 800;
            color: var(--forest-green);
            margin-bottom: 4px;
        }

        .company-info p {
            font-size: 11px;
            color: var(--dark-brown);
            margin-bottom: 2px;
        }

        .invoice-details {
            text-align: right;
        }

        .invoice-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: var(--dark-brown);
            letter-spacing: 3px;
        }

        .invoice-number {
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            color: var(--gold);
            font-weight: 700;
            margin-top: 2px;
        }

        /* Bill To */
        .section {
            margin-bottom: 12px;
        }

        .section-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 9px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .guest-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .detail-box p {
            font-size: 11px;
            color: var(--dark-brown);
            margin-bottom: 2px;
        }

        .detail-box strong {
            font-weight: 700;
            color: var(--forest-green);
        }

        /* Invoice Table */
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10px;
        }

        .invoice-table th {
            background: var(--forest-green);
            color: #fff;
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .invoice-table td {
            padding: 8px 10px;
            border-bottom: 1px solid var(--gray-border);
            color: var(--dark-brown);
        }

        .invoice-table tr:last-child td {
            border-bottom: none;
        }

        .invoice-table .amount {
            text-align: right;
            font-weight: 700;
            font-family: 'Montserrat', sans-serif;
        }

        /* Payment Box */
        .payment-section {
            background: var(--gray-light);
            padding: 12px;
            border-radius: 4px;
            margin: 15px 0;
        }

        .payment-section h3 {
            font-family: 'Montserrat', sans-serif;
            font-size: 11px;
            color: var(--forest-green);
            margin-bottom: 8px;
        }

        .payment-section p {
            font-size: 10px;
            color: var(--dark-brown);
            line-height: 1.4;
        }

        .payment-highlight {
            font-family: 'Montserrat', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--forest-green);
        }

        /* QR Section */
        .qr-section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
            padding: 20px;
            background: var(--gray-light);
            border-radius: 6px;
            border: 2px solid var(--gold);
        }

        .qr-info {
            flex: 1;
            padding-right: 20px;
        }

        .qr-info h4 {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            margin-bottom: 10px;
            font-weight: 700;
        }

        .qr-info p {
            font-size: 10px;
            color: var(--dark-brown);
            margin-bottom: 4px;
        }

        .qr-code {
            width: 130px;
            height: 130px;
            background: #fff;
            border: 4px solid var(--gold);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .qr-code img {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }

        /* Terms */
        .terms {
            font-size: 8px;
            color: #666;
            line-height: 1.3;
            margin-top: 10px;
            padding: 10px;
            background: var(--gray-light);
            border-radius: 4px;
        }

        .terms strong {
            color: var(--dark-brown);
        }

        /* Footer */
        .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid var(--gray-border);
            text-align: center;
            font-size: 9px;
            color: var(--dark-brown);
        }

        /* Note */
        .note {
            font-size: 8px;
            color: #999;
            font-style: italic;
            margin-top: 2px;
        }

        @media print {
            body {
                background: #fff;
                padding: 0;
            }
            .invoice-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>

    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <h1>${settings?.company_name || 'HIMALAYAN MARVELS'}</h1>
                <p>Tours & Treks</p>
                <p style="font-size: 9px; color: #999; margin-top: 4px;">${settings?.address || 'Thimphu, Bhutan'}</p>
                <p style="font-size: 9px; color: #999;">${settings?.mobile || '+975 17111111'} | ${settings?.email || 'info@himalayanmarvels.com'}</p>
            </div>
            <div class="invoice-details">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">${data.invoice_number}</div>
                <p style="font-size: 9px; color: #999; margin-top: 4px;">Date: ${currentDate}</p>
            </div>
        </div>

        <!-- Guest Details -->
        <div class="section">
            <div class="section-label">Bill To</div>
            <div class="guest-details">
                <div class="detail-box">
                    <p><strong>Guest:</strong> ${data.guest_name}</p>
                    <p><strong>Package:</strong> ${data.package_name}</p>
                    <p><strong>Duration:</strong> ${data.package_duration || 'N/A'}</p>
                </div>
                <div class="detail-box" style="text-align: right;">
                    <p><strong>Travel Dates:</strong> ${data.travel_dates || 'TBD'}</p>
                    <p><strong>Destination:</strong> ${data.destination || 'Bhutan'}</p>
                    <p style="color: var(--forest-green); font-weight: 700;">✓ Himalayan Marvels Exclusive</p>
                </div>
            </div>
        </div>

        <!-- Package Details -->
        <div class="section">
            <div class="section-label">Package Inclusions</div>
            <table class="invoice-table">
                <tr>
                    <th width="50%">Description</th>
                    <th width="25%">Duration</th>
                    <th width="25%" class="amount">Amount</th>
                </tr>
                ${items.map(item => `
                <tr>
                    <td>
                        <strong>${item.description.split('\n')[0]}</strong><br>
                        <span style="font-size: 9px; color: #666;">${item.description.split('\n').slice(1).join('<br>')}</span>
                    </td>
                    <td>${item.duration}</td>
                    <td class="amount">${item.amount}</td>
                </tr>
                `).join('')}
            </table>
        </div>

        <!-- Payment Section -->
        <div class="payment-section">
            <h3>💳 PAYMENT REQUIRED</h3>
            <p><strong>Advance Payment:</strong> <span class="payment-highlight">₹ ${data.advance_payment.toLocaleString('en-IN')}</span></p>
            <p style="margin-top: 6px;">This advance confirms your booking. Balance of <strong>₹${data.balance_due.toLocaleString('en-IN')}</strong> payable upon meeting our team in Thimphu.</p>
            <p style="margin-top: 6px; font-size: 9px;"><strong>Total Package Cost:</strong> ₹ ${data.total_amount.toLocaleString('en-IN')} INR</p>
        </div>

        ${data.qr_code_url ? `
        <!-- QR Code -->
        <div class="qr-section">
            <div class="qr-info">
                <h4>SCAN TO PAY</h4>
                <p><strong>Bank:</strong> ${bankDetails?.bank_name || 'Bhutan National Bank'}</p>
                <p><strong>Account:</strong> ${settings?.company_name || 'Himalayan Marvels Tours & Treks'}</p>
                <p><strong>Account No:</strong> ${bankDetails?.account_number || 'N/A'}</p>
                ${bankDetails?.ifsc ? `<p><strong>IFSC:</strong> ${bankDetails.ifsc}</p>` : ''}
                ${bankDetails?.swift ? `<p><strong>SWIFT:</strong> ${bankDetails.swift}</p>` : ''}
                <p><strong>Branch:</strong> ${bankDetails?.branch || 'Thimphu'}</p>
                <p style="margin-top: 5px; font-size: 8px; color: #666;">Ref: ${data.invoice_number}</p>
                <p style="font-size: 8px; color: #666;">Methods: G-Pay • Bank Transfer</p>
            </div>
            <div class="qr-code">
                <img src="${data.qr_code_url}" alt="Payment QR Code">
            </div>
        </div>
        ` : ''}

        <!-- Terms -->
        <div class="terms">
            <strong>Terms & Conditions:</strong>
            ${defaultTerms}
            <p class="note" style="margin-top: 6px;">Booking confirmed upon receipt of advance payment. Travel insurance recommended.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>${settings?.company_name || 'HIMALAYAN MARVELS'} Tours & Treks</strong> | ${settings?.address || 'Thimphu, Bhutan'}</p>
            <p>${settings?.mobile || '+975 17111111'} | ${settings?.email || 'info@himalayanmarvels.com'} | ${settings?.website || 'www.himalayanmarvels.com'}</p>
        </div>
    </div>

</body>
</html>`;
}
