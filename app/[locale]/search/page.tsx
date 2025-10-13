import { redirect } from "next/navigation";
import Search from "@/pagesClient/Search";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { searchArticlesPaginated } from "@/app/actions/article/searchArticlesPaginated";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = q as string;

  return {
    title: query ? `Search results for "${query}"` : "Search Articles",
    description: query ? `Find articles related to "${query}"` : "Search through our collection of health and wellness articles",
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
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
  const ARTICLES_PER_PAGE = 6; // Number of articles per page

  let searchResults: ISerializedArticle[] = []; // Search results
  let paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
  };

  try {
    // Get search results with pagination
    const searchResult = 
      await searchArticlesPaginated({
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
      <ErrorBoundary context={`Search component for query "${query}"`}>
        <Search
          searchResults={searchResults}
          query={query}
          paginationData={paginationData}
        />
      </ErrorBoundary>
    </main>
  );
}
