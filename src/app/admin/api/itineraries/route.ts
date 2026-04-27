/**
 * Itineraries API Endpoint
 * Handles CRUD operations for itineraries
 *
 * GET /api/admin/itineraries - List all itineraries
 * POST /api/admin/itineraries - Create new itinerary
 */

import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const isPublished = searchParams.get('is_published');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (isPublished !== null) {
      query = query.eq('is_published', isPublished === 'true');
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      meta: {
        limit,
        offset,
        count: data?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch itineraries',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    // Generate slug from title if not provided
    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
    }

    const itineraryData = {
      booking_id: body.booking_id || null,
      title: body.title,
      slug,
      subtitle: body.subtitle || null,
      guest_name: body.guest_name,
      duration_days: body.duration_days,
      duration_nights: body.duration_nights,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      destinations: body.destinations || [],
      cover_title: body.cover_title || null,
      cover_subtitle: body.cover_subtitle || null,
      cover_image_url: body.cover_image_url || null,
      letter_date: body.letter_date || null,
      letter_salutation: body.letter_salutation || null,
      letter_body: body.letter_body || null,
      letter_signature_name: body.letter_signature_name || null,
      letter_signature_title: body.letter_signature_title || null,
      itinerary_days: body.itinerary_days || [],
      total_price: body.total_price || 0,
      currency: body.currency || 'INR',
      price_inclusions: body.price_inclusions || null,
      price_exclusions: body.price_exclusions || null,
      terms_conditions: body.terms_conditions || null,
      packing_checklist: body.packing_checklist || {},
      contact_phone: body.contact_phone || null,
      contact_email: body.contact_email || null,
      contact_website: body.contact_website || null,
      itinerary_template: body.itinerary_template,
      featured_image_url: body.featured_image_url || null,
      gallery_images: body.gallery_images || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      is_published: body.is_published || false,
      notes: body.notes || null,
      internal_notes: body.internal_notes || null,
    };

    const { data, error } = await supabase
      .from('itineraries')
      .insert([itineraryData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create itinerary',
      },
      { status: 500 }
    );
  }
}
