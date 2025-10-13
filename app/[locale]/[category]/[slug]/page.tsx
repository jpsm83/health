import { notFound } from "next/navigation";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import { languageMap } from "@/lib/utils/genericMetadata";
import { ISerializedArticle, IMetaDataArticle } from "@/types/article";
import Article from "@/pagesClient/Article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticleBySlug } from "@/app/actions/article/getArticleBySlug";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string } | Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  try {
    const articleData = await getArticleBySlug(slug, locale);

    if (!articleData) {
      return generateArticleNotFoundMetadata();
    }

    const languageData = articleData.languages[0]; // Already filtered by API
    const baseUrl = process.env.NEXTAUTH_URL;
    const canonicalUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;

    const metaContent: IMetaDataArticle = {
      createdBy:
        typeof articleData.createdBy === "object" &&
        articleData.createdBy &&
        "username" in articleData.createdBy
          ? (articleData.createdBy as { username: string }).username
          : "Women's Spot Team",
      articleImages: articleData.articleImages || [],
      articleVideo: articleData.articleVideo,
      category: articleData.category,
      createdAt: articleData.createdAt
        ? new Date(articleData.createdAt)
        : new Date(),
      updatedAt: articleData.updatedAt
        ? new Date(articleData.updatedAt)
        : new Date(),
      seo: languageData?.seo ? {
        ...languageData.seo,
        canonicalUrl: languageData.seo.canonicalUrl || canonicalUrl,
        hreflang: languageData.seo.hreflang || languageMap[locale] || locale,
        slug: languageData.seo.slug || slug,
      } : {
        metaTitle: `Article: ${slug}`,
        metaDescription: `Read about ${slug} on Women's Spot`,
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
    
    const baseUrl = process.env.NEXTAUTH_URL;
    const fallbackCanonicalUrl = `${baseUrl}/${locale}/${slug}`;
    
    const fallbackMetaContent: IMetaDataArticle = {
      createdBy: "Women's Spot Team",
      articleImages: [],
      articleVideo: undefined,
      category: "health",
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: {
        metaTitle: `Article: ${slug}`,
        metaDescription: `Read about ${slug} on Women's Spot - Your health and wellness resource`,
        keywords: ["health", "women", "wellness", "Women's Spot", slug],
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
  params: { slug: string; locale: string } | Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  
  let articleData: ISerializedArticle | undefined = undefined;

  try {
    const result = await getArticleBySlug(slug, locale);
    articleData = result ?? undefined;
  } catch (error) {
    console.error("Error fetching article:", error);
    
    // Log mobile-specific debugging info
    console.error("Mobile article error context:", {
      slug,
      locale,
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'Server-side',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // If article doesn't exist, trigger not-found page
  if (!articleData) {
    notFound();
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Article component"}>
        <Article articleData={articleData} />
      </ErrorBoundary>
    </main>
  );
}
