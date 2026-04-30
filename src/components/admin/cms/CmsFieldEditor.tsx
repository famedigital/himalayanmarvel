'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CmsFieldConfig, CmsFieldType } from '@/lib/supabase/cms-types';
import {
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Type,
  AlignLeft,
  Hash,
  DollarSign,
  Check,
} from 'lucide-react';
import { CmsMediaPicker } from './CmsMediaPicker';

interface CmsFieldEditorProps {
  field: CmsFieldConfig;
  value: string | number | boolean | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const FIELD_ICONS: Record<CmsFieldType, React.ElementType> = {
  text: Type,
  textarea: AlignLeft,
  richtext: AlignLeft,
  image: ImageIcon,
  video: Video,
  color: Hash,
  link: LinkIcon,
  number: DollarSign,
  boolean: Check,
};

export function CmsFieldEditor({
  field,
  value,
  onChange,
  disabled = false,
}: CmsFieldEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const Icon = FIELD_ICONS[field.type];
  const displayValue = value ?? '';

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'link':
        return (
          <Input
            id={field.key}
            type={field.type === 'link' ? 'url' : 'text'}
            value={displayValue as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={disabled}
            className="font-mono"
          />
        );

      case 'number':
        return (
          <Input
            id={field.key}
            type="number"
            value={displayValue as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="font-mono"
          />
        );

      case 'textarea':
      case 'richtext':
        return (
          <Textarea
            id={field.key}
            value={displayValue as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            maxLength={field.maxLength}
            disabled={disabled}
            className="font-mono resize-y"
          />
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              id={field.key}
              type="text"
              value={displayValue as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="font-mono flex-1"
              disabled={disabled}
            />
            <Input
              id={`${field.key}-picker`}
              type="color"
              value={(displayValue as string) || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-20 h-10 p-1 cursor-pointer"
            />
            {(displayValue as string) && (
              <div
                className="w-10 h-10 rounded border border-border"
                style={{ backgroundColor: displayValue as string }}
              />
            )}
          </div>
        );

      case 'image':
      case 'video':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id={field.key}
                type="text"
                value={displayValue as string}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Enter ${field.type} URL`}
                disabled={disabled}
                className="font-mono flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setMediaPickerOpen(true)}
                disabled={disabled}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </div>
            {(displayValue as string) && (
              <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                {field.type === 'image' ? (
                  <img
                    src={displayValue as string}
                    alt={field.label}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={displayValue as string}
                    className="w-full h-48 object-cover"
                    controls
                  />
                )}
              </div>
            )}
            <CmsMediaPicker
              open={mediaPickerOpen}
              onOpenChange={setMediaPickerOpen}
              onSelect={(url) => onChange(url)}
              type={field.type === 'image' ? 'image' : 'video'}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Button
              id={field.key}
              type="button"
              variant={displayValue ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(String(!displayValue))}
              disabled={disabled}
            >
              {displayValue ? 'Yes' : 'No'}
            </Button>
            <Badge variant={displayValue ? 'default' : 'secondary'}>
              {displayValue ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        );

      default:
        return (
          <Input
            id={field.key}
            value={displayValue as string}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        {(displayValue as string) && (
          <Badge variant="outline" className="text-xs">
            {String(displayValue).length} chars
          </Badge>
        )}
      </div>
      {renderField()}
      {field.helper && (
        <p className="text-xs text-muted-foreground">{field.helper}</p>
      )}
    </div>
  );
}
