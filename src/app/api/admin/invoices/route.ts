/**
 * Invoices API — list & create
 * Schema: itinerary_id, invoice_number, invoice_data (JSONB), share_token, status
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const itineraryId = searchParams.get('itinerary_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (itineraryId) query = query.eq('itinerary_id', itineraryId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      meta: { limit, offset, count: data?.length || 0 },
    });
  } catch (error: unknown) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!body.itinerary_id || !body.invoice_data) {
      return NextResponse.json(
        { success: false, error: 'itinerary_id and invoice_data are required' },
        { status: 400 }
      );
    }

    let invoiceNumber = body.invoice_number || body.invoice_data?.invoice_number;
    if (!invoiceNumber) {
      const year = new Date().getFullYear();
      const prefix = `HMM/${year}/`;
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('invoice_number')
        .like('invoice_number', `${prefix}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      const lastNum = lastInvoice?.[0]?.invoice_number;
      if (!lastNum) {
        invoiceNumber = `${prefix}0001`;
      } else {
        const lastSeq = parseInt(lastNum.split('/').pop() || '0', 10);
        invoiceNumber = `${prefix}${String(lastSeq + 1).padStart(4, '0')}`;
      }
    }

    const invoiceData = {
      ...body.invoice_data,
      invoice_number: invoiceNumber,
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          itinerary_id: body.itinerary_id,
          invoice_number: invoiceNumber,
          invoice_data: invoiceData,
          share_token: body.share_token || generateShareToken(),
          status: body.status || 'draft',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create invoice';
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
