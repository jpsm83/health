import { getTranslations } from "next-intl/server";

interface CreateArticleHeaderSectionProps {
  locale: string;
}

export default async function CreateArticleHeaderSection({
  locale,
}: CreateArticleHeaderSectionProps) {
  const t = await getTranslations({ locale, namespace: "createArticle" });

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-xl text-gray-600">{t("subtitle")}</p>
    </div>
  );
}

