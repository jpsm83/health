import { Metadata } from "next";
import { getTranslations, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Navigation from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import ProductsBanner from "@/components/ProductsBanner";

// Helper function to detect locale
async function detectLocale(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  let locale = routing.defaultLocale;
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang: string) => lang.split(";")[0].trim().substring(0, 2))
      .filter((lang: string) =>
        routing.locales.includes(lang as (typeof routing.locales)[number])
      );

    if (languages.length > 0) {
      locale = languages[0] as typeof routing.defaultLocale;
    }
  }

  return locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  return generatePublicMetadata(locale, "/404", "metadata.notFound.title");
}

export default async function NotFound() {
  const locale = await detectLocale();
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <NextIntlClientProvider messages={messages}>
      <main className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
        <Navigation />
        <div className="flex-1 flex flex-col pt-[120px] w-full max-w-full overflow-x-hidden container my-7 md:my-14">
          <ErrorBoundary context={"Not Found page"}>
            <div className="flex-1 flex flex-col h-full gap-8 md:gap-16">
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
        </div>
        <Footer />
      </main>
    </NextIntlClientProvider>
  );
}
