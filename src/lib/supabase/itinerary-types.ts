// Itinerary Types
export interface Itinerary {
  id: string;
  created_at: string;
  updated_at: string;

  // Cover Info
  title: string;
  subtitle?: string;
  logo: string;
  guest_names: string;
  start_date?: string;
  end_date?: string;
  cover_image?: string;

  // Welcome Letter
  letter_date?: string;
  letter_salutation?: string;
  letter_body?: string[];
  letter_signature_name?: string;
  letter_signature_title?: string;

  // Metadata
  created_by?: string;
  booking_id?: string;
  status: 'draft' | 'final';

  // JSONB fields
  pricing: PricingInfo;
  terms: TermsInfo;
  checklist: ChecklistInfo;
}

export interface PricingInfo {
  currency?: string;
  symbol?: string;
  total?: string;
  total_label?: string;
  items: PricingItem[];
  inclusions: string[];
  exclusions: string[];
}

export interface PricingItem {
  label: string;
  description?: string;
  amount: string;
  highlight?: boolean;
}

export interface TermsInfo {
  booking_payment?: string;
  cancellation_policy?: string;
  travel_insurance?: string;
  health_fitness?: string;
  liability?: string;
  visa_requirements?: string;
  photography_guidelines?: string;
  weather_considerations?: string;
}

export interface ChecklistInfo {
  documents?: string[];
  clothing?: string[];
  gear?: string[];
  essentials?: string[];
  categories?: ChecklistCategory[];
}

export interface ChecklistCategory {
  title: string;
  items: string[];
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  title: string;
  subtitle?: string;

  // Meta
  altitude?: string;
  distance?: string;
  duration?: string;
  high_point?: string;
  night_location?: string;

  // Content
  description?: string;
  drop_cap?: boolean;

  // Menu
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;

  // Weather
  weather_text?: string;
  temperature?: string;

  // Image
  image_url?: string;
  image_alt?: string;

  // Arrays
  highlights?: string[];
  pull_quote?: string;
  special_boxes?: SpecialBox[];

  created_at: string;
}

export interface SpecialBox {
  type: 'photo-tip' | 'family-info' | 'tiger-box' | 'response-box' | 'highlight';
  title?: string;
  badge?: string;
  content: string;
}

export interface SectionOpener {
  id: string;
  itinerary_id: string;
  section_number: number;
  title: string;
  subtitle?: string;
  background_image: string;
  overlay_color?: string;
  page_number?: number;
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  description?: string;
  theme: ItineraryTheme;
  preview_image?: string;
  created_at: string;
}

export interface ItineraryTheme {
  primary: string;
  secondary: string;
  accent: string;
  cream: string;
  page_number_bg: string;
}

// Form input types
export interface ItineraryFormData {
  cover: {
    title: string;
    subtitle: string;
    logo: string;
    guest_names: string;
    start_date: string;
    end_date: string;
    cover_image: string;
  };
  letter: {
    date: string;
    salutation: string;
    body: string;
    signature_name: string;
    signature_title: string;
  };
  template: string;
}

export interface DayFormData {
  day_number: number;
  title: string;
  subtitle: string;
  altitude: string;
  distance: string;
  duration: string;
  high_point: string;
  night_location: string;
  description: string;
  drop_cap: boolean;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  weather_text: string;
  temperature: string;
  image_url: string;
  image_alt: string;
  highlights: string;
  pull_quote: string;
}
