import { NextResponse } from 'next/server';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function GET() {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }

    // Instagram Basic Display API: use "me/media" with a valid user token.
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=12`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch Instagram posts', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform Instagram data to our format
    const posts = (data.data || []).map((item: any) => ({
      id: item.id,
      caption: item.caption || '',
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url,
      permalink: item.permalink,
      timestamp: item.timestamp,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
