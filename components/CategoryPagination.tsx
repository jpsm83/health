"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
}

interface CategoryPaginationProps {
  paginationData: PaginationData;
}

export default function CategoryPagination({
  paginationData,
}: CategoryPaginationProps) {
  if (paginationData.totalPages <= 1) {
    return null;
  }

  return (
    <section className="pb-6 md:pb-10">
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            {paginationData.currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${paginationData.currentPage - 1}`}
                />
              </PaginationItem>
            )}

            {/* Page Numbers */}
            {Array.from(
              { length: paginationData.totalPages },
              (_, i) => i + 1
            ).map((page) => {
              // Show first page, last page, current page, and pages around current page
              const shouldShow =
                page === 1 ||
                page === paginationData.totalPages ||
                Math.abs(page - paginationData.currentPage) <= 1;

              if (!shouldShow) {
                // Show ellipsis for gaps
                if (page === 2 && paginationData.currentPage > 4) {
                  return (
                    <PaginationItem key={`ellipsis-start-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                if (
                  page === paginationData.totalPages - 1 &&
                  paginationData.currentPage < paginationData.totalPages - 3
                ) {
                  return (
                    <PaginationItem key={`ellipsis-end-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?page=${page}`}
                    isActive={page === paginationData.currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            {paginationData.currentPage < paginationData.totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`?page=${paginationData.currentPage + 1}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}

