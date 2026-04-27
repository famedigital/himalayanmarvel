/**
 * Single Invoice API Endpoint
 * Handles individual invoice operations
 *
 * GET /api/admin/invoices/[id] - Get invoice by ID
 * PUT /api/admin/invoices/[id] - Update invoice
 * DELETE /api/admin/invoices/[id] - Delete invoice
 */

import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch invoice',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createClient();

    const updateData: any = {
      guest_name: body.guest_name,
      guest_email: body.guest_email,
      guest_phone: body.guest_phone,
      package_name: body.package_name,
      package_duration: body.package_duration,
      travel_dates: body.travel_dates,
      destination: body.destination,
      subtotal: body.subtotal,
      tax_amount: body.tax_amount,
      discount_amount: body.discount_amount,
      total_amount: body.total_amount,
      advance_payment: body.advance_payment,
      balance_due: (body.total_amount || 0) - (body.advance_payment || 0),
      payment_status: body.payment_status,
      payment_method: body.payment_method,
      payment_due_date: body.payment_due_date,
      invoice_template: body.invoice_template,
      qr_code_url: body.qr_code_url,
      terms: body.terms,
      status: body.status,
      notes: body.notes,
      internal_notes: body.internal_notes,
    };

    // Handle status updates
    if (body.status === 'sent' && !body.sent_date) {
      updateData.sent_date = new Date().toISOString();
    }
    if (body.status === 'paid' && !body.paid_date) {
      updateData.paid_date = new Date().toISOString();
    }
    if (body.status === 'viewed' && !body.viewed_date) {
      updateData.viewed_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update invoice',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const { error } = await supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete invoice',
      },
      { status: 500 }
    );
  }
}
