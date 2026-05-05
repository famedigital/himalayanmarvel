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
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200"
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
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[85vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in duration-200"
        style={{
          zIndex: '1000000',
          isolation: 'isolate'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {viewMode === 'upload' ? 'Upload Image' : 'Media Library'}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
              {viewMode === 'upload' ? 'Upload a new image to Cloudinary' : 'Choose an image or upload a new one'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all hover:scale-105 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {viewMode === 'browse' ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-col xl:flex-row gap-6 mb-8">
                {/* Folder Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Folders
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {folders.map(f => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => {
                          console.log('[CloudinaryPicker] Switching to folder:', f.id);
                          setSelectedFolder(f.id);
                        }}
                        className={`px-5 py-3 text-sm rounded-xl transition-all font-medium shadow-sm ${
                          selectedFolder === f.id
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search images by name..."
                      className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
                    />
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('[CloudinaryPicker] Refreshing images');
                      fetchImages();
                    }}
                    className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-sm"
                    title="Refresh images"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Upload Button */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => {
                    console.log('[CloudinaryPicker] Switching to upload mode');
                    setViewMode('upload');
                  }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
                >
                  <Upload className="w-5 h-5" />
                  Upload New Image
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-red-800 dark:text-red-200">Error loading images</p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchImages}
                      className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-6" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading images...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">This may take a moment</p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <ImageIcon className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                  <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                    {search ? 'No images found matching your search' : 'No images in this folder'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('upload')}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg"
                  >
                    <Upload className="w-5 h-5" />
                    Upload First Image
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Showing <span className="text-blue-600 dark:text-blue-400">{filteredImages.length}</span> of <span className="text-gray-500">{images.length}</span> images
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Folder: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedFolder}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredImages.map((image) => (
                      <button
                        type="button"
                        key={image.public_id}
                        onClick={() => handleImageSelect(image.secure_url)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:shadow-2xl hover:scale-105 ${
                          currentUrl === image.secure_url
                            ? 'border-blue-600 ring-4 ring-blue-200 dark:ring-blue-800 scale-105 shadow-xl'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 shadow-md'
                        }`}
                      >
                        <Image
                          src={image.secure_url}
                          alt={image.public_id}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                        {/* Selected Badge */}
                        {currentUrl === image.secure_url && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Upload Mode */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    console.log('[CloudinaryPicker] Switching back to browse mode');
                    setViewMode('browse');
                  }}
                  className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-semibold text-lg"
                >
                  ← Back to Browse
                </button>
              </div>
              <div className="flex justify-center">
                <CloudinaryUpload
                  onUploadComplete={(url) => {
                    console.log('[CloudinaryPicker] Upload complete:', url);
                    handleImageSelect(url);
                  }}
                  label="Upload to Cloudinary"
                  folder={selectedFolder}
                  aspect="video"
                  size="lg"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="text-base font-medium text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${filteredImages.length} images in ${selectedFolder}`}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
