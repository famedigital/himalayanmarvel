'use client';

import { cn } from '@/lib/utils';

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * LayoutWrapper - Ensures footer stays at bottom of viewport
 * Uses flexbox layout with flex-1 on content to push footer down
 */
export function LayoutWrapper({ children, className }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className={cn('flex-1', className)}>
        {children}
      </div>
    </div>
  );
}
