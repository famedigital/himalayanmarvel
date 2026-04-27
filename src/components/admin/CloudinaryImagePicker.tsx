'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Search, FolderOpen, RefreshCw } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(folder);
  const [viewMode, setViewMode] = useState<'browse' | 'upload'>('browse');

  const folders = [
    { id: 'himalayanmarvel', name: 'All Images' },
    { id: 'himalayanmarvel/itineraries', name: 'Itineraries' },
    { id: 'himalayanmarvel/qr-codes', name: 'QR Codes' },
    { id: 'himalayanmarvel/tours', name: 'Tours' },
    { id: 'himalayanmarvel/blog', name: 'Blog' },
    { id: 'himalayanmarvel/hero', name: 'Hero Slides' },
  ];

  useEffect(() => {
    fetchImages();
  }, [selectedFolder]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cloudinary/images?folder=${selectedFolder}&max_results=100`);
      const result = await response.json();

      if (result.success) {
        setImages(result.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(img =>
    img.public_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {viewMode === 'upload' ? 'Upload Image' : 'Select from Cloudinary'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {viewMode === 'upload' ? 'Upload a new image to Cloudinary' : 'Choose an image or upload a new one'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {viewMode === 'browse' ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Folder Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Folder
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {folders.map(f => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setSelectedFolder(f.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          selectedFolder === f.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FolderOpen className="w-3 h-3 inline mr-1" />
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={fetchImages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Refresh images"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Upload Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setViewMode('upload')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Image
                </button>
              </div>

              {/* Images Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {search ? 'No images found matching your search' : 'No images in this folder'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('upload')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    Upload an Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredImages.map((image) => (
                    <button
                      type="button"
                      key={image.public_id}
                      onClick={() => {
                        onSelect(image.secure_url);
                        onClose();
                      }}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentUrl === image.secure_url
                          ? 'border-blue-600 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <Image
                        src={image.secure_url}
                        alt={image.public_id}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {/* Selected Badge */}
                      {currentUrl === image.secure_url && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Upload Mode */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setViewMode('browse')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  ← Back to Browse
                </button>
              </div>
              <CloudinaryUpload
                onUploadComplete={(url) => {
                  onSelect(url);
                  onClose();
                }}
                label="Upload to Cloudinary"
                folder={selectedFolder}
                aspect="video"
                size="md"
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredImages.length} images in {selectedFolder}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
