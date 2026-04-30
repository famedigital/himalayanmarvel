'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CmsPageSelector } from './CmsPageSelector';
import { CmsComponentEditor } from './CmsComponentEditor';
import { CmsPage, CmsContent, CmsComponent } from '@/lib/supabase/cms-types';
import { getComponentsForPage } from '@/lib/supabase/cms-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Save,
  ExternalLink,
  RefreshCw,
  FileText,
  Layers,
  CheckCircle2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

interface CmsAdminPanelProps {
  initialPages: CmsPage[];
}

export default function CmsAdminPanel({ initialPages }: CmsAdminPanelProps) {
  const [pages, setPages] = useState<CmsPage[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<CmsComponent | null>(null);
  const [pageContent, setPageContent] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'settings'>('components');
  const supabase = createClient();

  // Fetch content for selected page
  const fetchPageContent = useCallback(async (pagePath: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page_path', pagePath)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPageContent(data || []);
    } catch (error) {
      console.error('Error fetching page content:', error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Handle page selection
  const handlePageSelect = useCallback((page: CmsPage) => {
    setSelectedPage(page);
    setSelectedComponent(null);
    fetchPageContent(page.page_path);
  }, [fetchPageContent]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string) => {
    const components = getComponentsForPage(selectedPage!.page_path);
    const component = components.find((c) => c.id === componentId);
    if (component) {
      setSelectedComponent(component);
    }
  }, [selectedPage]);

  // Handle saving content
  const handleSave = useCallback(async (formData: Record<string, string>) => {
    if (!selectedPage || !selectedComponent) return;

    setSaving(true);
    try {
      const timestamp = new Date().toISOString();

      // Prepare updates for each field
      const updates = Object.entries(formData).map(([key, value]) => {
        // Check if this content already exists
        const existingContent = pageContent.find(
          (c) => c.component_id === selectedComponent.id && c.content_key === key
        );

        if (existingContent) {
          // Update existing content
          return supabase
            .from('cms_content')
            .update({
              content_value: value,
              updated_at: timestamp,
            })
            .eq('id', existingContent.id);
        } else {
          // Insert new content
          return supabase
            .from('cms_content')
            .insert({
              page_path: selectedPage.page_path,
              component_id: selectedComponent.id,
              content_key: key,
              content_value: value,
              updated_at: timestamp,
            });
        }
      });

      await Promise.all(updates);

      toast.success('Content saved successfully', {
        description: `Changes to ${selectedComponent.name} have been published.`,
      });

      // Refetch page content
      await fetchPageContent(selectedPage.page_path);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setSaving(false);
    }
  }, [selectedPage, selectedComponent, pageContent, supabase, fetchPageContent]);

  // Get components for selected page
  const availableComponents = selectedPage
    ? getComponentsForPage(selectedPage.page_path)
    : [];

  // Get content for selected component
  const componentContent = selectedComponent
    ? pageContent.filter((c) => c.component_id === selectedComponent.id)
    : [];

  // Handle preview
  const handlePreview = useCallback(() => {
    if (selectedPage) {
      window.open(selectedPage.page_path, '_blank');
    }
  }, [selectedPage]);

  // Calculate content stats
  const getContentStats = useCallback(() => {
    if (!selectedPage) return null;

    const totalFields = availableComponents.reduce(
      (sum, comp) => sum + comp.fields.length,
      0
    );
    const filledFields = pageContent.filter((c) => c.content_value).length;
    const draftCount = pageContent.filter((c) => c.is_draft).length;

    return {
      total: totalFields,
      filled: filledFields,
      drafts: draftCount,
      percentage: totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0,
    };
  }, [selectedPage, availableComponents, pageContent]);

  const stats = getContentStats();

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Page to Edit</CardTitle>
          <CardDescription>
            Choose which page you want to edit content for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CmsPageSelector
            pages={pages}
            selectedPage={selectedPage}
            onPageSelect={handlePageSelect}
          />
        </CardContent>
      </Card>

      {selectedPage && (
        <>
          {/* Page Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Page</p>
                    <p className="text-2xl font-bold">{selectedPage.page_name}</p>
                  </div>
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {stats && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <p className="text-2xl font-bold">{stats.percentage}%</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Fields Filled</p>
                        <p className="text-2xl font-bold">
                          {stats.filled} / {stats.total}
                        </p>
                      </div>
                      <Layers className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Drafts</p>
                        <p className="text-2xl font-bold">{stats.drafts}</p>
                      </div>
                      <FileText className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Component Selector and Editor */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="settings">Page Settings</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPageContent(selectedPage.page_path)}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Page
                </Button>
              </div>
            </div>

            <TabsContent value="components" className="space-y-6 mt-6">
              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : selectedComponent ? (
                <CmsComponentEditor
                  pagePath={selectedPage.page_path}
                  component={selectedComponent}
                  content={componentContent}
                  onSave={handleSave}
                  onPreview={handlePreview}
                  loading={saving}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Select a Component</CardTitle>
                    <CardDescription>
                      Choose which section of the page you want to edit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableComponents.map((component) => {
                        const componentContentCount = pageContent.filter(
                          (c) => c.component_id === component.id
                        ).length;

                        return (
                          <button
                            key={component.id}
                            onClick={() => handleComponentSelect(component.id)}
                            className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all text-left group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium group-hover:text-primary transition-colors">
                                {component.name}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {componentContentCount} / {component.fields.length}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {component.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Information</CardTitle>
                  <CardDescription>
                    Details about the current page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Page Name</dt>
                      <dd className="font-medium">{selectedPage.page_name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Path</dt>
                      <dd className="font-mono">{selectedPage.page_path}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Editable</dt>
                      <dd>
                        {selectedPage.is_editable ? (
                          <Badge variant="default">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Order</dt>
                      <dd>{selectedPage.order_index}</dd>
                    </div>
                  </dl>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Available Components</h4>
                    <div className="space-y-2">
                      {availableComponents.map((component) => {
                        const filledCount = pageContent.filter(
                          (c) => c.component_id === component.id && c.content_value
                        ).length;

                        return (
                          <div
                            key={component.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{component.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {component.description}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {filledCount} / {component.fields.length}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
