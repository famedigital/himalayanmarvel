import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsTabs } from '@/components/admin/settings/SettingsTabs';
import { getSetting, type ThemeTokens } from '@/lib/cms/settings';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const params = searchParams ? await searchParams : {};

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const hasAccess = profile?.role === 'admin' || profile?.role === 'account_staff';

  if (!hasAccess) {
    redirect('/admin/dashboard');
  }

  const themeTokens = await getSetting<ThemeTokens>('theme_tokens');
  const defaultTab =
    params.tab === 'theme' || params.tab === 'users' || params.tab === 'company'
      ? params.tab
      : 'company';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-xs mt-1">
          Company, brand theme, and user access
        </p>
      </div>

      <SettingsTabs
        defaultTab={defaultTab}
        userRole={profile?.role}
        initialThemeTokens={themeTokens}
      />
    </div>
  );
}
