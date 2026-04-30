// ============================================
// CMS Type Definitions
// Frontend Content Management System
// ============================================

export interface CmsPage {
  id: string;
  page_path: string;
  page_name: string;
  is_editable: boolean;
  icon: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CmsContent {
  id: string;
  page_path: string;
  component_id: string;
  content_key: string;
  content_value: string | null;
  media_url: string | null;
  color_value: string | null;
  order_index: number;
  slide_order: number;
  is_primary: boolean;
  is_draft: boolean;
  published_version: number;
  draft_version: Record<string, any> | null;
  updated_at: string;
  updated_by: string | null;
  page_name?: string;
  updated_by_email?: string;
  updated_by_name?: string;
}

export interface CmsComponent {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: CmsFieldConfig[];
}

export type CmsFieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'video' | 'color' | 'link' | 'number' | 'boolean';

export interface CmsFieldConfig {
  key: string;
  label: string;
  type: CmsFieldType;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  helper?: string;
  defaultValue?: string | number | boolean;
}

export interface CmsPageComponentMap {
  [pagePath: string]: {
    [componentId: string]: CmsComponent;
  };
}

// Component definitions for each page
export const CMS_COMPONENT_DEFINITIONS: CmsPageComponentMap = {
  '/': {
    hero: {
      id: 'hero',
      name: 'Hero Section',
      icon: 'Image',
      description: 'Main hero banner with title, subtitle, and media',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter hero title', required: true },
        { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Enter hero subtitle' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Enter hero description' },
        { key: 'background_image', label: 'Background Image', type: 'image' },
        { key: 'background_video', label: 'Background Video', type: 'video' },
        { key: 'cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'Explore Tours' },
        { key: 'cta_link', label: 'CTA Button Link', type: 'link', placeholder: '/tours' },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Top navigation bar content',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text', placeholder: 'Himalayan Marvels' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section with links and info',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Your Gateway to Himalayan Wonder' },
        { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'info@himalayanmarvels.com' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text', placeholder: '+975 17 00 00 00' },
        { key: 'address', label: 'Address', type: 'textarea', rows: 2, placeholder: 'Thimphu, Bhutan' },
        { key: 'social_facebook', label: 'Facebook URL', type: 'link' },
        { key: 'social_instagram', label: 'Instagram URL', type: 'link' },
        { key: 'social_twitter', label: 'Twitter URL', type: 'link' },
      ],
    },
  },
  '/tours': {
    hero: {
      id: 'hero',
      name: 'Tours Hero',
      icon: 'Map',
      description: 'Tours page hero section',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Our Curated Tours' },
        { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Discover Bhutan with expert guides' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'background_image', label: 'Background Image', type: 'image' },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Navigation bar',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      ],
    },
  },
  '/about': {
    hero: {
      id: 'hero',
      name: 'About Hero',
      icon: 'Info',
      description: 'About page hero section',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'About Himalayan Marvels' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'background_image', label: 'Background Image', type: 'image' },
      ],
    },
    story: {
      id: 'story',
      name: 'Our Story',
      icon: 'BookOpen',
      description: 'Company story section',
      fields: [
        { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Story' },
        { key: 'content', label: 'Content', type: 'textarea', rows: 8, placeholder: 'Tell your story...' },
        { key: 'image', label: 'Image', type: 'image' },
      ],
    },
    founder: {
      id: 'founder',
      name: 'Founder Section',
      icon: 'User',
      description: 'Founder information',
      fields: [
        { key: 'founder_name', label: 'Founder Name', type: 'text' },
        { key: 'founder_title', label: 'Founder Title', type: 'text' },
        { key: 'founder_bio', label: 'Founder Bio', type: 'textarea', rows: 5 },
        { key: 'founder_image', label: 'Founder Photo', type: 'image' },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Navigation bar',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      ],
    },
  },
  '/blog': {
    hero: {
      id: 'hero',
      name: 'Blog Hero',
      icon: 'FileText',
      description: 'Blog page hero section',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Travel Journal' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'background_image', label: 'Background Image', type: 'image' },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Navigation bar',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      ],
    },
  },
  '/contact': {
    hero: {
      id: 'hero',
      name: 'Contact Hero',
      icon: 'Mail',
      description: 'Contact page hero section',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Get in Touch' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'background_image', label: 'Background Image', type: 'image' },
      ],
    },
    contact_info: {
      id: 'contact_info',
      name: 'Contact Information',
      icon: 'Phone',
      description: 'Contact details',
      fields: [
        { key: 'email', label: 'Email', type: 'text', placeholder: 'info@himalayanmarvels.com' },
        { key: 'phone', label: 'Phone', type: 'text', placeholder: '+975 17 00 00 00' },
        { key: 'whatsapp', label: 'WhatsApp', type: 'text', placeholder: '+975 17 00 00 00' },
        { key: 'address', label: 'Address', type: 'textarea', rows: 3 },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Navigation bar',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      ],
    },
  },
  '/concierge': {
    hero: {
      id: 'hero',
      name: 'Concierge Hero',
      icon: 'Gem',
      description: 'Concierge page hero section',
      fields: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Luxury Concierge' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'background_image', label: 'Background Image', type: 'image' },
      ],
    },
    navigation: {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Menu',
      description: 'Navigation bar',
      fields: [
        { key: 'logo', label: 'Logo Image', type: 'image' },
        { key: 'brand_name', label: 'Brand Name', type: 'text' },
      ],
    },
    footer: {
      id: 'footer',
      name: 'Footer',
      icon: 'AlignLeft',
      description: 'Footer section',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      ],
    },
  },
};

export function getComponentsForPage(pagePath: string): CmsComponent[] {
  const pageComponents = CMS_COMPONENT_DEFINITIONS[pagePath];
  if (!pageComponents) return [];

  return Object.values(pageComponents);
}

export function getComponentById(pagePath: string, componentId: string): CmsComponent | undefined {
  return CMS_COMPONENT_DEFINITIONS[pagePath]?.[componentId];
}
