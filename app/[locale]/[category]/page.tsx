import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { mainCategories } from "@/lib/constants";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import NewsletterSection from "@/components/server/NewsletterSection";
import CategoryArticlesWithPagination from "@/components/server/CategoryArticlesWithPagination";
import { ArticlesWithPaginationSkeleton } from "@/components/skeletons/ArticlesWithPaginationSkeleton";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";

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
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={`Articles component for category ${category}`}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
            {/* Products Banner */}
            <ProductsBanner
              size="970x90"
              affiliateCompany="amazon"
              category={category}
            />

          {/* Hero Section */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection category={category} locale={locale} />
          </Suspense>

          {/* Paginated Articles Section with Pagination */}
          <Suspense fallback={<ArticlesWithPaginationSkeleton />}>
            <CategoryArticlesWithPagination
              category={category}
              locale={locale}
              page={page as string}
            />
          </Suspense>

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
