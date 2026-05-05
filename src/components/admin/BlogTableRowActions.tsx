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
      <DropdownMenuTrigger
        className="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none relative z-10"
        aria-label="Open menu"
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal truncate max-w-[160px]">{title}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {viewHref && (
          <DropdownMenuItem onClick={() => handleNavigate(viewHref)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => handleNavigate(editHref)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onTogglePublish} disabled={isToggling}>
          {isPublished ? (
            <>
              <EyeOff className="mr-2 h-4 w-4 text-amber-500" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4 text-emerald-500" />
              Publish
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
