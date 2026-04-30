/**
 * API Route: /api/cms/pages
 * Fetches CMS pages for client-side consumption
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllPages } from '@/lib/cms';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active') !== 'false'; // Default to true

    const pages = await getAllPages(active);

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error in /api/cms/pages:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
