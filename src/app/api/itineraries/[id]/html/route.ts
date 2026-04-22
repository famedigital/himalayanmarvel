import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateItineraryHTML } from '@/lib/itinerary-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const id = params.id;

    // Fetch itinerary with days and section openers
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        itinerary_days (*),
        itinerary_section_openers (*)
      `)
      .eq('id', id)
      .single();

    if (error || !itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    // Generate HTML
    const html = generateItineraryHTML(itinerary);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="itinerary-${itinerary.guest_names.replace(/\s+/g, '-')}.html"`
      }
    });
  } catch (error) {
    console.error('HTML generation error:', error);
    return NextResponse.json({ error: 'Failed to generate HTML' }, { status: 500 });
  }
}
