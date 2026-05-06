import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'bookingId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('operation_hotel_assignments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('check_in_date', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching hotel assignments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel assignments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    const body = await request.json();
    const { bookingId, ...assignmentData } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'bookingId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('operation_hotel_assignments')
      .insert({
        booking_id: bookingId,
        ...assignmentData,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating hotel assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hotel assignment' },
      { status: 500 }
    );
  }
}
