import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, MapPin, Users, Calendar, Check, X, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';
import JsonLd from '@/components/seo/JsonLd';
import { generateSeoMetadata, generateTouristTripSchema, generateBreadcrumbSchema, getCanonicalUrl } from '@/lib/seo';
import type { Metadata } from 'next';

interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  hero_image?: string;
  duration?: number;
  price?: number;
  category?: string;
  highlights?: string[];
  itinerary?: Array<{
    day: string;
    title: string;
    description: string;
    activities?: string[];
  }>;
  inclusions?: string[];
  exclusions?: string[];
  gallery_images?: string[];
  created_at: string;
  updated_at: string;
}

async function getTour(slug: string): Promise<Tour | null> {
  const supabase = await createClient();

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return tour;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return {};
  }

  const description = tour.excerpt || tour.description || '';
  const image = tour.hero_image || '/og-image.jpg';

  return generateSeoMetadata({
    title: tour.title,
    description,
    image,
    canonical: `/tours/${tour.slug}`,
    type: 'website',
  });
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    notFound();
  }

  // Generate JSON-LD schemas
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: tour.title, href: `/tours/${tour.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema({ items: breadcrumbItems });

  const touristTripSchema = generateTouristTripSchema({
    name: tour.title,
    description: tour.description,
    slug: tour.slug,
    image: tour.hero_image || '',
    price: tour.price,
    duration: tour.duration ? `P${tour.duration}D` : undefined,
  });

  const jsonLdData = [breadcrumbSchema, touristTripSchema];

  return (
    <main className="min-h-screen dark:bg-black bg-neutral-50">
      <JsonLd data={jsonLdData} />
      <Navigation />

      {/* Hero */}
      <section className="pt-24">
        {tour.hero_image && (
          <div className="relative h-[50vh] min-h-[400px]">
            <img
              src={tour.hero_image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 dark:bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container-premium">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{tour.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  {tour.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{tour.duration} days</span>
                    </div>
                  )}
                  {tour.price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-2xl font-bold text-white">${Number(tour.price).toLocaleString()}</span>
                    </div>
                  )}
                  {tour.category && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      {tour.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {tour.description && (
                <div>
                  <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-4">About This Tour</h2>
                  <p className="dark:text-white/70 text-neutral-700 leading-relaxed">{tour.description}</p>
                </div>
              )}

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-4">Tour Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="dark:text-white/70 text-neutral-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-6">Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day: any) => (
                      <div key={day.day} className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full dark:bg-white/10 bg-neutral-200 flex items-center justify-center">
                            <span className="text-sm font-bold dark:text-white text-neutral-900">{day.day}</span>
                          </div>
                        </div>
                        <div className="flex-1 dark:bg-white/5 bg-white rounded-xl p-6 border dark:border-white/10 border-neutral-200">
                          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-2">{day.title}</h3>
                          <p className="dark:text-white/60 text-neutral-600 mb-3">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 dark:bg-white/10 bg-neutral-100 rounded-full text-xs dark:text-white/60 text-neutral-600">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8">
                {tour.inclusions && tour.inclusions.length > 0 && (
                  <div className="dark:bg-white/5 bg-white rounded-xl p-6 border dark:border-white/10 border-neutral-200">
                    <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.inclusions.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 dark:text-white/70 text-neutral-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tour.exclusions && tour.exclusions.length > 0 && (
                  <div className="dark:bg-white/5 bg-white rounded-xl p-6 border dark:border-white/10 border-neutral-200">
                    <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" />
                      Not Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.exclusions.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 dark:text-white/70 text-neutral-700">
                          <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Gallery */}
              {tour.gallery_images && tour.gallery_images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tour.gallery_images.map((image: string, index: number) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 dark:bg-white/5 bg-white rounded-2xl p-6 border dark:border-white/10 border-neutral-200 shadow-xl">
                <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-6">Book This Tour</h3>

                {tour.price && (
                  <div className="mb-6 pb-6 border-b dark:border-white/10 border-neutral-200">
                    <p className="text-sm dark:text-white/50 text-neutral-500">Starting from</p>
                    <p className="text-3xl font-bold dark:text-white text-neutral-900">${Number(tour.price).toLocaleString()}</p>
                    <p className="text-sm dark:text-white/50 text-neutral-500">per person</p>
                  </div>
                )}

                <a
                  href={`https://wa.me/97577270465?text=Hi%2C%20I'm%20interested%20in%20booking%20the%20tour%3A%20${encodeURIComponent(tour.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Book via WhatsApp
                </a>

                <a
                  href="#contact"
                  className="w-full py-4 px-6 dark:bg-white/10 bg-neutral-100 hover:dark:bg-white/20 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Inquiry
                </a>

                <div className="mt-6 pt-6 border-t dark:border-white/10 border-neutral-200">
                  <p className="text-sm dark:text-white/50 text-neutral-500 mb-2">Need help?</p>
                  <p className="text-sm dark:text-white/70 text-neutral-700">Contact us directly for custom quotes and group discounts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Copyright */}
      <footer className="py-8 border-t dark:border-white/10 border-neutral-200">
        <div className="container-premium text-center">
          <p className="text-sm dark:text-white/50 text-neutral-500">
            © {new Date().getFullYear()} Himalayan Marvels. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
