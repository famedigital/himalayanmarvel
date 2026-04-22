'use client';

import { useState } from 'react';
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
  Image,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/admin/tours', icon: Map },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Itineraries', href: '/admin/itineraries', icon: BookOpen },
  { name: 'Hero', href: '/admin/hero', icon: Image },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Globe },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="https://res.cloudinary.com/dxztrqjft/image/upload/v1776332482/HMT_Logo_New_1_fwgpfy.png"
              alt="Himalayan Marvels"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Himalayan Marvels</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 md:p-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-gray-900 border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Site */}
      <div className="p-4 md:p-6 border-t border-gray-200">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <Globe className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-4 md:p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/90 backdrop-blur-xl border border-gray-200 shadow-sm text-gray-700"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <NavContent />
      </div>
    </>
  );
}
