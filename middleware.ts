import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();

  // Protected admin routes - redirect to login if not authenticated
  const isAuthPage = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !isAuthPage && !data.user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If on login page and already authenticated, redirect to dashboard
  if (isAuthPage && data.user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  const response = NextResponse.next({
    request,
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
