import { Suspense } from "react";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
  generateSimpleFallbackMetadata,
} from "@/lib/utils/articleMetadata";
import { languageMap } from "@/lib/utils/genericMetadata";
import { IMetaDataArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticleBySlug } from "@/app/actions/article/getArticleBySlug";
import ArticleWithDeleteModal from "@/components/article/ArticleWithDeleteModal";
import { ArticleDetailSkeleton } from "@/components/skeletons/ArticleDetailSkeleton";
import { Metadata, Viewport } from "next";
import { mainCategories } from "@/lib/constants";
import { notFound } from "next/navigation";
import ProductsBanner from "@/components/ProductsBanner";
import CommentsSection from "@/components/CommentsSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import { getTranslations } from "next-intl/server";
import SocialShare from "@/components/SocialShare";
import SectionHeader from "@/components/server/SectionHeader";
import { CategoryCarouselSkeleton } from "@/components/skeletons/CategoryCarouselSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string; category: string }>;
}): Promise<Metadata> {
  const { slug, locale, category } = await params;

  // Validate category exists
  if (!mainCategories.includes(category)) {
    return generateArticleNotFoundMetadata();
  }

  try {
    const articleData = await getArticleBySlug(slug, locale);

    if (!articleData) {
      return generateArticleNotFoundMetadata();
    }

    // Validate article category matches URL category
    if (articleData.category !== category) {
      return generateArticleNotFoundMetadata();
    }

    const languageData = articleData.languages[0]; // Already filtered by API
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://womensspot.com";
    const canonicalUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;

    const metaContent: IMetaDataArticle = {
      slug: slug,
      createdBy:
        typeof articleData.createdBy === "object" &&
        articleData.createdBy &&
        "username" in articleData.createdBy
          ? (articleData.createdBy as { username: string }).username
          : "Women's Spot Team",
      postImage: languageData?.postImage, // Add the language-specific postImage
      category: articleData.category,
      createdAt: articleData.createdAt
        ? new Date(articleData.createdAt)
        : new Date(),
      updatedAt: articleData.updatedAt
        ? new Date(articleData.updatedAt)
        : new Date(),
      socialMedia: languageData?.socialMedia,
      seo: languageData?.seo
        ? {
            ...languageData.seo,
            canonicalUrl: languageData.seo.canonicalUrl || canonicalUrl,
            hreflang:
              languageData.seo.hreflang || languageMap[locale] || locale,
            slug: languageData.seo.slug || slug,
          }
        : {
            metaTitle: `${
              articleData.category.charAt(0).toUpperCase() +
              articleData.category.slice(1)
            } Article - Women's Spot`,
            metaDescription: `Discover valuable insights about ${articleData.category} on Women's Spot. Expert health and wellness advice for women.`,
            keywords: [
              articleData.category,
              "health",
              "women",
              "wellness",
              "fitness",
              "nutrition",
            ],
            slug: slug,
            hreflang: languageMap[locale] || locale,
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
      stack: error instanceof Error ? error.stack : undefined,
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://womensspot.com";
    const fallbackCanonicalUrl = `${baseUrl}/${locale}/${slug}`;

    const fallbackMetaContent: IMetaDataArticle = {
      slug: slug,
      createdBy: "Women's Spot Team",
      postImage: undefined, // No postImage for fallback
      category: "health",
      createdAt: new Date(),
      updatedAt: new Date(),
      socialMedia: undefined,
      seo: {
        metaTitle: `Health Article - Women's Spot`,
        metaDescription: `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`,
        keywords: [
          "health",
          "women",
          "wellness",
          "fitness",
          "nutrition",
          "mental health",
          "lifestyle",
          "Women's Spot",
        ],
        slug: slug,
        hreflang: languageMap[locale] || locale,
        canonicalUrl: fallbackCanonicalUrl,
      },
    };

    try {
      const fallbackMetadata = await generateArticleMetadata(
        fallbackMetaContent
      );
      return fallbackMetadata;
    } catch (fallbackError) {
      console.error("Error generating fallback metadata:", fallbackError);
      return generateSimpleFallbackMetadata(slug, locale, "health");
    }
  }
}

// Generate viewport metadata separately (Next.js 15+ requirement)
export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  };
}

export const revalidate = 3600; // 1 hour

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string; category: string }>;
}) {
  const { slug, locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "article" });

  // Validate category exists
  if (!mainCategories.includes(category)) {
    notFound();
  }

  // Fetch article data
  let articleData;
  try {
    const result = await getArticleBySlug(slug, locale);
    articleData = result ?? undefined;
  } catch (error) {
    console.error("Error fetching article:", error);
    articleData = undefined;
  }

  // If article doesn't exist, trigger not-found page
  if (!articleData) {
    notFound();
  }

  // Validate article category matches URL category
  if (articleData.category !== category) {
    notFound();
  }

  // Construct share URL
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://womensspot.com";
  const shareUrl = `${baseUrl}/${locale}/${articleData.category}/${slug}`;

  // Get share data
  const languageData = articleData.languages[0];
  const shareTitle = languageData?.content?.mainTitle || "";
  const shareDescription =
    languageData?.content?.articleContents?.[0]?.articleParagraphs?.[0] || "";
  const shareMedia = articleData.articleImages?.[0] || "";

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Article component"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner
            size="970x90"
            affiliateCompany="amazon"
            category={articleData?.category || ""}
          />

          {/* Article Detail Section */}
          <Suspense fallback={<ArticleDetailSkeleton />}>
            <ArticleWithDeleteModal articleData={articleData} />
          </Suspense>

          {/* Social Share Section */}
          <div className="text-center">
            <SocialShare
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              media={shareMedia}
            />
          </div>

          {/* Comments Section */}
          <CommentsSection articleId={articleData._id.toString()} />

          {/* Explore by Category Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("exploreMore")}
              description={t("exploreMoreDescription")}
            />

            {/* Category Carousel Section */}
            <Suspense fallback={<CategoryCarouselSkeleton />}>
              <CategoryCarousel category={articleData.category} />
            </Suspense>
          </section>

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
