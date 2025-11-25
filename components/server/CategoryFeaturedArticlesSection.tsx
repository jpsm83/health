import { getTranslations } from "next-intl/server";
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";
import FeaturedArticles from "@/components/FeaturedArticles";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

interface CategoryFeaturedArticlesSectionProps {
  category: string;
  locale: string;
}

const FEATURED_ARTICLES_COUNT = 10;

export default async function CategoryFeaturedArticlesSection({
  category,
  locale,
}: CategoryFeaturedArticlesSectionProps) {
  const t = await getTranslations({ locale, namespace: "articles" });

  try {
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

    const articles = featuredResult.data || [];

    if (!articles.length) {
      return (
        <section className="cv-auto px-3 py-8 text-center bg-white border rounded shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {t(`${category}.featuredArticles.title`)}
          </h2>
          <p className="text-gray-500">
            {t("noArticlesAvailable")}
          </p>
        </section>
      );
    }

    return (
      <FeaturedArticles
        articles={articles}
        title={t(`${category}.featuredArticles.title`)}
        description={t(`${category}.featuredArticles.description`)}
      />
    );
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return (
      <section className="cv-auto px-3 py-8 text-center bg-white border rounded shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t(`${category}.featuredArticles.title`)}
        </h2>
        <p className="text-gray-500">
          {t("noArticlesAvailable")}
        </p>
      </section>
    );
  }
}

