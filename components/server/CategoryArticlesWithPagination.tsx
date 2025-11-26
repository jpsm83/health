import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

interface CategoryArticlesWithPaginationProps {
  category: string;
  locale: string;
  page: string;
}

const ARTICLES_PER_PAGE = 10;

export default async function CategoryArticlesWithPagination({
  category,
  locale,
  page,
}: CategoryArticlesWithPaginationProps) {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    const paginatedResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
      fields: "featured" as FieldProjectionType,
      skipCount: false, // Get totalPages for pagination
    });

    const articles = paginatedResult.data || [];
    const totalPages = paginatedResult.totalPages || 1;

    return (
      <>
        {articles && articles.length > 0 && (
          <FeaturedArticles articles={articles} />
        )}
        {totalPages > 1 && (
          <PaginationSection
            type="category"
            category={category}
            locale={locale}
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return null;
  }
}

