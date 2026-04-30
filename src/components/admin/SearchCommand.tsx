'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, FileText, Map, Briefcase, BookOpen, Layers, Image as ImageIcon, Globe, Building2, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const searchItems: SearchResult[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, category: 'Main' },
  { title: 'Tours', href: '/admin/tours', icon: Map, category: 'Main' },
  { title: 'Operations', href: '/admin/bookings', icon: Briefcase, category: 'Main' },
  { title: 'Itineraries', href: '/admin/itineraries', icon: BookOpen, category: 'Content' },
  { title: 'New Itinerary', href: '/admin/itineraries/new', icon: BookOpen, category: 'Content' },
  { title: 'Tour Categories', href: '/admin/tour-categories', icon: Layers, category: 'Content' },
  { title: 'Hero Slider', href: '/admin/hero', icon: ImageIcon, category: 'Content' },
  { title: 'Blog Posts', href: '/admin/blog', icon: FileText, category: 'Content' },
  { title: 'New Blog Post', href: '/admin/blog/new', icon: FileText, category: 'Content' },
  { title: 'Bank Details', href: '/admin/bank-details', icon: Building2, category: 'Settings' },
  { title: 'Settings', href: '/admin/settings', icon: Globe, category: 'Settings' },
];

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [open]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const flatResults = filteredResults;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter' && flatResults.length > 0) {
      e.preventDefault();
      router.push(flatResults[selectedIndex].href);
      setOpen(false);
      setQuery('');
    }
  }, [filteredResults, selectedIndex, router]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-3 w-64 lg:w-72 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent hover:border-orange-500/50 hover:bg-white dark:hover:bg-white/10 transition-all outline-none text-sm text-left"
      >
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-gray-500 dark:text-gray-400 flex-1">
          Search... <kbd className="ml-auto opacity-50">⌘K</kbd>
        </span>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <div
            ref={overlayRef}
            className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-white/10">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
              />
              <kbd className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No results found for &quot;{query}&quot;</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((item, index) => {
                      const globalIndex = filteredResults.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleSelect(item.href)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                            globalIndex === selectedIndex
                              ? 'bg-orange-500/20 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                          )}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1">{item.title}</span>
                          {globalIndex === selectedIndex && (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-white/10 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded">esc</kbd>
                close
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
