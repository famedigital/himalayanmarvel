'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users } from 'lucide-react';
import { CompanySettingsForm } from './CompanySettingsForm';
import { UserManagementTable } from './UserManagementTable';

interface SettingsTabsProps {
  defaultTab?: string;
  userRole?: string;
}

export function SettingsTabs({ defaultTab = 'company', userRole }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-muted/50 p-1 rounded-lg inline-flex">
        <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Building2 className="w-4 h-4" />
          <span className="text-xs">Company</span>
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

      {userRole === 'admin' && (
        <TabsContent value="users" className="space-y-6">
          <UserManagementTable />
        </TabsContent>
      )}
    </Tabs>
  );
}
