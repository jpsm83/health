import { getTranslations } from "next-intl/server";
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";
import FeaturedArticles from "@/components/FeaturedArticles";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

interface CategoryPaginatedArticlesSectionProps {
  category: string;
  locale: string;
  page: string;
}

const FEATURED_ARTICLES_COUNT = 10;
const ARTICLES_PER_PAGE = 10;

export default async function CategoryPaginatedArticlesSection({
  category,
  locale,
  page,
}: CategoryPaginatedArticlesSectionProps) {
  const t = await getTranslations({ locale, namespace: "articles" });
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    // Get featured articles to exclude from paginated results
    const featuredResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: 1,
      sort: "createdAt",
      order: "desc",
      limit: FEATURED_ARTICLES_COUNT,
      fields: "featured" as FieldProjectionType,
      skipCount: true,
    });

    const featuredIds = (featuredResult.data || [])
      .map((article) => article._id?.toString())
      .filter((id): id is string => Boolean(id));

    // Get paginated articles excluding featured ones
    const paginatedResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
      excludeIds: featuredIds.length > 0 ? featuredIds : undefined,
      fields: "featured" as FieldProjectionType,
      skipCount: true,
    });

    const articles = paginatedResult.data || [];

    if (!articles.length) {
      return null; // Don't show section if no articles
    }

    return (
      <section className="mb-6 md:mb-10">
        <FeaturedArticles
          articles={articles}
          title={t(`${category}.featuredArticles.title`)}
          description={t(`${category}.featuredArticles.description`)}
        />
      </section>
    );
  } catch (error) {
    console.error("Error fetching paginated articles:", error);
    return null;
  }
}

