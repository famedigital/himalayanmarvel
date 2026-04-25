'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import Breadcrumbs from './Breadcrumbs';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({
  onMobileMenuToggle,
  sidebarCollapsed = false,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    setUserMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-20 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}
    >
      <div className="relative flex h-16 w-full items-center gap-4 px-4 lg:px-6">
        {/* Left: Mobile menu trigger + Breadcrumbs */}
        <div className="flex items-center gap-4 min-w-0 pr-4">
          {/* Mobile menu button - shown on all screens for consistency */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden md:block min-w-0">
            <Breadcrumbs pathname={pathname} />
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 lg:gap-3">
          {/* Search (desktop/tablet) */}
          <div className="hidden md:block">
            <div className="relative w-72 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900" />
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden z-20">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin
              </span>
              <ChevronDown className="hidden lg:block w-4 h-4 text-gray-500" />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden z-20">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      admin@himalayanmarvels.com
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
