import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsTabs } from '@/components/admin/settings/SettingsTabs';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Check if user has access to settings (admin or account_staff)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const hasAccess = profile?.role === 'admin' || profile?.role === 'account_staff';

  if (!hasAccess) {
    redirect('/admin');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-xs mt-1">Manage company information and user access</p>
      </div>

      {/* Settings Tabs */}
      <SettingsTabs defaultTab="company" userRole={profile?.role} />
    </div>
  );
}
