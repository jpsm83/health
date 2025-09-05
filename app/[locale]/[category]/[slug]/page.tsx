import { Metadata } from "next";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import { IArticle, IMetaDataArticle } from "@/interfaces/article";
import { articleService } from "@/services/articleService";
import Article from "@/pagesClient/Article";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const articleData = await articleService.getArticleBySlug(slug, locale);

    if (!articleData) {
      return generateArticleNotFoundMetadata();
    }

    const contentByLanguage = articleData.contentsByLanguage[0]; // Already filtered by API

    const metaContent: IMetaDataArticle = {
      createdBy:
        typeof articleData.createdBy === "object" &&
        articleData.createdBy &&
        "username" in articleData.createdBy
          ? (articleData.createdBy as { username: string }).username
          : "Women Spot Team",
      articleImages: articleData.articleImages,
      category: articleData.category,
      createdAt: articleData.createdAt
        ? new Date(articleData.createdAt)
        : new Date(),
      updatedAt: articleData.updatedAt
        ? new Date(articleData.updatedAt)
        : new Date(),
      seo: contentByLanguage?.seo || {
        metaTitle: "Article Not Found",
        metaDescription: "The requested article could not be found",
        keywords: [],
        slug: "",
        hreflang: "",
        urlPattern: "",
        canonicalUrl: "",
      },
    };

    return generateArticleMetadata(metaContent);
  } catch (error) {
    console.error("Error generating article metadata:", error);
    return generateArticleNotFoundMetadata();
  }
}

// This should return JSX, not Metadata
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let articleData: IArticle | undefined = undefined;

  try {
    articleData = await articleService.getArticleBySlug(slug, locale);
  } catch (error) {
    console.error("Error fetching article:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Article component"}>
        <Article articleData={articleData} />
      </ErrorBoundary>
    </main>
  );
}
