// Database Types

export interface Itinerary {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle?: string;
  logo: string;
  guest_names: string;
  start_date?: string;
  end_date?: string;
  cover_image?: string;
  letter_date?: string;
  letter_salutation?: string;
  letter_body?: string[];
  letter_signature_name?: string;
  letter_signature_title?: string;
  status: 'draft' | 'final';
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number | null;
  price: number | null;
  category: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  itinerary: ItineraryDay[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface Booking {
  id: string;
  tour_id: string | null;
  itinerary_id: string | null;
  client_name: string;
  email: string | null;
  phone: string | null;
  no_of_pax: number;
  passport_origin: string | null;
  passport_photo: string | null;
  amount: number | null;
  payment_receipts: PaymentReceipt[];
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  booking_date: string | null;
  travel_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  tour?: Tour;
  itinerary?: Itinerary;
}

export interface PaymentReceipt {
  id: string;
  amount: number;
  receipt_url: string;
  date: string;
  note?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  category: string | null;
  tags: string[] | null;
  author: string;
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

// Database Tables
export interface Database {
  public: {
    Tables: {
      tours: {
        Row: Tour;
        Insert: Omit<Tour, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tour, 'id' | 'created_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>;
      };
      blogs: {
        Row: Blog;
        Insert: Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Blog, 'id' | 'created_at'>>;
      };
      settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'updated_at'>;
        Update: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>;
      };
    };
  };
}
