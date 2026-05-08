'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HomepageEditor from './frontend/HomepageEditor';
import AboutPageEditor from './frontend/AboutPageEditor';
import ConciergePageEditor from './frontend/ConciergePageEditor';
import ToursPageEditor from './frontend/ToursPageEditor';
import FooterEditor from './frontend/FooterEditor';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

interface FrontendContentManagerProps {
  initialContent: any[];
}

export default function FrontendContentManager({
  initialContent,
}: FrontendContentManagerProps) {
  const [activeTab, setActiveTab] = useState('homepage');

  // Convert array to key-value object for easier access
  const contentMap: Record<string, any> = {};
  initialContent?.forEach((item) => {
    contentMap[item.key] = item.value;
  });

  const handleSave = async (key: string, value: any) => {
    const supabase = createClient();
    const toastId = toast.loading('Saving changes...');

    try {
      // Check if key already exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .single();

      if (existing) {
        // Update existing
        await supabase
          .from('settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
      } else {
        // Insert new
        await supabase.from('settings').insert({
          key,
          value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      toast.success('Changes saved successfully', { id: toastId });
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save changes', { id: toastId });
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-1.5 rounded-xl shadow-sm">
          <TabsTrigger
            value="homepage"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Homepage
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="concierge"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Concierge
          </TabsTrigger>
          <TabsTrigger
            value="tours"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Tours
          </TabsTrigger>
          <TabsTrigger
            value="footer"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Footer
          </TabsTrigger>
          <TabsTrigger
            value="hero"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Hero
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Categories
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="homepage" className="mt-0">
            <HomepageEditor
              initialData={{
                homepage_hero: contentMap.homepage_hero,
                homepage_founder: contentMap.homepage_founder,
                homepage_trust: contentMap.homepage_trust,
                homepage_reviews: contentMap.homepage_reviews,
                homepage_journeys: contentMap.homepage_journeys,
                homepage_cinematic: contentMap.homepage_cinematic,
                homepage_faq: contentMap.homepage_faq,
                homepage_concierge_form: contentMap.homepage_concierge_form,
              }}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <AboutPageEditor
              initialData={contentMap}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="concierge" className="mt-0">
            <ConciergePageEditor
              initialData={contentMap}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="tours" className="mt-0">
            <ToursPageEditor
              initialData={contentMap}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="footer" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <FooterEditor
                initialData={contentMap.footer_content}
                onSave={(data) => handleSave('footer_content', data)}
              />
            </div>
          </TabsContent>

          <TabsContent value="hero" className="mt-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Hero Slider Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Manage homepage hero slides, videos, and all hero content.
                </p>
                <a
                  href="/admin/hero"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                >
                  Go to Hero Manager
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tour Categories Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Manage tour categories, pricing, and availability.
                </p>
                <a
                  href="/admin/tour-categories"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                >
                  Go to Tour Categories Manager
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
