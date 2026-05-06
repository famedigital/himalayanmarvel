import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get a sample itinerary to see the actual schema
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    // Return the column names
    return NextResponse.json({
      success: true,
      columns: Object.keys(data || {}),
      sampleData: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
