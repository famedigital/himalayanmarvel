/**
 * Single Itinerary API Endpoint
 * Handles individual itinerary operations
 *
 * GET /api/admin/itineraries/[id] - Get itinerary by ID
 * PUT /api/admin/itineraries/[id] - Update itinerary
 * DELETE /api/admin/itineraries/[id] - Delete itinerary
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Itinerary not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch itinerary',
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
    const supabase = await createClient();

    // Update slug if title changed and slug not provided
    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
    }

    const updateData: any = {
      title: body.title,
      subtitle: body.subtitle || null,
      logo: body.logo || null,
      guest_names: body.guest_names,
      no_of_pax: body.no_of_pax || 2,
      entry_point: body.entry_point || "Paro Airport",
      exit_point: body.exit_point || "Paro Airport",
      start_date: body.start_date,
      end_date: body.end_date,
      cover_image: body.cover_image || null,
      letter_date: body.letter_date || null,
      letter_salutation: body.letter_salutation || null,
      letter_body: body.letter_body || null, // Expect array, not string
      letter_signature_name: body.letter_signature_name || null,
      letter_signature_title: body.letter_signature_title || null,
      pricing: body.pricing || null,
      terms: body.terms || null,
      checklist: body.checklist || null,
      status: body.status,
      back_cover: body.back_cover || null,
      header_footer: body.header_footer || null,
    };

    // Only add fields that exist in the body
    if (body.itinerary_template !== undefined) updateData.itinerary_template = body.itinerary_template;
    if (body.featured_image_url !== undefined) updateData.featured_image_url = body.featured_image_url;
    if (body.gallery_images !== undefined) updateData.gallery_images = body.gallery_images;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.internal_notes !== undefined) updateData.internal_notes = body.internal_notes;

    const { data, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Itinerary not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error updating itinerary:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update itinerary',
        details: error.details,
        hint: error.hint,
      },
      { status: 500 }
    );
  }
}

// DELETE handler for removing itineraries
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('itineraries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Itinerary deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete itinerary',
      },
      { status: 500 }
    );
  }
}
