'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface GalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export default function GalleryManager({ images, onChange, folder = 'himalayanmarvel' }: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange([...images, data.url]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadToCloudinary(acceptedFiles[0]);
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
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
            <p className="text-gray-900/70 text-sm">Uploading...</p>
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
                <p className="text-gray-900/50 text-sm mb-1">Click or drag to add images</p>
                <p className="text-gray-900/30 text-xs">PNG, JPG, WEBP up to 10MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
            >
              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => moveImage(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors"
                  title="Move left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-gray-900 transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                  disabled={index === images.length - 1}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors"
                  title="Move right"
                >
                  →
                </button>
              </div>

              {/* Image Number */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900/50 rounded-full text-gray-900 text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="mt-3 text-gray-900/50 text-sm text-center">
          {images.length} image{images.length !== 1 ? 's' : ''} in gallery
        </p>
      )}
    </div>
  );
}
