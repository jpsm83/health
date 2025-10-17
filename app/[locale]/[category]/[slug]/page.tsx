import { notFound } from "next/navigation";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
  generateSimpleFallbackMetadata,
} from "@/lib/utils/articleMetadata";
import { languageMap } from "@/lib/utils/genericMetadata";
import { ISerializedArticle, IMetaDataArticle } from "@/types/article";
import Article from "@/pagesClient/Article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticleBySlug } from "@/app/actions/article/getArticleBySlug";
import { Metadata, Viewport } from "next";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const articleData = await getArticleBySlug(slug, locale);

    if (!articleData) {
      return generateArticleNotFoundMetadata();
    }

    const languageData = articleData.languages[0]; // Already filtered by API
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';
    const canonicalUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;

    const metaContent: IMetaDataArticle = {
      createdBy:
        typeof articleData.createdBy === "object" &&
        articleData.createdBy &&
        "username" in articleData.createdBy
          ? (articleData.createdBy as { username: string }).username
          : "Women's Spot Team",
      articleImages: articleData.articleImages || [],
      category: articleData.category,
      createdAt: articleData.createdAt
        ? new Date(articleData.createdAt)
        : new Date(),
      updatedAt: articleData.updatedAt
        ? new Date(articleData.updatedAt)
        : new Date(),
      socialMedia: languageData?.socialMedia,
      seo: languageData?.seo ? {
        ...languageData.seo,
        canonicalUrl: languageData.seo.canonicalUrl || canonicalUrl,
        hreflang: languageData.seo.hreflang || languageMap[locale] || locale,
        slug: languageData.seo.slug || slug,
      } : {
        metaTitle: `${articleData.category.charAt(0).toUpperCase() + articleData.category.slice(1)} Article - Women's Spot`,
        metaDescription: `Discover valuable insights about ${articleData.category} on Women's Spot. Expert health and wellness advice for women.`,
        keywords: [articleData.category, "health", "women", "wellness", "fitness", "nutrition"],
        slug: slug,
        hreflang: languageMap[locale] || locale,
        urlPattern: `/${locale}/${articleData.category}/[slug]`,
        canonicalUrl: canonicalUrl,
      },
    };

    const metadata = await generateArticleMetadata(metaContent);
    return metadata;
  } catch (error) {
    console.error("Error generating article metadata:", error);
    console.error("Error details:", {
      slug,
      locale,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';
    const fallbackCanonicalUrl = `${baseUrl}/${locale}/${slug}`;
    
    const fallbackMetaContent: IMetaDataArticle = {
      createdBy: "Women's Spot Team",
      articleImages: [],
      category: "health",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialMedia: undefined,
      seo: {
        metaTitle: `Health Article - Women's Spot`,
        metaDescription: `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`,
        keywords: ["health", "women", "wellness", "fitness", "nutrition", "mental health", "lifestyle", "Women's Spot"],
        slug: slug,
        hreflang: languageMap[locale] || locale,
        urlPattern: `/${locale}/[category]/[slug]`,
        canonicalUrl: fallbackCanonicalUrl,
      },
    };
    
    try {
      const fallbackMetadata = await generateArticleMetadata(fallbackMetaContent);
      return fallbackMetadata;
    } catch (fallbackError) {
      console.error("Error generating fallback metadata:", fallbackError);
      return generateSimpleFallbackMetadata(slug, locale, 'health');
    }
  }
}

// Generate viewport metadata separately (Next.js 15+ requirement)
export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  };
}

// Generate structured data for social media crawlers
function generateStructuredData(articleData: ISerializedArticle, locale: string, slug: string) {
  const languageData = articleData.languages[0];
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';
  const canonicalUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;
  
  const title = languageData?.seo?.metaTitle || `${articleData.category.charAt(0).toUpperCase() + articleData.category.slice(1)} Article - Women's Spot`;
  const description = languageData?.seo?.metaDescription || `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`;
  const author = typeof articleData.createdBy === "object" && articleData.createdBy && "username" in articleData.createdBy
    ? (articleData.createdBy as { username: string }).username
    : "Women's Spot Team";
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": articleData.articleImages?.[0] || 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Women's Spot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png"
      }
    },
    "datePublished": articleData.createdAt ? new Date(articleData.createdAt).toISOString() : new Date().toISOString(),
    "dateModified": articleData.updatedAt ? new Date(articleData.updatedAt).toISOString() : new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": articleData.category || 'Health',
    "keywords": languageData?.seo?.keywords?.join(',') || 'health, women, wellness',
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Women's Spot",
      "url": baseUrl
    }
  };
}

// This should return JSX, not Metadata
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
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
    <>
      {/* Structured data for social media crawlers */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(articleData, locale, slug))
        }}
      />
      
      <main className="container mx-auto">
        <ErrorBoundary context={"Article component"}>
          <Article articleData={articleData} />
        </ErrorBoundary>
      </main>
    </>
  );
}
