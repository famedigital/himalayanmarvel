import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('operation_transport_assignments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching transport assignments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transport assignments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('operation_transport_assignments')
      .insert({
        booking_id: bookingId,
        ...body,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating transport assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transport assignment' },
      { status: 500 }
    );
  }
}
