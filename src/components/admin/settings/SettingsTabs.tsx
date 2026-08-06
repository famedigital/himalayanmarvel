'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Palette } from 'lucide-react';
import { CompanySettingsForm } from './CompanySettingsForm';
import { UserManagementTable } from './UserManagementTable';
import { ThemeSettingsForm } from './ThemeSettingsForm';
import type { ThemeTokens } from '@/lib/cms/settings';

interface SettingsTabsProps {
  defaultTab?: string;
  userRole?: string;
  initialThemeTokens?: Partial<ThemeTokens> | null;
}

export function SettingsTabs({
  defaultTab = 'company',
  userRole,
  initialThemeTokens,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-muted/50 p-1 rounded-lg inline-flex flex-wrap h-auto gap-1">
        <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Building2 className="w-4 h-4" />
          <span className="text-xs">Company</span>
        </TabsTrigger>
        <TabsTrigger value="theme" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Palette className="w-4 h-4" />
          <span className="text-xs">Theme</span>
        </TabsTrigger>
        {userRole === 'admin' && (
          <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="w-4 h-4" />
            <span className="text-xs">Users</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="company" className="space-y-6">
        <CompanySettingsForm />
      </TabsContent>

      <TabsContent value="theme" className="space-y-6">
        <ThemeSettingsForm initialTokens={initialThemeTokens} />
      </TabsContent>

      {userRole === 'admin' && (
        <TabsContent value="users" className="space-y-6">
          <UserManagementTable />
        </TabsContent>
      )}
    </Tabs>
  );
}
