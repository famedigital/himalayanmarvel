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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {title}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(editHref)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Itinerary
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(invoiceHref)} className="cursor-pointer">
          <Receipt className="mr-2 h-4 w-4 text-emerald-500" />
          Generate Invoice
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onPreview}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4 text-blue-500" />
          Preview HTML
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDownload}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <Download className="mr-2 h-4 w-4 text-blue-500" />
          )}
          Download HTML
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDuplicate}
          disabled={isDuplicating}
          className="cursor-pointer"
        >
          {isDuplicating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-violet-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4 text-violet-500" />
          )}
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
