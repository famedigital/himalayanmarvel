/**
 * Single invoice API — get / update / soft-delete
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('invoices')
      .select(
        `
        *,
        itineraries (
          id,
          title,
          guest_names
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.invoice_data !== undefined) {
      updateData.invoice_data = body.invoice_data;
      if (body.invoice_data?.invoice_number) {
        updateData.invoice_number = body.invoice_data.invoice_number;
      }
    }
    if (body.invoice_number !== undefined) updateData.invoice_number = body.invoice_number;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.share_token !== undefined) updateData.share_token = body.share_token;
    if (body.itinerary_id !== undefined) updateData.itinerary_id = body.itinerary_id;

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update invoice';
    console.error('Error updating invoice:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
