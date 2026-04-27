import { z } from 'zod';

/**
 * Lead form validation schema
 * Validates lead capture form data for Bhutan tour inquiries
 */
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Please select your country'),
  travelDates: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }).refine(
    (data) => data.to > data.from,
    { message: 'End date must be after start date' }
  ),
  budget: z.string().min(1, 'Please select a budget range'),
  tripType: z.string().min(1, 'Please select trip type'),
});

/**
 * Type inference from the schema
 */
export type LeadFormData = z.infer<typeof leadSchema>;

/**
 * Budget options for the form
 */
export const BUDGET_OPTIONS = [
  { value: '2500-4000', label: '$2,500 - $4,000' },
  { value: '4000-7000', label: '$4,000 - $7,000' },
  { value: '7000+', label: '$7,000+' },
] as const;

/**
 * Trip type options for the form
 */
export const TRIP_TYPE_OPTIONS = [
  { value: 'cultural', label: 'Cultural Journey' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'adventure', label: 'Adventure Trek' },
  { value: 'spiritual', label: 'Spiritual & Wellness' },
  { value: 'custom', label: 'Custom Experience' },
] as const;

/**
 * Country options for the form
 * Major tourism markets for Bhutan
 */
export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'QA', label: 'Qatar' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'IL', label: 'Israel' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'OTHER', label: 'Other' },
] as const;
