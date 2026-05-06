'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import CloudinaryUpload from '../CloudinaryUpload';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  folder?: string;
}

export function ImageInput({
  value,
  onChange,
  onRemove,
  label,
  folder = 'himalayanmarvel'
}: ImageInputProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}

      {/* Current Image Preview - Compact */}
      {value && (
        <div className="relative group inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-20 w-auto max-w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            title="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputMode('upload')}
          type="button"
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            inputMode === 'upload'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload to Cloudinary
        </button>
        <button
          onClick={() => setInputMode('url')}
          type="button"
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            inputMode === 'url'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Enter URL
        </button>
      </div>

      {/* Upload Mode */}
      {inputMode === 'upload' && (
        <CloudinaryUpload
          onUploadComplete={onChange}
          folder={folder}
          label={undefined}
        />
      )}

      {/* URL Mode */}
      {inputMode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUrlSubmit();
              }
            }}
          />
          <button
            onClick={handleUrlSubmit}
            type="button"
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Set URL
          </button>
        </div>
      )}
    </div>
  );
}
