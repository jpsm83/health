"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Eye, Heart, MessageCircle, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  getArticleTitle?: (article: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  getArticleTitle,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Filter and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Input
            placeholder="Filter by title..."
            value={
              (table.getColumn("mainTitle")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("mainTitle")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white shadow-md border-gray-300"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden border border-gray-300 shadow-sm w-full">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-xs font-semibold text-gray-800 uppercase tracking-wide text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`cursor-pointer transition-colors ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50/50 hover:bg-gray-100"
                  } border-b border-gray-200`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-white border border-gray-200 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onRowClick?.(row.original)}
            >
              <div className="space-y-2">
                {/* Title - Most important on mobile */}
                <div className="font-medium text-gray-900 text-lg leading-tight">
                  {getArticleTitle ? getArticleTitle(row.original) : "No title"}
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <span className="font-medium text-gray-700">
                        <Eye size={12} />
                      </span>
                      <span className="ml-1">{row.getValue("views") || 0}</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium text-gray-700">
                        <Heart size={12} />
                      </span>
                      <span className="ml-1">
                        {(row.getValue("likes") as string[])?.length || 0}
                      </span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-medium text-gray-700">
                        <MessageCircle size={12} />
                      </span>
                      <span className="ml-1">
                        {row.getValue("commentsCount") || 0}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Category and Date */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="capitalize bg-gray-100 px-2 py-1">
                    {row.getValue("category")}
                  </span>
                  <span>
                    {new Date(row.getValue("createdAt")).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No results.</div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex flex-col space-y-4 py-4">
        {/* Pagination and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Row Selection Info */}
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          {/* Page Info and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex justify-center sm:justify-start space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50 text-gray-700 min-w-[80px]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50 text-gray-700 min-w-[80px]"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Rows per page */}
          <div className="flex justify-center sm:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
                >
                  Rows per page: {table.getState().pagination.pageSize}{" "}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white shadow-md border-gray-300"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <DropdownMenuItem
                    key={pageSize}
                    onClick={() => table.setPageSize(pageSize)}
                    className={
                      table.getState().pagination.pageSize === pageSize
                        ? "bg-gray-100"
                        : ""
                    }
                  >
                    {pageSize}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
