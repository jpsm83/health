import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ConfirmNewsletterSection from "@/components/server/ConfirmNewsletterSection";
import { ConfirmNewsletterSkeleton } from "@/components/skeletons/ConfirmNewsletterSkeleton";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/confirm-newsletter",
    "metadata.confirm-newsletter.title"
  );
}

export const revalidate = 3600; // 1 hour

export default async function ConfirmNewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { locale } = await params;
  const { token, email } = await searchParams;

  return (
    <main className="container mx-auto mt-4 mb-8 md:mt-8 md:mb-16">
      {/* Products Banner */}
      <ProductsBanner size="970x90" affiliateCompany="amazon" />

      <ErrorBoundary context={"ConfirmNewsletter component"}>
        <Suspense fallback={<ConfirmNewsletterSkeleton />}>
          <ConfirmNewsletterSection locale={locale} token={token} email={email} />
        </Suspense>
      </ErrorBoundary>

      {/* Products Banner */}
      <ProductsBanner size="970x240" affiliateCompany="amazon" />
    </main>
  );
}
