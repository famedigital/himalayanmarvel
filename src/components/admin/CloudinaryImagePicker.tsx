'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Image as ImageIcon, Loader2, Search, FolderOpen, RefreshCw, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import CloudinaryUpload from './CloudinaryUpload';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
}

interface CloudinaryImagePickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  currentUrl?: string;
  folder?: string;
}

export default function CloudinaryImagePicker({
  onSelect,
  onClose,
  currentUrl,
  folder = 'himalayanmarvel'
}: CloudinaryImagePickerProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(folder);
  const [viewMode, setViewMode] = useState<'browse' | 'upload'>('browse');
  const modalRef = useRef<HTMLDivElement>(null);

  // Updated folders for new Cloudinary structure
  const folders = [
    { id: 'himalayanmarvel', name: 'All Images' },
    { id: 'himalayanmarvel/hero', name: 'Hero Images' },
    { id: 'himalayanmarvel/blog', name: 'Blog Images' },
    { id: 'himalayanmarvel/tours', name: 'Tour Images' },
    { id: 'himalayanmarvel/itineraries', name: 'Itinerary Images' },
    { id: 'himalayanmarvel/tours/cultural', name: 'Cultural Tours' },
    { id: 'himalayanmarvel/tours/adventure', name: 'Adventure Tours' },
    { id: 'himalayanmarvel/tours/honeymoon', name: 'Honeymoon Tours' },
    { id: 'himalayanmarvel/tours/spiritual', name: 'Spiritual Tours' },
    { id: 'himalayanmarvel/tours/custom', name: 'Custom Tours' },
  ];

  useEffect(() => {
    console.log('[CloudinaryPicker] Fetching images from folder:', selectedFolder);
    fetchImages();

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [selectedFolder]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[CloudinaryPicker] Starting fetch for folder:', selectedFolder);

      const response = await fetch(`/api/cloudinary/images?folder=${selectedFolder}&max_results=100`);
      console.log('[CloudinaryPicker] Response status:', response.status);

      const result = await response.json();
      console.log('[CloudinaryPicker] Response data:', result);

      if (result.success) {
        setImages(result.images || []);
        console.log('[CloudinaryPicker] Loaded', result.images?.length || 0, 'images');
      } else {
        setError(result.error || 'Failed to load images');
        console.error('[CloudinaryPicker] API Error:', result);
      }
    } catch (error) {
      console.error('[CloudinaryPicker] Fetch error:', error);
      setError('Failed to connect to Cloudinary');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(img =>
    img.public_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageSelect = (url: string) => {
    console.log('[CloudinaryPicker] Selected image:', url);
    onSelect(url);
    onClose();
  };

  const handleClose = () => {
    console.log('[CloudinaryPicker] Closing modal');
    onClose();
  };

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return createPortal(
    <div
      data-modal-overlay
      className="fixed inset-0 bg-white/60 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-300"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '999999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        isolation: 'isolate'
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        data-modal-content
        className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl max-w-[92vw] w-full max-h-[88vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in duration-300 border border-white/40"
        style={{
          zIndex: '1000000',
          isolation: 'isolate'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Premium Light */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-3xl border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Media Library
            </h2>
            {viewMode === 'browse' && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100/80 px-2 py-1 rounded-full">
                {filteredImages.length.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'browse' && (
              <button
                type="button"
                onClick={() => setViewMode('upload')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 hover:bg-gray-200/80 rounded-xl transition-colors group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Body - Premium Light Mode */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-white relative" style={{ maxHeight: 'calc(88vh - 73px)' }}>
          {viewMode === 'browse' ? (
            <>
              {/* Floating Toolbar - Glass Morphism */}
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-xl rounded-2xl p-3">
                  <div className="flex items-center gap-3">
                    {/* Folder Select - Minimal */}
                    <div className="relative">
                      <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className="appearance-none pl-9 pr-8 py-2.5 text-sm bg-white/80 hover:bg-white border border-gray-200/60 rounded-xl text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                      >
                        {folders.map(f => (
                          <option key={f.id} value={f.id} className="bg-white">{f.name}</option>
                        ))}
                      </select>
                      <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Search - Minimal */}
                    <div className="flex-1 max-w-md relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search images..."
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/80 hover:bg-white border border-gray-200/60 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>

                    {/* Refresh Button - Icon Only */}
                    <button
                      type="button"
                      onClick={fetchImages}
                      className="p-2.5 hover:bg-gray-100/80 rounded-xl transition-colors"
                      title="Refresh images"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Display - Floating */}
              {error && (
                <div className="absolute top-20 left-4 right-4 z-20">
                  <div className="bg-red-50/80 backdrop-blur-2xl border border-red-200/60 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-700">{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={fetchImages}
                        className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Grid - Premium Masonry */}
              <div className="h-full overflow-y-auto p-4 pt-20">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                    <p className="text-sm text-gray-500">Loading images...</p>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <ImageIcon className="w-16 h-16 text-gray-200 mb-4" />
                    <p className="text-base font-medium text-gray-500 mb-3">
                      {search ? 'No images found' : 'No images in this folder'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode('upload')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3 pb-4">
                    {filteredImages.map((image) => (
                      <button
                        type="button"
                        key={image.public_id}
                        onClick={() => handleImageSelect(image.secure_url)}
                        className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl ${
                          currentUrl === image.secure_url
                            ? 'ring-2 ring-blue-500 scale-105 shadow-xl'
                            : 'hover:scale-105'
                        }`}
                      >
                        <Image
                          src={image.secure_url}
                          alt={image.public_id}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 12vw"
                        />
                        {/* Subtle Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Selected Badge - Premium */}
                        {currentUrl === image.secure_url && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Upload Mode - Premium Light */}
              <div className="h-full overflow-y-auto p-8 pt-6">
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setViewMode('browse')}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    ← Back to Browse
                  </button>
                </div>
                <div className="flex justify-center max-w-2xl mx-auto">
                  <CloudinaryUpload
                    onUploadComplete={(url) => {
                      handleImageSelect(url);
                    }}
                    label="Upload to Cloudinary"
                    folder={selectedFolder}
                    aspect="video"
                    size="lg"
                  />
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
