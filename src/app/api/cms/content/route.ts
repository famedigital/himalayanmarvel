/**
 * API Route: /api/cms/content
 * Fetches CMS content for client-side consumption
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, getComponentContent } from '@/lib/cms';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const component = searchParams.get('component');
    const draft = searchParams.get('draft') === 'true';
    const key = searchParams.get('key');

    // Validate required parameters
    if (!page) {
      return NextResponse.json(
        { error: 'Missing required parameter: page' },
        { status: 400 }
      );
    }

    // If component and key are specified, return a single value
    if (component && key) {
      const contents = await getComponentContent(page, component, draft);
      const item = contents.find(c => c.content_key === key);

      if (!item) {
        return NextResponse.json({ value: '' });
      }

      return NextResponse.json({ value: item.content_value });
    }

    // If component is specified, return component content
    if (component) {
      const contents = await getComponentContent(page, component, draft);
      return NextResponse.json({ content: contents });
    }

    // Otherwise, return all page content
    const contents = await getPageContent(page, draft);
    return NextResponse.json({ content: contents });
  } catch (error) {
    console.error('Error in /api/cms/content:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
