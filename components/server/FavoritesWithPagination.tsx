import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import { getUserLikedArticles } from "@/app/actions/user/getUserLikedArticles";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";

interface FavoritesWithPaginationProps {
  locale: string;
  page: string;
}

const ARTICLES_PER_PAGE = 10;

export default async function FavoritesWithPagination({
  locale,
  page,
}: FavoritesWithPaginationProps) {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  // Check auth inside component
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const result = await getUserLikedArticles(
      session.user.id,
      currentPage,
      ARTICLES_PER_PAGE,
      locale
    );

    if (!result.success) {
      return null;
    }

    const articles = result.data || [];
    const totalPages = result.totalPages || 1;

    return (
      <>
        {articles && articles.length > 0 && (
          <FeaturedArticles articles={articles} />
        )}
        {totalPages > 1 && (
          <PaginationSection
            type="favorites"
            locale={locale}
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching favorite articles:", error);
    return null;
  }
}

