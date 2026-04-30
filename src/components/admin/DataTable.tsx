'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  MoreVertical,
  Eye,
  ChevronDown as ChevronDownIcon,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsInteger } from 'nuqs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface DataTableFilter {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'select' | 'multiselect' | 'date';
}

export interface DataTableColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
  filterable?: boolean;
}

// ============================================================================
// Props
// ============================================================================

export interface DataTableProps<TData, TValue> {
  // Data fetching
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData[]>;
  initialData?: TData[];

  // Columns
  columns: ColumnDef<TData, TValue>[];

  // Table features
  filters?: DataTableFilter[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchField?: string;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];

  // Column visibility
  enableColumnVisibility?: boolean;

  // Empty state
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  };

  // Styling
  className?: string;
  tableClassName?: string;

  // Row actions (rendered in a dropdown menu)
  renderRowActions?: (row: TData) => React.ReactNode;

  // Mobile card view
  renderMobileCard?: (row: TData) => React.ReactNode;

  // onRowClick
  onRowClick?: (row: TData) => void;
}

// ============================================================================
// Components
// ============================================================================

function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground flex-1">
        Showing {startRow}-{endRow} of {totalRows} results
      </div>

      <div className="flex items-center gap-2">
        {/* Page Size */}
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">First page</span>
            <ChevronDown className="h-4 w-4 -rotate-90" />
            <ChevronDown className="h-4 w-4 -rotate-90 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Previous page</span>
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </Button>

          <div className="flex items-center justify-center text-sm font-medium min-w-[80px]">
            Page {pageIndex + 1} of {pageCount}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
          >
            <span className="sr-only">Next page</span>
            <ChevronDown className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1}
          >
            <span className="sr-only">Last page</span>
            <ChevronDown className="h-4 w-4 rotate-90" />
            <ChevronDown className="h-4 w-4 rotate-90 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Status Badge Component
// ============================================================================

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}

const statusVariants: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  success: 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20',
  destructive: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20',
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const getVariant = (): NonNullable<StatusBadgeProps['variant']> => {
    if (variant !== 'default') return variant;

    const s = status.toLowerCase();
    if (['published', 'paid', 'final', 'confirmed', 'active', 'completed'].includes(s)) return 'success';
    if (['draft', 'pending', 'inprogress'].includes(s)) return 'warning';
    if (['cancelled', 'rejected', 'failed', 'error'].includes(s)) return 'destructive';
    return 'default';
  };

  const resolvedVariant = getVariant();

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-normal capitalize',
        statusVariants[resolvedVariant]
      )}
    >
      {status}
    </Badge>
  );
}

// ============================================================================
// Main DataTable Component
// ============================================================================

export function DataTable<TData, TValue>({
  queryKey,
  queryFn,
  initialData,
  columns,
  filters = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  searchField = 'search',
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  enableColumnVisibility = true,
  emptyState,
  className,
  tableClassName,
  renderRowActions,
  renderMobileCard,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const queryClient = useQueryClient();

  // URL state for persistence
  const [urlState, setUrlState] = useQueryStates({
    sort: parseAsString.withDefault(''),
    filter: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(pageSize),
    search: parseAsString.withDefault(''),
  });

  // Parse URL state
  const [sorting, setSorting] = useState<SortingState>(() => {
    try {
      return urlState.sort ? JSON.parse(urlState.sort) : [];
    } catch {
      return [];
    }
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    try {
      return urlState.filter ? JSON.parse(urlState.filter) : [];
    } catch {
      return [];
    }
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: urlState.page - 1,
    pageSize: urlState.perPage,
  });
  const [searchValue, setSearchValue] = useState(urlState.search);

  // Fetch data with React Query
  const { data: tableData = [], isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, sorting, columnFilters, searchValue],
    queryFn,
    initialData,
  });

  // Create table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: string | null) => {
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === filterId);
      if (value === null || value === '') {
        return prev.filter((f) => f.id !== filterId);
      }
      if (existing) {
        return prev.map((f) => (f.id === filterId ? { ...f, value } : f));
      }
      return [...prev, { id: filterId, value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Pagination info
  const pageCount = table.getPageCount();
  const totalRows = tableData.length;

  // Empty state
  if (!isLoading && tableData.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          {emptyState?.icon || (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{emptyState?.title || 'No results found'}</h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            {emptyState?.description || 'Try adjusting your filters or search query.'}
          </p>
          {emptyState?.action && (() => {
            const action = emptyState.action;
            return (
              <Button onClick={() => (window.location.href = action.href)}>
                {action.label}
              </Button>
            );
          })()}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        {searchable && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-10"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => handleSearchChange('')}
              >
                <span className="sr-only">Clear search</span>
                <span className="text-muted-foreground">✕</span>
              </Button>
            )}
          </div>
        )}

        {/* Filters */}
        {filters.map((filter) => (
          <Select
            key={filter.id}
            value={(columnFilters.find((f) => f.id === filter.id)?.value as string) || ''}
            onValueChange={(value) => handleFilterChange(filter.id, value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <Badge variant="secondary" className="ml-auto">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Column Visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
              <span className="sr-only">Toggle columns</span>
              <Eye className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table - Desktop View */}
      <Card className="hidden md:block">
        <div className="rounded-md border-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                'cursor-pointer select-none hover:text-foreground transition-colors flex items-center gap-2'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="flex items-center">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      {table.getVisibleLeafColumns().map((col) => (
                        <TableCell key={col.id}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'hover:bg-muted/50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            pageCount={pageCount}
            totalRows={totalRows}
            pageSizeOptions={pageSizeOptions}
            onPageChange={(page) => table.setPageIndex(page)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </Card>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : renderMobileCard ? (
          table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              className={cn(
                'overflow-hidden',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              <CardContent className="p-4">
                {renderMobileCard(row.original)}
              </CardContent>
            </Card>
          ))
        ) : (
          // Default mobile card view
          table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              className={cn(
                'overflow-hidden',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              <CardContent className="p-0">
                {row.getVisibleCells().map((cell) => {
                  const header = cell.column.columnDef.header as string;
                  return (
                    <div
                      key={cell.id}
                      className="flex justify-between px-4 py-3 border-b last:border-b-0"
                    >
                      <span className="text-sm text-muted-foreground font-medium">
                        {header}
                      </span>
                      <span className="text-sm font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Helper: Create a delete action handler
// ============================================================================

export function createDeleteHandler<T extends { id: string }>({
  tableName,
  onSuccess,
  onError,
}: {
  tableName: 'tours' | 'bookings' | 'blogs' | 'itineraries';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return async (id: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  };
}
