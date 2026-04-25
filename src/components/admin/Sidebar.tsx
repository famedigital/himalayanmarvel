'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  Globe,
  BookOpen,
  Image as ImageIcon,
  Layers,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/admin/tours', icon: Map },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Itineraries', href: '/admin/itineraries', icon: BookOpen },
  { name: 'Tour Categories', href: '/admin/tour-categories', icon: Layers },
  { name: 'Hero', href: '/admin/hero', icon: ImageIcon },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Bank Details', href: '/admin/bank-details', icon: Building2 },
  { name: 'Settings', href: '/admin/settings', icon: Globe },
];

const COLLAPSED_STORAGE_KEY = 'admin-sidebar-collapsed';

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface NavContentProps {
  collapsed: boolean;
  pathname: string | null;
  onLogout: () => void;
  onMobileClose?: () => void;
}

function NavContent({ collapsed, pathname, onLogout, onMobileClose }: NavContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <Link
          href="/admin/dashboard"
          className="flex items-center justify-center gap-3"
          onClick={onMobileClose}
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png"
              alt="Himalayan Marvels"
              fill
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Himalayan Marvels
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Admin Panel
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative',
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  'font-medium whitespace-nowrap transition-all duration-300',
                  collapsed
                    ? 'opacity-0 w-0 overflow-hidden'
                    : 'opacity-100 w-auto'
                )}
              >
                {item.name}
              </span>
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* View Site */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all group relative',
            collapsed ? 'justify-center' : ''
          )}
          title={collapsed ? 'View Site' : undefined}
        >
          <Globe className="w-5 h-5 flex-shrink-0" />
          <span
            className={cn(
              'font-medium whitespace-nowrap transition-all duration-300',
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            )}
          >
            View Site
          </span>
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              View Site
            </div>
          )}
        </Link>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={onLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-500/10 transition-all w-full group relative',
            collapsed ? 'justify-center' : ''
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={cn(
              'font-medium whitespace-nowrap transition-all duration-300',
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            )}
          >
            Logout
          </span>
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden lg:block p-3 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={() => {
            const newState = !collapsed;
            localStorage.setItem(COLLAPSED_STORAGE_KEY, String(newState));
            window.dispatchEvent(
              new CustomEvent('sidebar-toggle', { detail: { collapsed: newState } })
            );
          }}
          className="flex items-center justify-center w-full px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounting, setIsMounting] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Initialize collapsed state from localStorage using useRef for initial state
  const savedCollapsedRef = useRef(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    return saved === 'true';
  });

  const [collapsed, setCollapsed] = useState(savedCollapsedRef.current);

  // Notify parent of initial collapsed state
  useEffect(() => {
    onCollapsedChange?.(collapsed);
    setIsMounting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleToggle = (e: CustomEvent<{ collapsed: boolean }>) => {
      setCollapsed(e.detail.collapsed);
      onCollapsedChange?.(e.detail.collapsed);
    };

    window.addEventListener(
      'sidebar-toggle',
      handleToggle as EventListener
    );
    return () => {
      window.removeEventListener(
        'sidebar-toggle',
        handleToggle as EventListener
      );
    };
  }, [onCollapsedChange]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }, [supabase, router]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm text-gray-700 dark:text-gray-300"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10">
            <NavContent
              collapsed={false}
              pathname={pathname}
              onLogout={handleLogout}
              onMobileClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 transition-all duration-300 ease-in-out z-30',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          isMounting && 'opacity-0'
        )}
      >
        <NavContent
          collapsed={collapsed}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
}
