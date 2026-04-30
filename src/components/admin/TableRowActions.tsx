'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye, Copy } from 'lucide-react';

interface TableRowActionsProps {
  id: string;
  editHref: string;
  viewHref?: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
  copyValue?: string;
  isLoading?: boolean;
}

export function TableRowActions({
  editHref,
  viewHref,
  onDelete,
  onDuplicate,
  copyValue,
  isLoading = false,
}: TableRowActionsProps) {
  const router = useRouter();

  const handleCopy = () => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none">
        <span className="sr-only">Open menu</span>
        {isLoading ? (
          <MoreHorizontal className="h-4 w-4 animate-pulse" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {viewHref && (
          <>
            <DropdownMenuItem onClick={() => router.push(viewHref)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => router.push(editHref)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        {copyValue && (
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
        )}

        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
