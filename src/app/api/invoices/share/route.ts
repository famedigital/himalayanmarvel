import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { itinerary_id, invoice_data } = body;

    if (!itinerary_id || !invoice_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique share token
    const token = generateShareToken();

    // Store invoice in database
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        itinerary_id,
        invoice_number: invoice_data.invoice_number,
        invoice_data,
        share_token: token,
        status: 'sent',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist, provide helpful error
      if (error.code === '42P01') {
        return NextResponse.json(
          {
            error: 'Invoices table not found. Please run the database migration script.',
            hint: 'Create invoices table using scripts/setup-invoices-table.sql'
          },
          { status: 500 }
        );
      }
      throw error;
    }

    // Generate share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${token}`;

    return NextResponse.json({
      success: true,
      share_url: shareUrl,
      token,
      invoice_id: invoice.id,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}

function generateShareToken(): string {
  // Generate a secure random token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
