import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import { mainCategories } from "@/lib/constants";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import NewsletterSection from "@/components/server/NewsletterSection";
import CategoryCarouselSection from "@/components/server/CategoryCarouselSection";
import SectionHeader from "@/components/server/SectionHeader";
import { getArticles } from "@/app/actions/article/getArticles";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";
import { CategoryCarouselSkeleton } from "@/components/skeletons/CategoryCarouselSkeleton";
import { getUserRegion } from "@/app/actions/geolocation/getUserRegion";

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

// Featured Articles Content Component
async function FeaturedArticlesContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });

  const featuredArticlesResponse = await getArticles({
    locale,
    limit: 10,
    skipCount: true,
    fields: "featured",
  });

  const articles = featuredArticlesResponse.data;

  if (!articles.length) {
    return (
      <div className="cv-auto px-3 py-8 text-center bg-white border rounded shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("featuredArticles.title")}
        </h2>
        <p className="text-gray-500">{t("description")}</p>
      </div>
    );
  }

  return <FeaturedArticles articles={articles} />;
}

// Server Component - handles metadata generation
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const region = await getUserRegion(); // Detect region once on server

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Home component"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" region={region} />

          {/* Hero Section */}
          <HeroSection locale={locale} />

          {/* Featured Articles Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("featuredArticles.title")}
              description={t("featuredArticles.description")}
            />
            <Suspense fallback={<FeaturedArticlesSkeleton />}>
              <FeaturedArticlesContent locale={locale} />
            </Suspense>
          </section>

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" region={region} />

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
          <ProductsBanner size="970x240" affiliateCompany="amazon" region={region} />
        </div>
      </ErrorBoundary>
    </main>
  );
}
