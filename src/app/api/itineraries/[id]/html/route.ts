import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateItineraryHTML, ItineraryData } from '@/lib/templates/itinerary-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    console.log('[ItineraryHTML] ===== START HTML GENERATION =====');
    console.log('[ItineraryHTML] Itinerary ID:', id);
    console.log('[ItineraryHTML] Request URL:', request.url);

    // Fetch itinerary
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[ItineraryHTML] Database error:', error);
      return NextResponse.json({
        error: 'Database error',
        details: error.message
      }, { status: 500 });
    }

    if (!itinerary) {
      console.log('[ItineraryHTML] Itinerary not found:', id);
      return NextResponse.json({
        error: 'Itinerary not found',
        id: id,
        message: 'No itinerary exists with this ID.',
        help: 'Create an itinerary at /admin/itineraries/new',
        availableItineraries: 'Check /admin/itineraries for existing itineraries'
      }, { status: 404 });
    }

    console.log('[ItineraryHTML] Itinerary found:', itinerary.title);
    console.log('[ItineraryHTML] Itinerary data keys:', Object.keys(itinerary));
    console.log('[ItineraryHTML] Letter body type:', Array.isArray(itinerary.letter_body) ? 'array' : typeof itinerary.letter_body);

    // Validate required fields
    if (!itinerary.title || !itinerary.guest_names) {
      return NextResponse.json({
        error: 'Invalid itinerary data',
        details: 'Missing required fields: title or guest_names'
      }, { status: 400 });
    }

    // Parse JSONB fields from database schema
    const pricing = itinerary.pricing || {};
    const terms = itinerary.terms || {};
    const checklist = itinerary.checklist || {};

    // Calculate duration from dates
    const startDate = itinerary.start_date ? new Date(itinerary.start_date) : new Date();
    const endDate = itinerary.end_date ? new Date(itinerary.end_date) : new Date();
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const durationNights = Math.max(0, durationDays - 1);

    // Fetch itinerary days from the related table
    const { data: daysData, error: daysError } = await supabase
      .from('itinerary_days')
      .select('*')
      .eq('itinerary_id', id)
      .order('day_number', { ascending: true });

    if (daysError) {
      console.error('[ItineraryHTML] Error fetching days:', daysError);
    }

    // Convert database days to template format
    const itineraryDays = (daysData || []).map(day => ({
      day: day.day_number,
      title: day.title,
      date: day.title || `Day ${day.day_number}`,
      activity: day.subtitle || undefined,
      night: day.night_location || 'TBD',
      description: day.description || '',
      image_url: day.image_url || undefined,
      schedule: day.highlights || undefined,
      highlights: day.highlights || undefined,
      meals: [day.breakfast, day.lunch, day.dinner].filter(Boolean) as string[],
      subsections: [],
    }));

    // Build itinerary data object matching database schema
    const itineraryData: ItineraryData = {
      title: itinerary.title || 'Untitled Itinerary',
      subtitle: itinerary.subtitle || undefined,
      guest_name: itinerary.guest_names || 'Guest',
      duration_days: durationDays,
      duration_nights: durationNights,
      start_date: itinerary.start_date || startDate.toISOString(),
      end_date: itinerary.end_date || endDate.toISOString(),
      destinations: undefined,
      cover_image_url: itinerary.cover_image || undefined,
      letter_date: itinerary.letter_date || undefined,
      letter_salutation: itinerary.letter_salutation || undefined,
      letter_body: Array.isArray(itinerary.letter_body) ? itinerary.letter_body : [],
      letter_signature_name: itinerary.letter_signature_name || undefined,
      letter_signature_title: itinerary.letter_signature_title || undefined,
      days: itineraryDays,
      total_price: parseFloat(pricing.total?.toString() || '0') || 0,
      currency: pricing.currency?.toString() || 'USD',
      price_inclusions: pricing.items || undefined,
      inclusions_list: pricing.inclusions || undefined,
      terms: Object.entries(terms).map(([title, content]) => ({ title, content: content?.toString() || '' })),
      packing_checklist: Object.entries(checklist).map(([category, items]) => ({
        category,
        items: Array.isArray(items) ? items : []
      })),
      contact_phone: undefined,
      contact_email: undefined,
      contact_website: undefined,
    };

    console.log('[ItineraryHTML] Generating HTML for:', itineraryData.title);
    console.log('[ItineraryHTML] Days count:', itineraryData.days.length);
    console.log('[ItineraryHTML] Pricing:', itineraryData.pricing);
    console.log('[ItineraryHTML] Letter body paragraphs:', itineraryData.letter_body.length);

    // Fetch company settings
    const { data: companySettings } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    console.log('[ItineraryHTML] Company settings:', companySettings?.company_name || 'Using defaults');

    // Generate HTML
    const html = generateItineraryHTML(itineraryData, companySettings || undefined);

    console.log('[ItineraryHTML] HTML generated successfully');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="itinerary-${itinerary.guest_names.replace(/\s+/g, '-')}.html"`
      }
    });
  } catch (error) {
    console.error('[ItineraryHTML] HTML generation error:', error);
    console.error('[ItineraryHTML] Error type:', error?.constructor?.name);
    console.error('[ItineraryHTML] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[ItineraryHTML] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Return more detailed error info
    return NextResponse.json({
      error: 'Failed to generate HTML',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name || 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
