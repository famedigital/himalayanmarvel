import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Himalayan Marvels | Luxury Bhutan Tours & Adventures',
  description: 'Experience the mystical Kingdom of Bhutan with our premium tour packages. Discover ancient monasteries, pristine nature, and timeless traditions in the Last Shangri-La.',
  keywords: ['Bhutan tours', 'Himalayan travel', 'Bhutan tourism', 'Tiger\'s Nest', 'Bhutan trekking', 'luxury travel Bhutan', 'Bhutan adventure'],
  authors: [{ name: 'Himalayan Marvels' }],
  openGraph: {
    title: 'Himalayan Marvels | Luxury Bhutan Tours',
    description: 'Discover the mystical Kingdom of Bhutan with our premium tour packages.',
    type: 'website',
    url: 'https://himalayanmarvels.bt',
    siteName: 'Himalayan Marvels',
    images: [
      {
        url: 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4',
        width: 1200,
        height: 630,
        alt: 'Himalayan Marvels - Bhutan Tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Marvels | Luxury Bhutan Tours',
    description: 'Discover the mystical Kingdom of Bhutan with our premium tour packages.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="himalayan-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
