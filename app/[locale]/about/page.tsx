import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import AboutHeroSection from "@/components/server/AboutHeroSection";
import AboutMissionSection from "@/components/server/AboutMissionSection";
import AboutWhatWeDoSection from "@/components/server/AboutWhatWeDoSection";
import AboutTeamSection from "@/components/server/AboutTeamSection";
import AboutCategoriesSection from "@/components/server/AboutCategoriesSection";
import AboutEditorialStandardsSection from "@/components/server/AboutEditorialStandardsSection";
import AboutCallToActionSection from "@/components/server/AboutCallToActionSection";
import { AboutHeroSkeleton } from "@/components/skeletons/AboutHeroSkeleton";
import { AboutContentSkeleton } from "@/components/skeletons/AboutContentSkeleton";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "/about", "metadata.about.title");
}

export const revalidate = 3600; // 1 hour

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"About component"}>
        <div className="mb-8 md:mb-16">
          <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
            {/* Products Banner */}
            <ProductsBanner size="970x90" affiliateCompany="amazon" />

            {/* Hero Section */}
            <Suspense fallback={<AboutHeroSkeleton />}>
              <AboutHeroSection locale={locale} />
            </Suspense>

            {/* Mission Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutMissionSection locale={locale} />
            </Suspense>

            {/* What We Do Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutWhatWeDoSection locale={locale} />
            </Suspense>

            {/* Products Banner */}
            <ProductsBanner size="970x90" affiliateCompany="amazon" />

            {/* Team Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutTeamSection locale={locale} />
            </Suspense>

            {/* Categories Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutCategoriesSection locale={locale} />
            </Suspense>

            {/* Products Banner */}
            <ProductsBanner size="970x90" affiliateCompany="amazon" />

            {/* Editorial Standards Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutEditorialStandardsSection locale={locale} />
            </Suspense>

            {/* Call to Action Section */}
            <Suspense fallback={<AboutContentSkeleton />}>
              <AboutCallToActionSection locale={locale} />
            </Suspense>
          </div>

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
