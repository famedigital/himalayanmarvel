import type { Metadata } from 'next';
import { Cormorant_Garamond, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { QueryProvider } from '@/components/QueryProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cn } from "@/lib/utils";
import JsonLd from '@/components/seo/JsonLd';

// Luxury Display Font (Bold, Elegant)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700'],
});

// Primary Serif (Elegant, Editorial)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600'],
});

// Body Sans (Clean, Professional)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Himalayan Marvels | Private Bhutan Journey Curators',
  description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists. Founded by ex-Ritz-Carlton leadership.',
  keywords: ['private Bhutan tour', 'luxury Bhutan travel', 'bespoke Bhutan journey', 'Bhutan concierge', 'private Himalayan expedition'],
  authors: [{ name: 'Himalayan Marvels' }],
  icons: {
    icon: '/logo/favicon-hmt.png',
    shortcut: '/logo/favicon-hmt.png',
    apple: '/logo/favicon-hmt.png',
  },
  openGraph: {
    title: 'Himalayan Marvels | Private Bhutan Journey Curators',
    description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders.',
    type: 'website',
    url: 'https://himalayanmarvels.bt',
    siteName: 'Himalayan Marvels',
    images: [
      {
        url: 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4',
        width: 1200,
        height: 630,
        alt: 'Himalayan Marvels - Private Bhutan Journeys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Marvels | Private Bhutan Journey Curators',
    description: 'Bhutan\'s premier luxury travel concierge. Private journeys curated by insiders.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", cormorant.variable, playfair.variable, inter.variable)}>
      <body className="font-sans bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="himalayan-theme"
        >
          <NuqsAdapter>
            <QueryProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </QueryProvider>
          </NuqsAdapter>
        </ThemeProvider>

        {/* Global JSON-LD Schema for Rich Snippets */}
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: 'Himalayan Marvels',
          alternateName: 'Silverpine Bhutan',
          url: 'https://himalayanmarvels.bt',
          logo: '/logo/HMT-Logo.png',
          description: "Bhutan's premier luxury travel concierge. Private journeys curated by insiders, not tours designed for tourists. Founded by ex-Ritz-Carlton leadership.",
          email: 'info@himalayanmarvels.bt',
          telephone: '+975-2-322314',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Norzin Lam',
            addressLocality: 'Thimphu',
            addressRegion: 'Thimphu',
            postalCode: '11001',
            addressCountry: 'BT'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 27.4726,
            longitude: 89.6393
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '127',
            bestRating: '5',
            worstRating: '1'
          },
          priceRange: '$$$',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '14:00'
            }
          ],
          sameAs: [
            'https://www.instagram.com/himalayanmarvels',
            'https://www.facebook.com/himalayanmarvels'
          ]
        }} />
      </body>
    </html>
  );
}
