"use client";

import FeaturedArticles from "@/components/FeaturedArticles";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { ISerializedArticle } from "@/types/article";
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

interface FavoritesProps {
  favoriteArticles: ISerializedArticle[];
  paginationData: PaginationData;
  error?: string;
}

export default function Favorites({
  favoriteArticles,
  paginationData,
}: FavoritesProps) {
  const t = useTranslations("favorites");

  return (
    <div className="flex flex-col min-h-full gap-12 md:gap-16 mb-12 md:mb-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1757872660/health/xvynlootzxmsmjhrbjxs.png"
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
        {favoriteArticles.length > 0 ? (
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t("title")}
              </h1>
              <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
                {t("subtitle", { 
                  count: paginationData.totalArticles
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center h-full">
            {/* No favorites message */}
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t("noFavoritesTitle")}
              </h1>
              <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
                {t("noFavoritesDescription")}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Favorites Section */}
      <FeaturedArticles
        articles={favoriteArticles}
        showBanner={false}
        />

        {/* Newsletter Signup Section */}
        {favoriteArticles.length > 0 && <NewsletterSignup />}

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
      )}
    </div>
  );
}
