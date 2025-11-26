import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import { mainCategories } from "@/lib/constants";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import FeaturedArticlesSection from "@/components/server/FeaturedArticlesSection";
import NewsletterSection from "@/components/server/NewsletterSection";
import CategoryCarouselSection from "@/components/server/CategoryCarouselSection";
import SectionHeader from "@/components/server/SectionHeader";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";
import { CategoryCarouselSkeleton } from "@/components/skeletons/CategoryCarouselSkeleton";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "", "metadata.home.title");
}

export const revalidate = 3600;

// Server Component - handles metadata generation
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Home component"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Hero Section */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection locale={locale} />
          </Suspense>

          {/* Featured Articles Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("featuredArticles.title")}
              description={t("featuredArticles.description")}
            />
            <Suspense fallback={<FeaturedArticlesSkeleton />}>
              <FeaturedArticlesSection locale={locale} />
            </Suspense>
          </section>

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Explore by Category Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("exploreByCategory.title")}
              description={t("exploreByCategory.description")}
            />

            <div className="flex flex-col gap-3 md:gap-6">
              {mainCategories.map((category, index) => (
                <Suspense
                  key={category}
                  fallback={<CategoryCarouselSkeleton />}
                >
                  {index > 0 && (
                    <hr className="border-t border-gray-300 mt-4 md:mt-8" />
                  )}
                  <CategoryCarouselSection
                    category={category}
                    locale={locale}
                  />
                </Suspense>
              ))}
            </div>
          </section>

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
