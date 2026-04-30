'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CmsPage } from '@/lib/supabase/cms-types';
import { useState } from 'react';

interface CmsPageSelectorProps {
  pages: CmsPage[];
  selectedPage: CmsPage | null;
  onPageSelect: (page: CmsPage) => void;
  disabled?: boolean;
}

export function CmsPageSelector({
  pages,
  selectedPage,
  onPageSelect,
  disabled = false,
}: CmsPageSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedPage ? (
            <span className="flex items-center gap-2">
              {selectedPage.page_name}
            </span>
          ) : (
            "Select page..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <CommandGroup>
              {pages
                .filter((page) => page.is_editable)
                .sort((a, b) => a.order_index - b.order_index)
                .map((page) => (
                  <CommandItem
                    key={page.id}
                    value={page.page_path}
                    onSelect={() => {
                      onPageSelect(page);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPage?.page_path === page.page_path
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{page.page_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {page.page_path}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
