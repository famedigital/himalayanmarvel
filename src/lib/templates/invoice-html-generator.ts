/**
 * Invoice HTML Generator for Itineraries
 * Generates HTML invoice based on itinerary data and the Sekar invoice template
 * Server-side rendering (no client-side JavaScript)
 */

import { getCompanySettings } from '@/lib/hooks/useCompanySettings';

export interface ItineraryInvoiceData {
  // Invoice metadata
  invoice_number: string;
  invoice_date: string;

  // Company info (can be customized)
  company_name?: string;
  company_location?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;

  // Guest details from itinerary
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;

  // Package details from itinerary
  package_name: string;
  package_duration?: string;
  travel_dates?: string;
  destination?: string;
  highlights?: string[];

  // Pricing from itinerary.pricing
  currency?: string;
  currency_symbol?: string;
  subtotal?: number;
  advance_payment: number;
  total_amount: number;
  balance_due?: number;
  inclusions?: string[];
  exclusions?: string[];

  // Payment details
  payment_due_date?: string;
  qr_code_url?: string;
  bank_name?: string;
  account_name?: string;

  // Terms from itinerary.terms
  terms?: string;
  booking_payment?: string;
  cancellation_policy?: string;
}

export interface ItineraryInvoiceItem {
  description: string;
  subtext?: string;
  duration: string;
  amount: string;
}

/**
 * Calculate duration from dates
 */
function calculateDuration(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} Days / ${days - 1} Nights`;
}

/**
 * Format date range
 */
function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const options = { day: 'numeric', month: 'short', year: 'numeric' } as const;
  return `${new Date(startDate).toLocaleDateString('en-IN', options)} - ${new Date(endDate).toLocaleDateString('en-IN', options)}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Generate invoice HTML from itinerary data
 */
