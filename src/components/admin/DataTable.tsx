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
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  EyeOff,
  ChevronDown as ChevronDownIcon,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsInteger, parseAsJson } from 'nuqs';

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
// URL State Serializers
// ============================================================================

const sortingSerializer = {
  parse: (value: string | null): SortingState => {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  },
  stringify: (value: SortingState): string => {
    return JSON.stringify(value);
  },
};

const filtersSerializer = {
  parse: (value: string | null): ColumnFiltersState => {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  },
  stringify: (value: ColumnFiltersState): string => {
    return JSON.stringify(value);
  },
};

const visibilitySerializer = {
  parse: (value: string | null): VisibilityState => {
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  },
  stringify: (value: VisibilityState): string => {
    return JSON.stringify(value);
  },
};

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
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-900/50">
        Showing {startRow} to {endRow} of {totalRows} results
      </div>

      <div className="flex items-center gap-4">
        {/* Page Size */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First page"
          >
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-3" />
          </button>
          <button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-sm text-gray-900">
            Page {pageIndex + 1} of {pageCount}
          </span>

          <button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last page"
          >
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ColumnVisibilityDropdown<TData, TValue>({
  columns,
  visibility,
  onVisibilityChange,
}: {
  columns: ColumnDef<TData, TValue>[];
  visibility: VisibilityState;
  onVisibilityChange: (columnId: string, visible: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Get all column IDs that can be toggled
  const toggleableColumns = useMemo(() => {
    return columns.filter((col) => {
      const meta = col.meta as DataTableColumnMeta | undefined;
      return col.id && meta?.sortable !== false;
    });
  }, [columns]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Eye className="w-4 h-4" />
        Columns
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
            {toggleableColumns.map((col) => {
              const colId = col.id as string;
              const isVisible = visibility[colId] !== false;
              const header = typeof col.header === 'string' ? col.header : colId;

              return (
                <label
                  key={colId}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => onVisibilityChange(colId, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/50"
                  />
                  <span className="text-sm text-gray-900 capitalize">{header}</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
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
    visibility: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(pageSize),
    search: parseAsString.withDefault(''),
  });

  // Parse URL state
  const [sorting, setSorting] = useState<SortingState>(
    sortingSerializer.parse(urlState.sort)
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filtersSerializer.parse(urlState.filter)
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    visibilitySerializer.parse(urlState.visibility)
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: urlState.page - 1,
    pageSize: urlState.perPage,
  });
  const [searchValue, setSearchValue] = useState(urlState.search);

  // Update URL when state changes
  const updateUrlState = (updates: Partial<typeof urlState>) => {
    setUrlState({
      ...urlState,
      ...updates,
      sort: sortingSerializer.stringify(sorting),
      filter: filtersSerializer.stringify(columnFilters),
      visibility: visibilitySerializer.stringify(columnVisibility),
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
      search: searchValue,
    });
  };

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
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      updateUrlState({});
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      updateUrlState({});
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
      updateUrlState({});
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      updateUrlState({});
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Reset to first page on search
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    updateUrlState({ search: value });
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: string) => {
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === filterId);
      if (value === '') {
        return prev.filter((f) => f.id !== filterId);
      }
      if (existing) {
        return prev.map((f) => (f.id === filterId ? { ...f, value } : f));
      }
      return [...prev, { id: filterId, value }];
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle column visibility toggle
  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    table.setColumnVisibility((prev) => ({ ...prev, [columnId]: visible }));
  };

  // Get visible columns (excluding actions column)
  const visibleColumns = useMemo(() => {
    return table.getVisibleLeafColumns().filter((col) => col.id !== 'actions');
  }, [table]);

  // Pagination info
  const pageCount = table.getPageCount();
  const totalRows = tableData.length;

  // Empty state
  if (!isLoading && tableData.length === 0) {
    return (
      <div className={cn('text-center py-16', className)}>
        {emptyState?.icon || <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4" />}
        <h3 className="text-gray-900 font-semibold text-lg mb-2">{emptyState?.title || 'No results found'}</h3>
        <p className="text-gray-900/50 mb-6">{emptyState?.description || 'Try adjusting your filters or search query.'}</p>
        {emptyState?.action && (
          <a
            href={emptyState.action.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            {emptyState.action.label}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        {searchable && (
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-900/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
            />
            {searchValue && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900/30" />
            <select
              value={(columnFilters.find((f) => f.id === filter.id)?.value as string) || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        ))}

        {/* Column Visibility */}
        {enableColumnVisibility && (
          <ColumnVisibilityDropdown
            columns={columns}
            visibility={columnVisibility}
            onVisibilityChange={handleColumnVisibilityChange}
          />
        )}
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
                {visibleColumns.map((col) => (
                  <div key={col.id} className="h-4 bg-gray-100 rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={cn('w-full', tableClassName)}>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-gray-200">
                      {headerGroup.headers.map((header) => {
                        const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined;
                        return (
                          <th
                            key={header.id}
                            className={cn(
                              'text-left py-4 px-6 text-gray-900/50 text-sm font-medium',
                              meta?.headerClassName,
                              header.column.getCanSort() && 'cursor-pointer hover:bg-gray-50 select-none'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center gap-2">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() && (
                                  <span className="flex items-center">
                                    {header.column.getIsSorted() === 'asc' ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : header.column.getIsSorted() === 'desc' ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronsUpDown className="w-4 h-4 opacity-30" />
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className={cn(
                          'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                          onRowClick && 'cursor-pointer'
                        )}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined;
                          return (
                            <td
                              key={cell.id}
                              className={cn('py-4 px-6', meta?.cellClassName)}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={visibleColumns.length}
                        className="py-16 text-center text-gray-900/50"
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
          </>
        )}
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : renderMobileCard ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                'bg-white border border-gray-200 rounded-xl p-4',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              {renderMobileCard(row.original)}
            </div>
          ))
        ) : (
          // Default mobile card view
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="flex justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-900/50 font-medium">
                    {flexRender(cell.column.columnDef.header, cell.getContext())}
                  </span>
                  <span className="text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </div>
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

// ============================================================================
// Helper: Status badge component
// ============================================================================

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const statusVariants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const getVariant = (): StatusBadgeProps['variant'] => {
    if (variant !== 'default') return variant;

    const s = status.toLowerCase();
    if (['published', 'paid', 'final', 'confirmed'].includes(s)) return 'success';
    if (['draft', 'pending'].includes(s)) return 'warning';
    if (['cancelled', 'rejected'].includes(s)) return 'error';
    return 'default';
  };

  const resolvedVariant = getVariant();

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        statusVariants[resolvedVariant]
      )}
    >
      {status}
    </span>
  );
}
