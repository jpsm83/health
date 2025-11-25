import { getTranslations } from "next-intl/server";

import { getArticles } from "@/app/actions/article/getArticles";
import FeaturedArticles from "@/components/FeaturedArticles";

interface FeaturedArticlesSectionProps {
  locale: string;
}

export default async function FeaturedArticlesSection({
  locale,
}: FeaturedArticlesSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  const featuredArticlesResponse = await getArticles({
    locale,
    limit: 10,
    skipCount: true,
    fields: "featured",
  });

  const articles = featuredArticlesResponse.data;

  if (!articles.length) {
    return (
      <section className="cv-auto px-3 py-8 text-center bg-white border rounded shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("featuredArticles.title")}
        </h2>
        <p className="text-gray-500">
          {t("description")}
        </p>
      </section>
    );
  }

  return (
    <FeaturedArticles
      articles={articles}
      title={t("featuredArticles.title")}
      description={t("featuredArticles.description")}
    />
  );
}

