'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmProps {
  itemName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirm({ itemName, onConfirm, onCancel, isDeleting = false }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isDeleting}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Delete this item?
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemName}"</span>? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
