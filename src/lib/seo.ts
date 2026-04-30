import { Metadata } from 'next'

const SITE_URL = 'https://himalayanmarvels.bt'
const SITE_NAME = 'Himalayan Marvels'
const DEFAULT_DESCRIPTION =
  'Experience the magic of Bhutan with Himalayan Marvels. Luxury tours, authentic cultural experiences, and personalized journeys through the Land of the Thunder Dragon.'

export interface SeoMetadataParams {
  title?: string
  description?: string
  image?: string
  canonical?: string
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string
  type?: 'website' | 'article'
}

/**
 * Generate standardized metadata for pages
 */
export function generateSeoMetadata(params: SeoMetadataParams): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image = '/og-image.jpg',
    canonical,
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors,
    type = 'website',
  } = params

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = canonical ? new URL(canonical, SITE_URL) : new URL(SITE_URL)
  const imageUrl = image.startsWith('http') ? image : new URL(image, SITE_URL).href

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonical ? new URL(canonical, SITE_URL).href : SITE_URL,
    },
    openGraph: {
      type,
      url: url.href,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      siteName: SITE_NAME,
      publishedTime,
      modifiedTime,
      authors: authors ? [authors] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  }
}

/**
 * Get canonical URL helper
 */
export function getCanonicalUrl(path: string): string {
  return new URL(path, SITE_URL).href
}

// ============================================================================
// JSON-LD Schema Generators
// ============================================================================

interface OrganizationSchemaProps {
  name?: string
  description?: string
  url?: string
  logo?: string
  email?: string
  phone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  socialLinks?: string[]
}

/**
 * Generate Organization JSON-LD schema
 */
export function generateOrganizationSchema(props: OrganizationSchemaProps = {}) {
  const {
    name = SITE_NAME,
    description = DEFAULT_DESCRIPTION,
    url = SITE_URL,
    logo = `${SITE_URL}/logo/HMT-Logo.png`,
    email = 'info@himalayanmarvels.bt',
    phone = '+975-2-322314',
    address = {
      streetAddress: 'Norzin Lam',
      addressLocality: 'Thimphu',
      addressRegion: 'Thimphu',
      postalCode: '11001',
      addressCountry: 'BT',
    },
    socialLinks = [
      'https://www.instagram.com/himalayanmarvels',
      'https://www.facebook.com/himalayanmarvels',
    ],
  } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name,
    description,
    url,
    logo,
    email,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    sameAs: socialLinks,
  }
}

interface TouristTripSchemaProps {
  name: string
  description: string
  slug: string
  image: string
  price?: number
  priceCurrency?: string
  duration?: string
  startDate?: string
  touristType?: string
  offers?: {
    price: number
    priceCurrency: string
    availability: string
  }
}

/**
 * Generate TouristTrip JSON-LD schema for tours
 */
export function generateTouristTripSchema(props: TouristTripSchemaProps) {
  const {
    name,
    description,
    slug,
    image,
    price,
    priceCurrency = 'USD',
    duration,
    startDate,
    touristType = 'Cultural Tourist',
    offers,
  } = props

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    url: `${SITE_URL}/tours/${slug}`,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    touristType,
  }

  if (duration) {
    schema.duration = duration
  }

  if (startDate) {
    schema.startDate = startDate
  }

  if (offers) {
    schema.offers = {
      '@type': 'Offer',
      ...offers,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    }
  } else if (price) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    }
  }

  schema.provider = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  }

  return schema
}

interface ArticleSchemaProps {
  title: string
  description: string
  slug: string
  image: string
  publishedTime: string
  modifiedTime?: string
  author?: string
}

/**
 * Generate Article JSON-LD schema for blog posts
 */
export function generateArticleSchema(props: ArticleSchemaProps) {
  const {
    title,
    description,
    slug,
    image,
    publishedTime,
    modifiedTime,
    author = 'Himalayan Marvels',
  } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo/HMT-Logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  }
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(props: FAQSchemaProps) {
  const { questions } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    href: string
  }>
}

/**
 * Generate Breadcrumb JSON-LD schema
 */
export function generateBreadcrumbSchema(props: BreadcrumbSchemaProps) {
  const { items } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
    })),
  }
}

interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  url?: string
  logo?: string
  email?: string
  phone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  priceRange?: string
}

/**
 * Generate LocalBusiness JSON-LD schema
 */
export function generateLocalBusinessSchema(props: LocalBusinessSchemaProps = {}) {
  const {
    name = SITE_NAME,
    description = DEFAULT_DESCRIPTION,
    url = SITE_URL,
    logo = `${SITE_URL}/logo/HMT-Logo.png`,
    email = 'info@himalayanmarvels.bt',
    phone = '+975-2-322314',
    address = {
      streetAddress: 'Norzin Lam',
      addressLocality: 'Thimphu',
      addressRegion: 'Thimphu',
      postalCode: '11001',
      addressCountry: 'BT',
    },
    geo = {
      latitude: 27.4726,
      longitude: 89.6393,
    },
    openingHours = ['Mo-Fr 09:00-17:00', 'Sa 10:00-14:00'],
    priceRange = '$$$',
  } = props

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name,
    description,
    url,
    logo,
    email,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...geo,
    },
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0].split('-').map((day) => {
        const days: Record<string, string> = {
          Mo: 'Monday',
          Tu: 'Tuesday',
          We: 'Wednesday',
          Th: 'Thursday',
          Fr: 'Friday',
          Sa: 'Saturday',
          Su: 'Sunday',
        }
        return day.split('').map((d) => days[d])
      }),
      opens: hours.split(' ')[1]?.split('-')[0] || '09:00',
      closes: hours.split(' ')[1]?.split('-')[1] || '17:00',
    })),
    priceRange,
  }
}
