'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Briefcase,
  FileText,
  LogOut,
  Menu,
  Globe,
  BookOpen,
  Image as ImageIcon,
  Layers,
  Building2,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/admin/tours', icon: Map },
  { name: 'Categories', href: '/admin/tour-categories', icon: Layers },
  { name: 'Hero', href: '/admin/hero', icon: ImageIcon },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Itineraries', href: '/admin/itineraries', icon: BookOpen },
  { name: 'Operations', href: '/admin/bookings', icon: Briefcase },
  { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
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

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
            <Link
              href={item.href}
              onClick={onClick}
              className={cn(
                'flex h-full w-full items-center justify-center rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-stone-900 text-white border-stone-800">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:pl-4',
        isActive
          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
          : 'text-stone-700 hover:bg-stone-200 hover:text-stone-900'
      )}
    >
      <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
      <span>{item.name}</span>
    </Link>
  );
}

function NavContent({ collapsed, pathname, onLogout, onMobileClose }: NavContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-stone-200/50 bg-white px-4">
        <Link href="/admin" className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
            <span className="text-base font-bold">HM</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-stone-900 leading-tight">Himalayan</span>
              <span className="text-xs text-stone-500 leading-tight">Marvels Admin</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) && pathname !== item.href + '/new' && pathname !== item.href + '/edit';
            return (
              <NavItem
                key={item.name}
                item={item}
                isActive={isActive || false}
                collapsed={collapsed}
                onClick={onMobileClose}
              />
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t border-stone-200/50 bg-stone-50/50 p-3">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          onClick={onMobileClose}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-2',
            'text-stone-700 hover:bg-stone-200 hover:text-stone-900',
            collapsed && 'justify-center'
          )}
        >
          <Globe className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
          {!collapsed && <span>View Site</span>}
        </Link>

        <Separator className="my-2 bg-stone-200" />

        {/* Logout */}
        <button
          onClick={onLogout}
          className={cn(
            'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            'text-red-600 hover:bg-red-50 hover:text-red-700',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <div className="mt-2 hidden lg:block">
          <button
            onClick={() => {
              const newState = !collapsed;
              localStorage.setItem(COLLAPSED_STORAGE_KEY, String(newState));
              window.dispatchEvent(
                new CustomEvent('sidebar-toggle', { detail: { collapsed: newState } })
              );
            }}
            className={cn(
              'group flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'text-stone-500 hover:bg-stone-200 hover:text-stone-700',
              collapsed && 'justify-center'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
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

  const savedCollapsedRef = useRef(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    return saved === 'true';
  });

  const [collapsed, setCollapsed] = useState(savedCollapsedRef.current);

  useEffect(() => {
    onCollapsedChange?.(collapsed);
    setIsMounting(false);
  }, []);

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
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="inline-flex items-center justify-center rounded-xl bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 h-10 w-10 shadow-lg shadow-stone-200/50 transition-all hover:scale-105 active:scale-95 outline-hidden">
            <Menu className="h-5 w-5" strokeWidth={2.5} />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-stone-50 border-r border-stone-200">
            <NavContent
              collapsed={false}
              pathname={pathname}
              onLogout={handleLogout}
              onMobileClose={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 bg-white border-r border-stone-200 transition-all duration-300 ease-in-out',
          'shadow-xl shadow-stone-200/50',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          isMounting && 'opacity-0'
        )}
      >
        <NavContent
          collapsed={collapsed}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}
