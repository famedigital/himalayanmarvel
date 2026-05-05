/**
 * Image Component with Fallback
 * Handles broken Cloudinary URLs gracefully
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  sizes,
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      console.warn('Image failed to load:', src);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Show placeholder while loading or on error
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`} style={{ width, height }}>
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Image not available</p>
          <p className="text-[10px] text-gray-400 mt-1">Re-upload to new Cloudinary account</p>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="bg-gray-100 dark:bg-gray-800 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity ${className}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
