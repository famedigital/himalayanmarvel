/**
 * Google Reviews Integration
 *
 * This module provides functions to fetch and display Google reviews.
 * Requires NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to be set in .env.local
 *
 * Setup Instructions:
 * 1. Go to Google Cloud Console (console.cloud.google.com)
 * 2. Create a new project or select existing one
 * 3. Enable "Places API" from the API Library
 * 4. Create credentials (API Key)
 * 5. Restrict the key to Places API only
 * 6. Add the key to .env.local: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
 *
 * To find your Place ID:
 * - Search for your business on Google Maps
 * - The URL will contain the place_id, or use the Places API search
 */

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
}

/**
 * Fetch Google reviews for a specific place
 * @param placeId - Google Place ID (e.g., 'ChIJxxxxxxxxxxxxxxxx')
 * @returns Place details including reviews
 */
export async function fetchGoogleReviews(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('Google Places API key not found. Set NEXT_PUBLIC_GOOGLE_PLACES_API_KEY in .env.local');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error);
    return null;
  }
}

/**
 * Search for a place by name and location to get place_id
 * @param query - Search query (e.g., "Himalayan Marvels Bhutan")
 * @param location - Optional location bias (lat,lng)
 * @returns Place ID or null
 */
export async function searchPlaceId(
  query: string,
  location?: { lat: number; lng: number }
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('Google Places API key not found');
    return null;
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(query)}` +
      `&inputtype=textquery` +
      `&fields=place_id` +
      `&key=${apiKey}`;

    if (location) {
      url += `&locationbias=point:${location.lat},${location.lng}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.candidates || data.candidates.length === 0) {
      return null;
    }

    return data.candidates[0].place_id;
  } catch (error) {
    console.error('Failed to search place ID:', error);
    return null;
  }
}

/**
 * React hook to fetch and use Google reviews
 * @param placeId - Google Place ID
 * @returns Reviews, loading state, and error
 */
export function useGoogleReviews(placeId: string) {
  // This is a placeholder - actual React hook implementation
  // should be in the component that uses it
  // Example implementation in component:
  //
  // const [reviews, setReviews] = useState<GoogleReview[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [rating, setRating] = useState<number>(0);
  // const [totalReviews, setTotalReviews] = useState<number>(0);
  //
  // useEffect(() => {
  //   async function loadReviews() {
  //     const data = await fetchGoogleReviews(placeId);
  //     if (data) {
  //       setReviews(data.reviews);
  //       setRating(data.rating);
  //       setTotalReviews(data.user_ratings_total);
  //     }
  //     setLoading(false);
  //   }
  //   loadReviews();
  // }, [placeId]);
  //
  // return { reviews, loading, rating, totalReviews };
}

/**
 * Convert Google review to our Review interface
 */
export function googleReviewToReview(googleReview: GoogleReview): {
  name: string;
  location: string;
  text: string;
  avatar: string;
  verified: boolean;
  rating: number;
} {
  // Extract initials from author name
  const initials = googleReview.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    name: googleReview.author_name,
    location: 'Verified Google Reviewer', // Google doesn't provide location
    text: googleReview.text,
    avatar: initials,
    verified: true, // All Google reviews are verified
    rating: googleReview.rating,
  };
}
