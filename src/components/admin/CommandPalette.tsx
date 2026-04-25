'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { createClient } from '@/lib/supabase/client';
import { Tour, Booking, Blog } from '@/lib/supabase/types';
import {
  Search,
  FileText,
  Calendar,
  Settings,
  Sun,
  Moon,
  Plus,
  type LucideIcon,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Action {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Quick actions
  const quickActions: Action[] = [
    {
      id: 'new-tour',
      label: 'Create New Tour',
      icon: Plus,
      action: () => {
        router.push('/admin/tours/new');
        onOpenChange(false);
      },
      shortcut: 'N',
    },
    {
      id: 'new-booking',
      label: 'Create New Booking',
      icon: Calendar,
      action: () => {
        router.push('/admin/bookings/new');
        onOpenChange(false);
      },
      shortcut: 'B',
    },
    {
      id: 'new-blog',
      label: 'Create New Blog Post',
      icon: FileText,
      action: () => {
        router.push('/admin/blog/new');
        onOpenChange(false);
      },
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      icon: Settings,
      action: () => {
        router.push('/admin/settings');
        onOpenChange(false);
      },
      shortcut: 'S',
    },
  ];

  // Fetch data on mount
  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursRes, bookingsRes, blogsRes] = await Promise.all([
        supabase.from('tours').select('id, title, slug').limit(10),
        supabase.from('bookings').select('id, client_name, tour_id').limit(10),
        supabase.from('blogs').select('id, title, slug').limit(10),
      ]);

      if (toursRes.data) setTours(toursRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (blogsRes.data) setBlogs(blogsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter results based on search query
  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActions = quickActions.filter(
    (action) =>
      action.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate functions
  const navigateToTour = (tourId: string) => {
    router.push(`/admin/tours/${tourId}/edit`);
    onOpenChange(false);
  };

  const navigateToBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}/edit`);
    onOpenChange(false);
  };

  const navigateToBlog = (blogId: string) => {
    router.push(`/admin/blog/${blogId}/edit`);
    onOpenChange(false);
  };

  // Keyboard shortcut for theme toggle (simplified - you may want to integrate with next-themes)
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    onOpenChange(false);
  };

  const hasResults =
    filteredTours.length > 0 ||
    filteredBookings.length > 0 ||
    filteredBlogs.length > 0 ||
    filteredActions.length > 0 ||
    searchQuery.length === 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tours, bookings, blogs..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {loading ? (
          <CommandEmpty>Loading...</CommandEmpty>
        ) : !hasResults ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}

        {/* Quick Actions */}
        {filteredActions.length > 0 && (
          <CommandGroup heading="Quick Actions">
            {filteredActions.map((action) => (
              <CommandItem
                key={action.id}
                onSelect={action.action}
                className="cursor-pointer"
              >
                <action.icon className="w-4 h-4 mr-2" />
                <span>{action.label}</span>
                {action.shortcut && (
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Tours */}
        {filteredTours.length > 0 && (
          <CommandGroup heading="Tours">
            {filteredTours.map((tour) => (
              <CommandItem
                key={tour.id}
                onSelect={() => navigateToTour(tour.id)}
                className="cursor-pointer"
              >
                <Search className="w-4 h-4 mr-2" />
                <span>{tour.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Bookings */}
        {filteredBookings.length > 0 && (
          <>
            {filteredTours.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Bookings">
              {filteredBookings.map((booking) => (
                <CommandItem
                  key={booking.id}
                  onSelect={() => navigateToBooking(booking.id)}
                  className="cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{booking.client_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Blogs */}
        {filteredBlogs.length > 0 && (
          <>
            {(filteredTours.length > 0 || filteredBookings.length > 0) && (
              <CommandSeparator />
            )}
            <CommandGroup heading="Blog Posts">
              {filteredBlogs.map((blog) => (
                <CommandItem
                  key={blog.id}
                  onSelect={() => navigateToBlog(blog.id)}
                  className="cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{blog.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Theme Toggle */}
        {(searchQuery.length === 0 || filteredActions.length > 0) && (
          <>
            {(filteredTours.length > 0 ||
              filteredBookings.length > 0 ||
              filteredBlogs.length > 0) && <CommandSeparator />}
            <CommandGroup heading="Preferences">
              <CommandItem
                onSelect={toggleTheme}
                className="cursor-pointer"
              >
                <Sun className="w-4 h-4 mr-2 dark:hidden" />
                <Moon className="w-4 h-4 mr-2 hidden dark:block" />
                <span className="dark:hidden">Switch to Dark Mode</span>
                <span className="hidden dark:inline">Switch to Light Mode</span>
                <CommandShortcut>T</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

// Keyboard shortcut hook for triggering the command palette
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
