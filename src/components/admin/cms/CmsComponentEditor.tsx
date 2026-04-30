'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CmsFieldEditor } from './CmsFieldEditor';
import { CmsComponent, CmsContent } from '@/lib/supabase/cms-types';
import { Save, Eye, EyeOff, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CmsComponentEditorProps {
  pagePath: string;
  component: CmsComponent;
  content: CmsContent[];
  onSave: (updates: Record<string, string>) => Promise<void>;
  onPreview?: () => void;
  loading?: boolean;
}

export function CmsComponentEditor({
  pagePath,
  component,
  content,
  onSave,
  onPreview,
  loading = false,
}: CmsComponentEditorProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Initialize form data from content
  useEffect(() => {
    const data: Record<string, string> = {};
    content.forEach((item) => {
      // Use draft version if exists, otherwise use published
      const value = item.is_draft && item.draft_version
        ? item.draft_version[item.content_key] || item.content_value || ''
        : item.content_value || item.media_url || item.color_value || '';

      data[item.content_key] = value as string;

      // Check if any content is draft
      if (item.is_draft) {
        setIsDraft(true);
      }
    });
    setFormData(data);
  }, [content]);

  // Set default values for fields that don't have content yet
  useEffect(() => {
    const updatedData = { ...formData };
    component.fields.forEach((field) => {
      if (!(field.key in updatedData) && field.defaultValue !== undefined) {
        updatedData[field.key] = String(field.defaultValue);
      }
    });
    if (Object.keys(updatedData).length !== Object.keys(formData).length) {
      setFormData(updatedData);
    }
  }, [component.fields]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      setHasChanges(true);
      return newData;
    });
  };

  const handleSave = async (asDraft = false) => {
    await onSave(formData);
    setHasChanges(false);
    if (!asDraft) {
      setIsDraft(false);
    }
  };

  const handlePublish = async () => {
    await handleSave(false);
  };

  const handleSaveDraft = async () => {
    await handleSave(true);
    setIsDraft(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{component.name}</CardTitle>
              {isDraft && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Draft
                </Badge>
              )}
            </div>
            <CardDescription>{component.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPreview}
                disabled={loading}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            {hasChanges && (
              <Badge variant="outline" className="gap-1">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="edit">Edit Content</TabsTrigger>
            <TabsTrigger value="settings">
              <FileText className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6 mt-6">
            {component.fields.map((field) => {
              const currentValue = formData[field.key] || '';

              return (
                <div key={field.key} className="space-y-2">
                  <CmsFieldEditor
                    field={field}
                    value={currentValue}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    disabled={loading}
                  />
                  {field.required && !currentValue && (
                    <p className="text-xs text-destructive">This field is required</p>
                  )}
                </div>
              );
            })}

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="draft-mode"
                  checked={isDraft}
                  onCheckedChange={setIsDraft}
                  disabled={loading}
                />
                <Label htmlFor="draft-mode" className="cursor-pointer">
                  Save as draft
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={loading || !hasChanges}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className={cn(
                    hasChanges && 'animate-pulse'
                  )}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {hasChanges ? 'Publish Changes' : 'Save'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-medium">Component Information</h4>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Component ID:</dt>
                  <dd className="font-mono">{component.id}</dd>
                  <dt className="text-muted-foreground">Page:</dt>
                  <dd className="font-mono">{pagePath}</dd>
                  <dt className="text-muted-foreground">Fields:</dt>
                  <dd>{component.fields.length}</dd>
                </dl>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-medium">Content Status</h4>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Total fields:</dt>
                  <dd>{component.fields.length}</dd>
                  <dt className="text-muted-foreground">Filled fields:</dt>
                  <dd>
                    {Object.values(formData).filter(Boolean).length} / {component.fields.length}
                  </dd>
                  <dt className="text-muted-foreground">Draft mode:</dt>
                  <dd>{isDraft ? 'Active' : 'Inactive'}</dd>
                </dl>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">About Drafts</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  When draft mode is enabled, changes are saved but not published to the live site.
                  Toggle off draft mode and click "Publish Changes" to make content visible to visitors.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
