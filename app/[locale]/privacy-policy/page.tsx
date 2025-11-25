import { Metadata } from "next";
import { Suspense } from "react";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import PrivacyPolicyContentSection from "@/components/server/PrivacyPolicyContentSection";
import { PrivacyPolicySkeleton } from "@/components/skeletons/PrivacyPolicySkeleton";

export async function generateMetadata({ 
  params,
}: { 
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePublicMetadata(
    locale,
    "/privacy-policy",
    "metadata.privacyPolicy.title"
  );
}

export const revalidate = 3600; // Static page, cache for 1 hour

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Privacy Policy page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        {/* Main Content */}
        <Suspense fallback={<PrivacyPolicySkeleton />}>
          <PrivacyPolicyContentSection locale={locale} />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
