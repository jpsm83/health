"use client";

import { useTranslations } from "next-intl";
import FeaturedArticles from "@/components/FeaturedArticles";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { ISerializedArticle } from "@/types/article";
import { categoryHeroImages } from "@/lib/constants";
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

interface ArticlesProps {
  featuredArticles: ISerializedArticle[];
  paginatedArticles: ISerializedArticle[];
  category: string;
  paginationData: PaginationData;
  error?: string;
}

export default function Articles({
  featuredArticles,
  paginatedArticles,
  category,
  paginationData,
}: ArticlesProps) {
  const t = useTranslations("articles");


  // Handle empty articles case
  if (featuredArticles.length === 0 && paginatedArticles.length === 0) {
    return (
      <div className="flex flex-col min-h-screen gap-8 md:gap-16">
        {/* Hero Section with Full-Width Image */}
        <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
          <div className="absolute inset-0">
            <Image
              src={categoryHeroImages[category as keyof typeof categoryHeroImages] || categoryHeroImages.health}
              alt={t(`${category}.heroImageAlt`)}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6 bg-black/50 shadow-2xl py-4 md:py-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'}}>
                {t(`${category}.title`)}
              </h1>
              <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto drop-shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.4)'}}>
                {t(`${category}.description`)}
              </p>
            </div>
          </div>
        </section>

        {/* No articles message */}
        <section className="text-center py-16 mb-24">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            {t("noArticlesFound")}
          </h2>
          <p className="text-gray-500">{t("noArticlesAvailable")}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen gap-8 md:gap-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src={categoryHeroImages[category as keyof typeof categoryHeroImages] || categoryHeroImages.health}
            alt={t(`${category}.heroImageAlt`)}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6 bg-black/50 shadow-2xl py-4 md:py-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'}}>
              {t(`${category}.title`)}
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto drop-shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.4)'}}>
              {t(`${category}.description`)}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles First Section - Always shows first 2 articles */}
      <FeaturedArticles
        articles={featuredArticles}
        title={t(`${category}.featuredArticles.title`)}
        description={t(`${category}.featuredArticles.description`)}
      />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Featured Articles Second Section - Shows paginated articles */}
      <section className="mb-6 md:mb-10">
        <FeaturedArticles
          articles={paginatedArticles}
          title={t(`${category}.featuredArticles.title`)}
          description={t(`${category}.featuredArticles.description`)}
        />
      </section>

      {/* Pagination Section */}
      {paginationData.totalPages > 1 && (
        <section className="pb-6 md:pb-10">
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
