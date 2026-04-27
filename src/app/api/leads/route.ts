/**
 * Leads API Endpoint
 * Handles lead form submissions for Bhutan tour inquiries
 *
 * POST /api/leads - Submit a new lead
 */

import { createClient } from '@/lib/supabase/client';
import { leadSchema, type LeadFormData } from '@/lib/forms/lead-validation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/leads
 * Submit a new lead from the website form
 *
 * Request body:
 * {
 *   name: string;
 *   email: string;
 *   country: string;
 *   travelDates: { from: Date; to: Date };
 *   budget: string;
 *   tripType: string;
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   data?: any;
 *   error?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validatedData: LeadFormData = leadSchema.parse(body);

    // Format dates for Supabase and include optional UTM parameters
    const formattedData: Record<string, any> = {
      name: validatedData.name,
      email: validatedData.email,
      country: validatedData.country,
      trip_type: validatedData.tripType,
      budget: validatedData.budget,
      travel_from: validatedData.travelDates.from.toISOString(),
      travel_to: validatedData.travelDates.to.toISOString(),
      status: 'new',
      source: 'website',
    };

    // Get UTM parameters from request body if available
    if (body.utm_source) formattedData.utm_source = body.utm_source;
    if (body.utm_medium) formattedData.utm_medium = body.utm_medium;
    if (body.utm_campaign) formattedData.utm_campaign = body.utm_campaign;

    // Create Supabase client
    const supabase = createClient();

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([formattedData])
      .select()
      .single();

    // Handle Supabase errors
    if (error) {
      console.error('Supabase error inserting lead:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save your information. Please try again or contact us directly.',
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          message: 'Thank you! We will contact you within 24 hours.',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || 'Invalid form data. Please check your inputs.',
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Unexpected error in leads API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads
 * Retrieve leads (admin only - requires authentication)
 *
 * Query parameters:
 * - status: Filter by lead status (new, contacted, quoted, booked, lost, spam)
 * - limit: Number of leads to return (default: 50)
 * - offset: Pagination offset (default: 0)
 *
 * Response:
 * {
 *   success: boolean;
 *   data?: any[];
 *   error?: string;
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Create Supabase client
    const supabase = createClient();

    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Execute query
    const { data, error } = await query;

    // Handle errors
    if (error) {
      console.error('Supabase error fetching leads:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to retrieve leads.',
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        data: data || [],
        meta: {
          limit,
          offset,
          count: data?.length || 0,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle unexpected errors
    console.error('Unexpected error in leads GET API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred.',
      },
      { status: 500 }
    );
  }
}
