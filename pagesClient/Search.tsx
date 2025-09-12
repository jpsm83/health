"use client";

import FeaturedArticles from "@/components/FeaturedArticles";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { ISerializedArticle } from "@/interfaces/article";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslations } from "next-intl";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
}

interface SearchProps {
  searchResults: ISerializedArticle[];
  query: string;
  paginationData: PaginationData;
  error?: string;
}

export default function Search({
  searchResults,
  query,
  paginationData,
}: SearchProps) {
  const t = useTranslations("search");

  return (
    <div className="flex flex-col min-h-full gap-12 md:gap-16 mb-12 md:mb-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1757237848/health/bpzafd2yt9i7evmnecoa.png"
            alt={t("heroImageAlt")}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        {searchResults.length > 0 ? (
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t("resultsTitle")}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                {t("resultsFound", { 
                  count: paginationData.totalArticles, 
                  query: query 
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center h-full">
            {/* No results message */}
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t("noResultsTitle")}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                {t("noResultsDescription")}
              </p>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                &quot;{query}&quot;
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Newsletter Signup Section */}
      {searchResults.length > 0 && <NewsletterSignup />}

      {/* Search Results Section */}
      <FeaturedArticles
        articles={searchResults}
        showBanner={false}
      />

      {/* Pagination Section */}
      {paginationData.totalPages > 1 && (
        <section>
          {/* Pagination Controls */}
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                {paginationData.currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?q=${encodeURIComponent(query)}&page=${
                        paginationData.currentPage - 1
                      }`}
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
                        href={`?q=${encodeURIComponent(query)}&page=${page}`}
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
                      href={`?q=${encodeURIComponent(query)}&page=${
                        paginationData.currentPage + 1
                      }`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      )}
    </div>
  );
}