export async function generateItineraryInvoiceHTML(data: ItineraryInvoiceData): Promise<string> {
  // Fetch company settings from database
  const settings = await getCompanySettings();

  const currency = (data.currency as 'INR' | 'USD' | 'EUR') || 'INR';
  const bankDetails = settings?.bank_details?.[currency] || settings?.bank_details?.INR;

  const {
    invoice_number,
    invoice_date,
    company_name = settings?.company_name || 'HIMALAYAN MARVELS',
    company_location = settings?.address || 'Thimphu, Bhutan',
    company_phone = settings?.mobile || '+975 17111111',
    company_email = settings?.email || 'info@himalayanmarvels.com',
    company_website = settings?.website || 'www.himalayanmarvels.com',
    guest_name,
    package_name,
    package_duration,
    travel_dates,
    destination,
    highlights,
    inclusions,
    exclusions,
    currency: invoiceCurrency = 'INR',
    currency_symbol = '₹',
    advance_payment,
    total_amount,
    balance_due,
    qr_code_url,
    bank_name = bankDetails?.bank_name || 'Bhutan National Bank',
    account_name = settings?.company_name || 'Himalayan Marvels Tours & Treks',
    terms,
    booking_payment,
    cancellation_policy,
  } = data;

  // Build payment terms
  const paymentTerms = booking_payment || cancellation_policy
    ? `${booking_payment || ''} ${cancellation_policy || ''}`.trim()
    : terms || 'Full refund of advance if cancelled 3+ days before payment.';

  // Check if Tiger's Nest is included
  const hasTigerNest = highlights?.some(h =>
    h.toLowerCase().includes('tiger') ||
    h.toLowerCase().includes('nest') ||
    h.toLowerCase().includes('trek')
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice_number} | ${company_name}</title>
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
                <h1>${company_name}</h1>
                <p>Tours & Treks</p>
                <p style="font-size: 9px; color: #999; margin-top: 4px;">${company_location}</p>
                <p style="font-size: 9px; color: #999;">${company_phone} | ${company_email}</p>
            </div>
            <div class="invoice-details">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">${invoice_number}</div>
                <p style="font-size: 9px; color: #999; margin-top: 4px;">Date: ${invoice_date}</p>
            </div>
        </div>

        <!-- Guest Details -->
        <div class="section">
            <div class="section-label">Bill To</div>
            <div class="guest-details">
                <div class="detail-box">
                    <p><strong>Guest:</strong> ${guest_name}</p>
                    <p><strong>Package:</strong> ${package_name}</p>
                    ${package_duration ? `<p><strong>Duration:</strong> ${package_duration}</p>` : ''}
                </div>
                <div class="detail-box" style="text-align: right;">
                    ${travel_dates ? `<p><strong>Travel Dates:</strong> ${travel_dates}</p>` : ''}
                    ${destination ? `<p><strong>Destination:</strong> ${destination}</p>` : ''}
                    ${hasTigerNest ? '<p style="color: var(--forest-green); font-weight: 700;">✓ Tiger\'s Nest Trek Included</p>' : ''}
                </div>
            </div>
        </div>

        <!-- Package Details -->
        <div class="section">
            <div class="section-label">Package Inclusions</div>
            <table class="invoice-table">
                <tr>
                    <th width="60%">Description</th>
                    <th width="40%" class="amount">Status</th>
                </tr>
                ${inclusions && inclusions.length > 0 ? inclusions.map((inclusion, index) => `
                <tr>
                    <td>${escapeHtml(inclusion)}</td>
                    <td class="amount">Included</td>
                </tr>
                `).join('') : `
                <tr>
                    <td>
                        <strong>Accommodation</strong><br>
                        <span style="font-size: 9px; color: #666;">Premium hotels throughout your journey</span>
                    </td>
                    <td class="amount">Included</td>
                </tr>
                <tr>
                    <td><strong>Premium Transport</strong><br><span style="font-size: 9px; color: #666;">SUV with experienced driver</span></td>
                    <td class="amount">Included</td>
                </tr>
                <tr>
                    <td><strong>English-Speaking Guide</strong><br><span style="font-size: 9px; color: #666;">Professional guide throughout journey</span></td>
                    <td class="amount">Included</td>
                </tr>
                <tr>
                    <td><strong>Meals</strong><br><span style="font-size: 9px; color: #666;">Daily breakfast & dinner</span></td>
                    <td class="amount">Included</td>
                </tr>
                <tr>
                    <td><strong>All Monument Fees</strong><br><span style="font-size: 9px; color: #666;">Dzongs, Museums, SDF, Visa processing</span></td>
                    <td class="amount">Included</td>
                </tr>
                `}
            </table>
        </div>

        ${exclusions && exclusions.length > 0 ? `
        <!-- Package Exclusions -->
        <div class="section">
            <div class="section-label">Exclusions</div>
            <table class="invoice-table">
                <tr>
                    <th width="60%">Description</th>
                    <th width="40%" class="amount">Status</th>
                </tr>
                ${exclusions.map((exclusion, index) => `
                <tr>
                    <td>${escapeHtml(exclusion)}</td>
                    <td class="amount excluded">Excluded</td>
                </tr>
                `).join('')}
            </table>
        </div>
        ` : ''}

        <!-- Payment Section -->
        <div class="payment-section">
            <h3>💳 PAYMENT REQUIRED</h3>
            <p><strong>Advance Payment:</strong> <span class="payment-highlight">${currency_symbol} ${advance_payment.toLocaleString('en-IN')}</span></p>
            ${balance_due ? `<p style="margin-top: 6px;">This advance confirms your booking. Balance of <strong>${currency_symbol}${balance_due.toLocaleString('en-IN')}</strong> payable upon meeting our team in Thimphu.</p>` : ''}
            <p style="margin-top: 6px; font-size: 9px;"><strong>Total Package Cost:</strong> ${currency_symbol} ${total_amount.toLocaleString('en-IN')} ${currency}</p>
        </div>

        ${qr_code_url ? `
        <!-- QR Code -->
        <div class="qr-section">
            <div class="qr-info">
                <h4>SCAN TO PAY</h4>
                <p><strong>Bank:</strong> ${bank_name}</p>
                <p><strong>Account:</strong> ${account_name}</p>
                ${bankDetails?.account_number ? `<p><strong>Account No:</strong> ${bankDetails.account_number}</p>` : ''}
                ${bankDetails?.ifsc ? `<p><strong>IFSC:</strong> ${bankDetails.ifsc}</p>` : ''}
                ${bankDetails?.swift ? `<p><strong>SWIFT:</strong> ${bankDetails.swift}</p>` : ''}
                ${bankDetails?.branch ? `<p><strong>Branch:</strong> ${bankDetails.branch}</p>` : ''}
                <p style="margin-top: 5px; font-size: 8px; color: #666;">Ref: ${invoice_number}</p>
                <p style="font-size: 8px; color: #666;">Methods: G-Pay • Bank Transfer</p>
            </div>
            <div class="qr-code">
                <img src="${qr_code_url}" alt="Payment QR Code">
            </div>
        </div>
        ` : ''}

        <!-- Terms -->
        <div class="terms">
            <strong>Terms & Conditions:</strong>
            ${paymentTerms}
            <p class="note" style="margin-top: 6px;">Booking confirmed upon receipt of advance payment. Travel insurance recommended.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>${company_name} Tours & Treks</strong> | ${company_location}</p>
            <p>${company_phone} | ${company_email} | ${company_website}</p>
        </div>
    </div>

</body>
</html>`;
}

/**
 * Generate invoice data from itinerary record
 */
export async function generateInvoiceDataFromItinerary(itinerary: any, invoiceNumber: string): Promise<ItineraryInvoiceData> {
  const pricing = itinerary.pricing || {};
  const terms = itinerary.terms || {};

  // Calculate duration if dates are available
  let package_duration = '';
  let travel_dates = '';
  if (itinerary.start_date && itinerary.end_date) {
    package_duration = calculateDuration(itinerary.start_date, itinerary.end_date);
    travel_dates = formatDateRange(itinerary.start_date, itinerary.end_date);
  }

  // Calculate balance
  const total_amount = parseFloat(pricing.total?.replace(/[^0-9.]/g, '') || '0');
  const advance_amount = Math.round(total_amount * 0.165); // ~16.5% advance
  const balance_due = total_amount - advance_amount;

  // Build destination from day locations
  const destinations = new Set<string>();
  // This would need to be populated from itinerary_days

  return {
    invoice_number: invoiceNumber,
    invoice_date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    guest_name: itinerary.guest_names || 'Guest',
    package_name: itinerary.title || 'Package',
    package_duration,
    travel_dates,
    currency: pricing.currency || 'INR',
    currency_symbol: pricing.symbol || '₹',
    advance_payment: advance_amount,
    total_amount,
    balance_due,
    highlights: [],
    qr_code_url: '', // Will be set from settings
    booking_payment: terms.booking_payment,
    cancellation_policy: terms.cancellation_policy,
  };
}
