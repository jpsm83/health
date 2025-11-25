import { redirect } from "next/navigation";
import { getArticlesCount } from "@/app/actions/article/getArticlesCount";
import CategoryPagination from "@/components/CategoryPagination";

interface CategoryPaginationSectionProps {
  category: string;
  locale: string;
  page: string;
}

const FEATURED_ARTICLES_COUNT = 10;
const ARTICLES_PER_PAGE = 10;

export default async function CategoryPaginationSection({
  category,
  locale,
  page,
}: CategoryPaginationSectionProps) {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    const totalArticles = await getArticlesCount({ category, locale });
    const remainingArticles = totalArticles - FEATURED_ARTICLES_COUNT;
    const totalPages = Math.ceil(remainingArticles / ARTICLES_PER_PAGE);

    // Redirect to page 1 if current page is greater than total pages
    if (currentPage > totalPages && totalPages > 0) {
      redirect(`/${locale}/${category}?page=1`);
    }

    const paginationData = {
      currentPage,
      totalPages,
      totalArticles: remainingArticles,
    };

    return <CategoryPagination paginationData={paginationData} />;
  } catch (error) {
    console.error("Error calculating pagination data:", error);
    return null;
  }
}

