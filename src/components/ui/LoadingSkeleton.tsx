/**
 * LoadingSkeleton — Animated skeleton loading states
 *
 * Provides visual feedback while content is loading.
 * Use for cards, images, and any async content.
 */

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-dark-forest border border-neutral-200 dark:border-neutral-800">
          <LoadingSkeleton className="h-48 w-full" />
          <div className="p-6 space-y-4">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-full" />
            <LoadingSkeleton className="h-3 w-2/3" />
            <div className="pt-4 flex items-center justify-between">
              <LoadingSkeleton className="h-6 w-20" />
              <LoadingSkeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-neutral-900" aria-hidden="true">
      <LoadingSkeleton className="h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <LoadingSkeleton className="h-8 w-48 mx-auto" />
          <LoadingSkeleton className="h-20 w-full max-w-3xl mx-auto" />
          <LoadingSkeleton className="h-6 w-64 mx-auto" />
          <LoadingSkeleton className="h-14 w-40 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}
