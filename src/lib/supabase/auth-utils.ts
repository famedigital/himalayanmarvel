/**
 * Auth utilities for handling Supabase authentication errors
 */

export function isAuthError(error: any): boolean {
  return error?.message?.includes('Refresh Token') ||
         error?.message?.includes('Invalid Refresh Token') ||
         error?.message?.includes('JWT') ||
         error?.code === 'PGRST301' ||
         error?.status === 401;
}

export async function clearAuthState() {
  if (typeof window === 'undefined') return;

  // Clear all Supabase related storage
  const keysToRemove: string[] = [];

  // Clear localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes('supabase')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Clear sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.includes('supabase')) {
      sessionStorage.removeItem(key);
    }
  }

  // Reload page to force fresh auth
  window.location.href = '/admin/login';
}

export function handleAuthError(error: any) {
  if (isAuthError(error)) {
    console.error('Authentication error - clearing session...');
    clearAuthState();
    return true;
  }
  return false;
}
