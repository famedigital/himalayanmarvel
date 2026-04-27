import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';

async function getTours() {
  const supabase = await createClient();

  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return tours || [];
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <main className="min-h-screen dark:bg-black bg-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container-premium">
          <h1 className="text-5xl md:text-6xl font-bold dark:text-white text-neutral-900 mb-4">
            Our <span className="gradient-text">Tours</span>
          </h1>
          <p className="text-xl dark:text-white/60 text-neutral-600 max-w-2xl">
            Discover the magic of Bhutan with our carefully curated tour packages
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="pb-24 px-4">
        <div className="container-premium">
          {tours.length === 0 ? (
            <div className="text-center py-24">
              <p className="dark:text-white/50 text-neutral-500 text-lg">No tours available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour: any, index) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group"
                >
                  <article className="dark:bg-white/5 bg-white rounded-3xl overflow-hidden border dark:border-white/10 border-neutral-200 hover:shadow-2xl transition-all duration-500 h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {tour.hero_image ? (
                        <img
                          src={tour.hero_image}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full dark:bg-white/10 bg-neutral-200 flex items-center justify-center">
                          <MapPin className="w-12 h-12 dark:text-white/20 text-neutral-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 dark:bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      {tour.category && (
                        <span className="text-xs dark:text-white/50 text-neutral-500 uppercase tracking-wider">
                          {tour.category}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mt-2 mb-3">
                        {tour.title}
                      </h2>

                      {/* Description */}
                      {tour.description && (
                        <p className="text-sm dark:text-white/60 text-neutral-600 line-clamp-2 mb-4">
                          {tour.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-sm dark:text-white/50 text-neutral-600">
                        {tour.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration} days</span>
                          </div>
                        )}
                        {tour.price && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{Number(tour.price).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Link */}
                      <div className="flex items-center gap-2 text-sm font-medium dark:text-orange-400 text-orange-600">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
