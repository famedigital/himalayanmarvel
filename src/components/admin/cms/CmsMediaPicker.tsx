'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import CloudinaryImagePicker from '../CloudinaryImagePicker';
import { Loader2, Link as LinkIcon, Image as ImageIcon, Video } from 'lucide-react';

interface CmsMediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  type: 'image' | 'video';
}

export function CmsMediaPicker({
  open,
  onOpenChange,
  onSelect,
  type,
}: CmsMediaPickerProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'url'>('library');
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleSelect = () => {
    if (selectedUrl || customUrl) {
      onSelect(selectedUrl || customUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setCustomUrl('');
    setSelectedUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'image' ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
            Select {type === 'image' ? 'Image' : 'Video'}
          </DialogTitle>
          <DialogDescription>
            Choose from your media library or enter a custom URL
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media Library
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              Custom URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-4">
            <div className="space-y-4">
              <CloudinaryImagePicker
                onSelect={(url) => {
                  setSelectedUrl(url);
                  handleSelect();
                }}
                onClose={() => onOpenChange(false)}
                folder="himalayanmarvel"
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-url">Media URL</Label>
                <Input
                  id="custom-url"
                  type="url"
                  placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to your {type}. Supports external URLs from other sources.
                </p>
              </div>

              {customUrl && (
                <div className="rounded-lg border border-border p-4 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  {type === 'image' ? (
                    <img
                      src={customUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                      onError={() => setCustomUrl('')}
                    />
                  ) : (
                    <video
                      src={customUrl}
                      className="w-full h-48 object-cover rounded"
                      controls
                      onError={() => setCustomUrl('')}
                    />
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'url' && (
            <Button onClick={handleSelect} disabled={!customUrl}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Use This URL
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
