import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Search from "@/components/Search";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { searchArticlesPaginated } from "@/app/actions/article/searchArticlesPaginated";
import ProductsBanner from "@/components/ProductsBanner";
import { SearchSkeleton } from "@/components/skeletons/SearchSkeleton";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";

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

  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);

  // Configuration - easily adjustable
  // Change these values to customize the number of articles displayed
  const ARTICLES_PER_PAGE = 10; // Number of articles per page

  let searchResults: ISerializedArticle[] = []; // Search results
  let paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
  };

  try {
    // Get search results with pagination
    const searchResult = await searchArticlesPaginated({
      query: query.trim(),
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
      // No excludeIds needed for search pagination
    });

    searchResults = searchResult.data || [];
    const totalArticles = searchResult.totalDocs;
    const totalPages = searchResult.totalPages;

    // Redirect to page 1 if current page is greater than total pages
    if (currentPage > totalPages && totalPages > 0) {
      redirect(`/${locale}/search?q=${encodeURIComponent(query)}&page=1`);
    }

    paginationData = {
      currentPage,
      totalPages,
      totalArticles,
    };
  } catch (error) {
    console.error("Error searching articles:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Search page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        <Suspense fallback={<SearchSkeleton />}>
          <Search
            locale={locale}
            searchResults={searchResults}
            query={query}
            paginationData={paginationData}
          />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
