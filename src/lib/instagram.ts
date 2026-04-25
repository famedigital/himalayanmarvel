export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  try {
    const response = await fetch('/api/instagram', {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      // API failure should quietly fall back to static placeholders in the UI.
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Instagram posts unavailable, using fallback content.', error);
    }
    return [];
  }
}
