import { Metadata } from "next";
import { Suspense } from "react";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import SiteMapContentSection from "@/components/server/SiteMapContentSection";
import { SiteMapSkeleton } from "@/components/skeletons/SiteMapSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(
    locale,
    "/site-map",
    "metadata.siteMap.title"
  );
}

export const revalidate = 3600; // Static page, cache for 1 hour

export default async function SiteMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Site Map page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        {/* Main Content */}
        <Suspense fallback={<SiteMapSkeleton />}>
          <SiteMapContentSection locale={locale} />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
