import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import HeroSection from "@/components/server/HeroSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import { searchArticlesPaginated } from "@/app/actions/article/searchArticlesPaginated";
import { ArticlesWithPaginationSkeleton } from "@/components/skeletons/ArticlesWithPaginationSkeleton";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import NewsletterSignup from "@/components/NewsletterSignup";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = q as string;

  // Use generatePublicMetadata helper
  const metadata = await generatePublicMetadata(
    locale,
    "/search",
    "metadata.search.title"
  );

  // Enhance with query if present
  if (query) {
    return {
      ...metadata,
      title: `Search results for "${query}" | ${metadata.title}`,
      description: `Find articles related to "${query}"`,
    };
  }

  return metadata;
}

export const revalidate = 3600; // Public page, cache for 1 hour

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { page = "1", q } = await searchParams;
  const query = q as string;

  // Redirect to home if no search query
  if (!query || query.trim() === "") {
    redirect(`/${locale}`);
  }

  const t = await getTranslations({ locale, namespace: "search" });

  // Fetch search count for hero description
  let totalCount = 0;
  try {
    const searchResult = await searchArticlesPaginated({
      query: query.trim(),
      locale,
      page: 1,
      sort: "createdAt",
      order: "desc",
      limit: 10,
    });
    totalCount = searchResult.totalDocs || 0;
  } catch (error) {
    console.error("Error fetching search count:", error);
  }

  // Hero text with actual count
  const heroTitle = t("resultsTitle");
  const heroDescription = t("resultsFound", {
    count: totalCount,
    query: query,
  });
  const heroImageKey = "search-results";

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Search page"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Hero Section */}
          <HeroSection
            locale={locale}
            title={heroTitle}
            description={heroDescription}
            alt={t("heroImageAlt")}
            imageKey={heroImageKey}
          />

          {/* Search Results Section with Pagination */}
          <Suspense fallback={<ArticlesWithPaginationSkeleton />}>
            <SearchResultsContent
              query={query}
              locale={locale}
              page={page as string}
            />
          </Suspense>

          {/* Newsletter Signup Section */}
          <NewsletterSignup />

          {/* Products Banner */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}

// Search Results Content Component
async function SearchResultsContent({
  query,
  locale,
  page,
}: {
  query: string;
  locale: string;
  page: string;
}) {
  const ARTICLES_PER_PAGE = 10;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    const searchResult = await searchArticlesPaginated({
      query: query.trim(),
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
    });

    const searchResults = searchResult.data || [];
    const totalPages = searchResult.totalPages || 1;

    return (
      <>
        {searchResults && searchResults.length > 0 && (
          <FeaturedArticles articles={searchResults} />
        )}
        {totalPages > 1 && (
          <PaginationSection
            type="search"
            locale={locale}
            query={query}
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error searching articles:", error);
    return null;
  }
}
