'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import CloudinaryImagePicker from './CloudinaryImagePicker';

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  value?: string;
  label?: string;
  folder?: string;
  aspect?: 'video' | 'square' | 'passport' | 'portrait';
  size?: 'sm' | 'md' | 'lg';
  enableBrowse?: boolean;
}

const aspectClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  passport: 'aspect-[3/4]',
  portrait: 'aspect-[3/4]',
};

const sizeClasses = {
  sm: 'max-w-[120px]',
  md: 'max-w-[200px]',
  lg: 'max-w-full',
};

export default function CloudinaryUpload({
  onUploadComplete,
  onRemove,
  value,
  label = 'Upload Image',
  folder = 'himalayanmarvel',
  aspect = 'video',
  size = 'lg',
  enableBrowse = true,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // First, get the upload signature from our API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('upload_preset', 'ml_default'); // You can also use unsigned upload preset

      // For signed uploads, we need to go through our API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadToCloudinary(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  if (value) {
    return (
      <>
        {showPicker && (
          <CloudinaryImagePicker
            onSelect={onUploadComplete}
            onClose={() => setShowPicker(false)}
            currentUrl={value}
            folder={folder}
          />
        )}

        <div className={`relative group ${sizeClasses[size]}`}>
          <div className={`relative ${aspectClasses[aspect]} rounded-xl overflow-hidden border border-gray-200`}>
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
            />
            {onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-900/50 mt-2 truncate">{value}</p>

          {/* Browse Button to Change Image */}
          {enableBrowse && (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full mt-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 border border-blue-300 dark:border-blue-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <FolderOpen className="w-3 h-3" />
              Change Image
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {showPicker && (
        <CloudinaryImagePicker
          onSelect={onUploadComplete}
          onClose={() => setShowPicker(false)}
          currentUrl={value}
          folder={folder}
        />
      )}

      <div className={sizeClasses[size]}>
        <div
          {...getRootProps()}
          className={`
            relative ${aspectClasses[aspect]} rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragActive
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${uploading ? 'pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-900/70 text-sm">Uploading... {progress}%</p>
            </div>
          ) : (
            <div className="text-center">
              {isDragActive ? (
                <>
                  <Upload className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-gray-900/70 text-sm">Drop the image here</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-900/30 mx-auto mb-2" />
                  <p className="text-gray-900/50 text-sm mb-1">{label}</p>
                  <p className="text-gray-900/30 text-xs">or drag and drop</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Browse Cloudinary Button */}
        {enableBrowse && !value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(true);
            }}
            className="w-full mt-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-2 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Browse Cloudinary
          </button>
        )}
      </div>
    </>
  );
}
