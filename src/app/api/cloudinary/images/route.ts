import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder') || 'himalayanmarvel';
    const maxResults = parseInt(searchParams.get('max_results') || '100');
    const nextCursor = searchParams.get('next_cursor') || null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary config check:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      cloudName,
      folder
    });

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials');
      return NextResponse.json(
        { error: 'Cloudinary credentials not configured', details: { hasCloudName: !!cloudName, hasApiKey: !!apiKey, hasApiSecret: !!apiSecret } },
        { status: 500 }
      );
    }

    // Build Cloudinary API URL for listing resources
    let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;
    const queryParams = new URLSearchParams({
      prefix: folder,
      max_results: maxResults.toString(),
    });

    if (nextCursor) {
      queryParams.append('next_cursor', nextCursor);
    }

    apiUrl += `?${queryParams.toString()}`;

    console.log('Fetching from Cloudinary:', apiUrl);

    // Use Basic Authentication for Cloudinary Admin API
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    console.log('Cloudinary response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch images from Cloudinary', details: errorText, status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    console.log('Cloudinary response:', {
      resourcesCount: data.resources?.length || 0,
      total_count: data.total_count
    });

    return NextResponse.json({
      success: true,
      images: data.resources || [],
      next_cursor: data.next_cursor || null,
      total_count: data.total_count || 0,
    });
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
