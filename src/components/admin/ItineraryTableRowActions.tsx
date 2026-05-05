'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Download,
  Copy,
  Receipt,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItineraryTableRowActionsProps {
  id: string;
  title: string;
  viewHref: string;
  editHref: string;
  invoiceHref: string;
  onPreview: () => void;
  onDownload: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isDuplicating?: boolean;
  isGenerating?: boolean;
}

export function ItineraryTableRowActions({
  id,
  title,
  viewHref,
  editHref,
  invoiceHref,
  onPreview,
  onDownload,
  onDuplicate,
  onDelete,
  isDuplicating = false,
  isGenerating = false,
}: ItineraryTableRowActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" strokeWidth={2.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-lg shadow-xl border-gray-200">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-semibold text-gray-900 bg-gray-50 rounded-t-lg">
            {title}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(viewHref)} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Eye className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Details</p>
              <p className="text-xs text-gray-500">Itinerary & Operations</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(editHref)} className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Edit Itinerary</p>
              <p className="text-xs text-gray-500">Modify details & days</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(invoiceHref)} className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50 py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate Invoice</p>
              <p className="text-xs text-gray-500">Create booking invoice</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onPreview}
          disabled={isGenerating}
          className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50 py-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              ) : (
                <Eye className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Preview HTML</p>
              <p className="text-xs text-gray-500">View in browser</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDownload}
          disabled={isGenerating}
          className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50 py-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              ) : (
                <Download className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Download HTML</p>
              <p className="text-xs text-gray-500">Save to device</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDuplicate}
          disabled={isDuplicating}
          className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 py-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              ) : (
                <Copy className="h-4 w-4 text-indigo-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Duplicate</p>
              <p className="text-xs text-gray-500">Copy itinerary</p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive cursor-pointer hover:bg-red-50 focus:bg-red-50 py-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-600">Delete Itinerary</p>
              <p className="text-xs text-red-500">Permanently remove</p>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
