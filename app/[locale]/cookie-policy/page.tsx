import { Metadata } from "next";
import { Suspense } from "react";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import CookiePolicyContentSection from "@/components/server/CookiePolicyContentSection";
import { CookiePolicySkeleton } from "@/components/skeletons/CookiePolicySkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(
    locale,
    "/cookie-policy",
    "metadata.cookiePolicy.title"
  );
}

export const revalidate = 3600; // 1 hour

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Cookie Policy page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        {/* Main Content */}
        <Suspense fallback={<CookiePolicySkeleton />}>
          <CookiePolicyContentSection locale={locale} />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
