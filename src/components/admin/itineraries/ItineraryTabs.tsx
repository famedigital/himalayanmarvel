'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, Save, Receipt, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItineraryTabsProps {
  itineraryId: string;
  activeTab: string;
  hasConfirmedInvoice: boolean;
}

export function ItineraryTabs({ itineraryId, activeTab, hasConfirmedInvoice }: ItineraryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    ...(hasConfirmedInvoice ? [{ id: 'operations', label: 'Operations', icon: Briefcase } as const] : []),
  ];

  const setActiveTab = (tabId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    router.push(url.search, { scroll: false });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
