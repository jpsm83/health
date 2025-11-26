import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import { searchArticlesPaginated } from "@/app/actions/article/searchArticlesPaginated";

interface SearchResultsWithPaginationProps {
  query: string;
  locale: string;
  page: string;
}

const ARTICLES_PER_PAGE = 10;

export default async function SearchResultsWithPagination({
  query,
  locale,
  page,
}: SearchResultsWithPaginationProps) {
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

