import { jsPDF } from 'jspdf';
import { bankDetails } from './bank-details';

interface MoneyReceiptData {
  receipt_number: string;
  date: string;
  client_name: string;
  amount: number;
  booking_id?: string;
  travel_date?: string;
  no_of_pax?: number;
}

export function generateMoneyReceiptPDF(data: MoneyReceiptData): jsPDF {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Colors
  const primaryColor = { r: 234, g: 88, b: 12 }; // Orange
  const textColor = { r: 17, g: 24, b: 39 }; // Dark gray

  // Header
  pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Logo text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HIMALAYAN MARVELS', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Bhutan Tours & Expeditions', pageWidth / 2, 28, { align: 'center' });

  yPosition = 55;

  // Title
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MONEY RECEIPT', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  // Receipt Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Receipt No: ${data.receipt_number}`, 20, yPosition);
  pdf.text(`Date: ${data.date}`, pageWidth - 20, yPosition, { align: 'right' });

  yPosition += 20;

  // Divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Bill To Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BILL TO:', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.client_name, 20, yPosition);

  yPosition += 20;

  // Payment Details Table Header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');
  yPosition += 5;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESCRIPTION', 25, yPosition);
  pdf.text('AMOUNT (USD)', pageWidth - 25, yPosition, { align: 'right' });

  yPosition += 8;

  // Table content
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  const description = `Tour Booking Payment${data.no_of_pax ? ` (${data.no_of_pax} pax)` : ''}`;
  pdf.text(description, 25, yPosition);
  pdf.text(`${data.amount.toLocaleString()}.00`, pageWidth - 25, yPosition, { align: 'right' });

  yPosition += 5;

  if (data.travel_date) {
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Travel Date: ${data.travel_date}`, 25, yPosition);
    yPosition += 5;
  }

  if (data.booking_id) {
    pdf.text(`Booking ID: ${data.booking_id}`, 25, yPosition);
    yPosition += 8;
  } else {
    yPosition += 3;
  }

  pdf.setTextColor(textColor.r, textColor.g, textColor.b);

  // Total
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', 25, yPosition);
  pdf.text(`${data.amount.toLocaleString()}.00`, pageWidth - 25, yPosition, { align: 'right' });

  yPosition += 20;

  // Bank Details Section
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT MADE TO:', 20, yPosition);
  yPosition += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Bank: ${bankDetails.bank_name}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`Account Name: ${bankDetails.account_name}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`Account Number: ${bankDetails.account_number}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`SWIFT Code: ${bankDetails.swift_code}`, 25, yPosition);

  yPosition += 20;

  // Terms
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  const terms = [
    'This is a computer-generated receipt.',
    'For any queries, please contact us at info@himalayanmarvels.com',
    'Thank you for your payment!',
  ];

  terms.forEach((term) => {
    pdf.text(term, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
  });

  // Signature Section
  yPosition = pageHeight - 40;
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.line(20, yPosition, 80, yPosition);
  pdf.text('Authorized Signature', 50, yPosition + 5, { align: 'center' });

  pdf.line(pageWidth - 80, yPosition, pageWidth - 20, yPosition);
  pdf.text('Client Signature', pageWidth - 50, yPosition + 5, { align: 'center' });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    'Himalayan Marvels | Thimphu, Bhutan | +975 77 270 465 | info@himalayanmarvels.com',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return pdf;
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MR-${timestamp}-${random}`;
}
