import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import ProductsBanner from "@/components/ProductsBanner";

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = params ? (await params).locale : await getLocale();
  return generatePublicMetadata(locale, "/404", "metadata.notFound.title");
}

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const locale = params ? (await params).locale : await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Not Found page"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Hero Section */}
          <HeroSection
            locale={locale}
            title={t("title")}
            description={t("description")}
            alt={t("heroImageAlt")}
            imageKey="search-no-results"
          />

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
