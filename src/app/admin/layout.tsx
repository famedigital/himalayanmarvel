'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 w-64 border-r">
        <div className="flex h-16 items-center border-b px-6">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-24 ml-2" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="lg:ml-64">
        <div className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between px-6 h-full">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
        <main className="p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Auth check timed out')), 10000);
        });

        const {
          data: { user: authUser },
        } = await Promise.race([userPromise, timeoutPromise]);

        if (!authUser) {
          setUser(null);
          router.replace('/admin/login');
          return;
        }

        setUser(authUser);
      } catch {
        setUser(null);
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [isLoginPage, router, supabase]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <div className="sticky top-0 z-40 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 border-b border-sidebar-border">
          <Header />
        </div>
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 min-h-screen">
          <div className="admin-container">
            {children}
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
