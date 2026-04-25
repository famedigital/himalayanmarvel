'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import MobileNav from '@/components/admin/MobileNav';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const isLoginPage = pathname === '/admin/login';

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Always-available theme toggle (all admin pages) */}
      <div className="fixed top-4 right-4 z-50">
        <div className="p-1 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-sm">
          <ThemeToggle />
        </div>
      </div>
      <Sidebar onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
