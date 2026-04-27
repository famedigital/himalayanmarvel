/**
 * Invoices API Endpoint
 * Handles CRUD operations for invoices
 *
 * GET /api/admin/invoices - List all invoices
 * POST /api/admin/invoices - Create new invoice
 */

import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('payment_status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      meta: {
        limit,
        offset,
        count: data?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch invoices',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Generate invoice number if not provided
    let invoiceNumber = body.invoice_number;
    if (!invoiceNumber) {
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('invoice_number')
        .order('created_at', { ascending: false })
        .limit(1);

      const lastNum = lastInvoice?.[0]?.invoice_number || 'HMM/2025/0000';
      const year = new Date().getFullYear();
      const prefix = `HMM/${year}/`;

      if (!lastNum.startsWith(prefix)) {
        invoiceNumber = `${prefix}0001`;
      } else {
        const lastSeq = parseInt(lastNum.split('/').pop() || '0');
        invoiceNumber = `${prefix}${String(lastSeq + 1).padStart(4, '0')}`;
      }
    }

    const invoiceData = {
      invoice_number: invoiceNumber,
      booking_id: body.booking_id || null,
      guest_name: body.guest_name,
      guest_email: body.guest_email || null,
      guest_phone: body.guest_phone || null,
      package_name: body.package_name,
      package_duration: body.package_duration || null,
      travel_dates: body.travel_dates || null,
      destination: body.destination || null,
      subtotal: body.subtotal || 0,
      tax_amount: body.tax_amount || 0,
      discount_amount: body.discount_amount || 0,
      total_amount: body.total_amount,
      advance_payment: body.advance_payment || 0,
      balance_due: (body.total_amount || 0) - (body.advance_payment || 0),
      payment_status: body.payment_status || 'pending',
      payment_method: body.payment_method || null,
      payment_due_date: body.payment_due_date || null,
      invoice_template: body.invoice_template,
      qr_code_url: body.qr_code_url || null,
      terms: body.terms || null,
      status: body.status || 'draft',
      notes: body.notes || null,
      internal_notes: body.internal_notes || null,
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
}
