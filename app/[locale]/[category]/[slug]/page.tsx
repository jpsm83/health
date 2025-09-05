import { Metadata } from "next";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import { languageMap } from "@/lib/utils/genericMetadata";
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
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const canonicalUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;

    const metaContent: IMetaDataArticle = {
      createdBy:
        typeof articleData.createdBy === "object" &&
        articleData.createdBy &&
        "username" in articleData.createdBy
          ? (articleData.createdBy as { username: string }).username
          : "Women Spot Team",
      articleImages: articleData.articleImages || [],
      category: articleData.category,
      createdAt: articleData.createdAt
        ? new Date(articleData.createdAt)
        : new Date(),
      updatedAt: articleData.updatedAt
        ? new Date(articleData.updatedAt)
        : new Date(),
      seo: contentByLanguage?.seo ? {
        ...contentByLanguage.seo,
        canonicalUrl: contentByLanguage.seo.canonicalUrl || canonicalUrl,
        hreflang: contentByLanguage.seo.hreflang || languageMap[locale] || locale,
        slug: contentByLanguage.seo.slug || slug,
      } : {
        metaTitle: `Article: ${slug}`,
        metaDescription: `Read about ${slug} on Women Spot`,
        keywords: [articleData.category, "health", "women"],
        slug: slug,
        hreflang: languageMap[locale] || locale,
        urlPattern: `/${locale}/${articleData.category}/[slug]`,
        canonicalUrl: canonicalUrl,
      },
    };

    return generateArticleMetadata(metaContent);
  } catch (error) {
    console.error("Error generating article metadata:", error);
    
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const fallbackCanonicalUrl = `${baseUrl}/${locale}/${slug}`;
    
    const fallbackMetaContent: IMetaDataArticle = {
      createdBy: "Women Spot Team",
      articleImages: [],
      category: "health",
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: {
        metaTitle: `Article: ${slug}`,
        metaDescription: `Read about ${slug} on Women Spot - Your health and wellness resource`,
        keywords: ["health", "women", "wellness", slug],
        slug: slug,
        hreflang: languageMap[locale] || locale,
        urlPattern: `/${locale}/[category]/[slug]`,
        canonicalUrl: fallbackCanonicalUrl,
      },
    };
    
    return generateArticleMetadata(fallbackMetaContent);
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
