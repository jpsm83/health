import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { mainCategories } from "@/lib/constants";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import CategoryHeroSection from "@/components/server/CategoryHeroSection";
import CategoryFeaturedArticlesSection from "@/components/server/CategoryFeaturedArticlesSection";
import NewsletterSection from "@/components/server/NewsletterSection";
import CategoryPaginatedArticlesSection from "@/components/server/CategoryPaginatedArticlesSection";
import CategoryPaginationSection from "@/components/server/CategoryPaginationSection";
import { CategoryHeroSkeleton } from "@/components/skeletons/CategoryHeroSkeleton";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";
import { NewsletterSkeleton } from "@/components/skeletons/NewsletterSkeleton";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;

  if (!mainCategories.includes(category)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return generatePublicMetadata(
    locale,
    `/${category}`,
    `metadata.${category}.title`
  );
}

export const revalidate = 3600; // 1 hour

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, locale } = await params;
  const { page = "1" } = await searchParams;

  // Check if category is valid - if not, trigger not-found page
  if (!mainCategories.includes(category)) {
    notFound();
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={`Articles component for category ${category}`}>
        <div className="mb-8 md:mb-16">
          <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
            {/* Products Banner */}
            <ProductsBanner
              size="970x90"
              affiliateCompany="amazon"
              category={category}
            />

            {/* Hero Section */}
            <Suspense fallback={<CategoryHeroSkeleton />}>
              <CategoryHeroSection category={category} locale={locale} />
            </Suspense>

            {/* Featured Articles Section */}
            <Suspense fallback={<FeaturedArticlesSkeleton />}>
              <CategoryFeaturedArticlesSection
                category={category}
                locale={locale}
              />
            </Suspense>

            {/* Newsletter Section */}
            <Suspense fallback={<NewsletterSkeleton />}>
              <NewsletterSection />
            </Suspense>

            {/* Products Banner */}
            <ProductsBanner
              size="970x90"
              affiliateCompany="amazon"
              category={category}
            />

            {/* Paginated Articles Section */}
            <Suspense fallback={<FeaturedArticlesSkeleton />}>
              <CategoryPaginatedArticlesSection
                category={category}
                locale={locale}
                page={page as string}
              />
            </Suspense>

            {/* Pagination Controls */}
            <Suspense fallback={null}>
              <CategoryPaginationSection
                category={category}
                locale={locale}
                page={page as string}
              />
            </Suspense>
          </div>

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
