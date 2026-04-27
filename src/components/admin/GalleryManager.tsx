'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import CloudinaryImagePicker from './CloudinaryImagePicker';

interface GalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export default function GalleryManager({ images, onChange, folder = 'himalayanmarvel' }: GalleryManagerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelectImage = (url: string) => {
    onChange([...images, url]);
  };

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
      {showPicker && (
        <CloudinaryImagePicker
          onSelect={handleSelectImage}
          onClose={() => setShowPicker(false)}
          folder={folder}
        />
      )}

      {/* Browse Cloudinary Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 flex flex-col items-center justify-center transition-all group"
        >
          <FolderOpen className="w-8 h-8 text-gray-900/30 group-hover:text-gray-900/50 mb-2" />
          <p className="text-gray-900/50 text-sm mb-1">Browse Cloudinary or Upload Images</p>
          <p className="text-gray-900/30 text-xs">Select from existing images or upload new ones</p>
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 20vw"
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors text-xs"
                  title="Move left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 hover:bg-red-600 rounded text-gray-900 transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                  disabled={index === images.length - 1}
                  className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 transition-colors text-xs"
                  title="Move right"
                >
                  →
                </button>
              </div>

              {/* Image Number */}
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-gray-900/50 rounded text-white text-xs">
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
