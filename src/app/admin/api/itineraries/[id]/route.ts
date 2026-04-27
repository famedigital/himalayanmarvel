/**
 * Single Itinerary API Endpoint
 * Handles individual itinerary operations
 *
 * GET /api/admin/itineraries/[id] - Get itinerary by ID
 * PUT /api/admin/itineraries/[id] - Update itinerary
 * DELETE /api/admin/itineraries/[id] - Delete itinerary
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
    const supabase = createClient();

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
      slug,
      subtitle: body.subtitle,
      guest_name: body.guest_name,
      duration_days: body.duration_days,
      duration_nights: body.duration_nights,
      start_date: body.start_date,
      end_date: body.end_date,
      destinations: body.destinations,
      cover_title: body.cover_title,
      cover_subtitle: body.cover_subtitle,
      cover_image_url: body.cover_image_url,
      letter_date: body.letter_date,
      letter_salutation: body.letter_salutation,
      letter_body: body.letter_body,
      letter_signature_name: body.letter_signature_name,
      letter_signature_title: body.letter_signature_title,
      itinerary_days: body.itinerary_days,
      total_price: body.total_price,
      currency: body.currency,
      price_inclusions: body.price_inclusions,
      price_exclusions: body.price_exclusions,
      terms_conditions: body.terms_conditions,
      packing_checklist: body.packing_checklist,
      contact_phone: body.contact_phone,
      contact_email: body.contact_email,
      contact_website: body.contact_website,
      itinerary_template: body.itinerary_template,
      featured_image_url: body.featured_image_url,
      gallery_images: body.gallery_images,
      tags: body.tags,
      status: body.status,
      is_published: body.is_published,
      notes: body.notes,
      internal_notes: body.internal_notes,
    };

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
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update itinerary',
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
