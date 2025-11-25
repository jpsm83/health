import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/app/actions/article/getArticleBySlug";
import { ISerializedArticle } from "@/types/article";
import Article from "@/pagesClient/Article";

interface ArticleDetailSectionProps {
  slug: string;
  locale: string;
}

export default async function ArticleDetailSection({
  slug,
  locale,
}: ArticleDetailSectionProps) {
  let articleData: ISerializedArticle | undefined = undefined;

  try {
    const result = await getArticleBySlug(slug, locale);
    articleData = result ?? undefined;
  } catch (error) {
    console.error("Error fetching article:", error);
  }

  // If article doesn't exist, trigger not-found page
  if (!articleData) {
    notFound();
  }

  return <Article articleData={articleData} />;
}

