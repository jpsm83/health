import { Metadata } from "next";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/server/SectionHeader";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

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
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Cookie Policy component"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Hero Section */}
          <SectionHeader
            title={t("hero.title")}
            description={t("hero.subtitle")}
          />

          {/* Introduction Section */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-4 md:space-y-8">
            <p className="text-lg text-gray-700">
              {t("introduction.paragraph1")}
            </p>
            <p className="text-lg text-gray-700">
              {t("introduction.paragraph2")}
            </p>
          </div>

          {/* Content Sections */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 md:space-y-16">
            <section>
              <h2 className="text-2xl font-semibold mb-4 md:mb-8">
                {t("sections.whatAreCookies.title")}
              </h2>
              <p className="mb-4">
                {t("sections.whatAreCookies.paragraphs.0")}
              </p>
              <p className="mb-4">
                {t("sections.whatAreCookies.paragraphs.1")}
              </p>
              <p className="mb-4">
                {t("sections.whatAreCookies.paragraphs.2")}
              </p>
              <p>{t("sections.whatAreCookies.paragraphs.3")}</p>
            </section>

            {/* Products Banner */}
            <ProductsBanner size="970x240" affiliateCompany="amazon" />

            <section>
              <h2 className="text-2xl font-semibold mb-4 md:mb-8">
                {t("sections.whichCookies.title")}
              </h2>
              <p className="mb-4">{t("sections.whichCookies.description")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 md:mb-8">
                {t("sections.yourChoices.title")}
              </h2>
              <p className="mb-4">{t("sections.yourChoices.paragraphs.0")}</p>
              <p className="mb-4">{t("sections.yourChoices.paragraphs.1")}</p>

              <div className="space-y-4 md:space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 md:mb-6">
                    {t("sections.yourChoices.subsections.websiteOptOut.title")}
                  </h3>
                  <p className="mb-4">
                    {t(
                      "sections.yourChoices.subsections.websiteOptOut.paragraphs.0"
                    )}
                  </p>
                  <p className="mb-4">
                    {t(
                      "sections.yourChoices.subsections.websiteOptOut.paragraphs.1"
                    )}
                  </p>
                  <p>
                    {t(
                      "sections.yourChoices.subsections.websiteOptOut.paragraphs.2"
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 md:mb-6">
                    {t(
                      "sections.yourChoices.subsections.mobileAppOptOut.title"
                    )}
                  </h3>
                  <p className="mb-4">
                    {t(
                      "sections.yourChoices.subsections.mobileAppOptOut.paragraphs.0"
                    )}
                  </p>
                  <p>
                    {t(
                      "sections.yourChoices.subsections.mobileAppOptOut.paragraphs.1"
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 md:mb-6">
                    {t(
                      "sections.yourChoices.subsections.moreInformation.title"
                    )}
                  </h3>
                  <p>
                    {t(
                      "sections.yourChoices.subsections.moreInformation.description"
                    )}
                    <a
                      href="https://www.allaboutcookies.org"
                      className="main-link"
                    >
                      {t(
                        "sections.yourChoices.subsections.moreInformation.links.allaboutcookies"
                      )}
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.youronlinechoices.eu"
                      className="main-link"
                    >
                      {t(
                        "sections.yourChoices.subsections.moreInformation.links.youronlinechoices"
                      )}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom banner */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
