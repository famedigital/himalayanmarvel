'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import Breadcrumbs from './Breadcrumbs';
import { SearchCommand } from './SearchCommand';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  role: 'admin' | 'reservation_staff' | 'account_staff';
}

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserProfile['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);

        // Fetch user role from user_profiles
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        setUserRole(profile?.role || null);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const userInitials = user?.email
    ? user.email
        .split('@')[0]
        .split('.')
        .map((n: string) => n[0].toUpperCase())
        .join('')
    : 'U';

  const canAccessSettings = userRole === 'admin' || userRole === 'account_staff';

  return (
    <header className="w-full">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop Search */}
          <div className="hidden md:flex">
            <SearchCommand />
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications (placeholder) */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Theme Toggle */}
          <div className="relative z-30">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-accent transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-4 py-3 text-sm font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/admin/settings" className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onSelect={handleLogout}>
                <div className="flex items-center gap-2 text-sm">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
