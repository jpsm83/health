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
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";
import { NewsletterSkeleton } from "@/components/skeletons/NewsletterSkeleton";
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
    <main className="container mx-auto">
      <ErrorBoundary context={"Home component"}>
        <div className="mb-8 md:mb-16">
          <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
            <Suspense fallback={<HeroSkeleton />}>
              <HeroSection locale={locale} />
            </Suspense>

            <Suspense fallback={<FeaturedArticlesSkeleton />}>
              <FeaturedArticlesSection locale={locale} />
            </Suspense>

            <Suspense fallback={<NewsletterSkeleton />}>
              <NewsletterSection />
            </Suspense>

            {/* Below-fold banner - lazy loaded */}
            <ProductsBanner size="970x90" affiliateCompany="amazon" />

            <section className="cv-auto">
              <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
                <h2
                  className="text-3xl font-bold text-white mb-4"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {t("exploreByCategory.title")}
                </h2>
                <p className="text-lg text-white max-w-2xl mx-auto">
                  {t("exploreByCategory.description")}
                </p>
              </div>

              {mainCategories.map((category) => (
                <Suspense
                  key={category}
                  fallback={<CategoryCarouselSkeleton />}
                >
                  <CategoryCarouselSection category={category} locale={locale} />
                </Suspense>
              ))}
            </section>
          </div>

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
