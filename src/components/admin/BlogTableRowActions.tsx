'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

interface BlogTableRowActionsProps {
  id: string;
  title: string;
  editHref: string;
  viewHref?: string;
  isPublished: boolean;
  isToggling?: boolean;
  onTogglePublish: () => void;
  onDelete: () => void;
}

export function BlogTableRowActions({
  id,
  title,
  editHref,
  viewHref,
  isPublished,
  isToggling = false,
  onTogglePublish,
  onDelete,
}: BlogTableRowActionsProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center cursor-pointer outline-hidden">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {title}
        </div>
        <DropdownMenuSeparator />

        {viewHref && (
          <DropdownMenuItem onClick={() => handleNavigate(viewHref)}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            <span className="text-xs">View</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => handleNavigate(editHref)}>
          <Pencil className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs">Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onTogglePublish} disabled={isToggling}>
          {isToggling ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : isPublished ? (
            <>
              <EyeOff className="mr-2 h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs">Unpublish</span>
            </>
          ) : (
            <>
              <Eye className="mr-2 h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs">Publish</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
