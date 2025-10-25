import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Heart, Zap, HeartHandshake, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "/about", "metadata.about.title");
}

// Server Component - handles metadata generation and renders static content
export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = await getLocale();

  return (
    <main className="container mx-auto pb-6 md:pb-12">
      <ErrorBoundary context={"About component"}>
        <div className="h-full md:mt-20 mt-10 text-justify">
          {/* Hero Section */}
          <div className="bg-gradient-left-right text-white py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
                <p className="text-xl max-w-3xl mx-auto leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Mission Statement */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("mission.title")}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t("mission.description1")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("mission.description2")}
              </p>
            </div>

            {/* What We Do */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("whatWeDo.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("whatWeDo.cutThroughNoise.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("whatWeDo.cutThroughNoise.description")}
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("whatWeDo.personalizedApproach.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("whatWeDo.personalizedApproach.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Our Team */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("team.title")}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t("team.description1")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t("team.description2")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("team.description3")}
              </p>
            </div>

            {/* Content Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("whatWeCover.title")}
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    key: "healthWellness",
                    icon: Heart,
                  },
                  {
                    key: "fitnessBeauty",
                    icon: Zap,
                  },
                  {
                    key: "intimacy",
                    icon: HeartHandshake,
                  },
                  {
                    key: "weight-loss",
                    icon: Activity,
                  },
                  {
                    key: "life",
                    icon: Sparkles,
                  },
                ].map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.key}
                      className="text-center p-6 bg-purple-50 rounded-lg shadow-md"
                    >
                      <div className="w-16 h-16 bg-gradient-left-right rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t(`whatWeCover.${category.key}.title`)}
                      </h3>
                      <p className="text-gray-700">
                        {t(`whatWeCover.${category.key}.description`)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editorial Standards */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("editorialStandards.title")}
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("editorialStandards.accuracy.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("editorialStandards.accuracy.description")}
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("editorialStandards.editorialIndependence.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("editorialStandards.editorialIndependence.description")}
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("editorialStandards.privacy.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("editorialStandards.privacy.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-left-right py-24 px-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("callToAction.title")}
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              {t("callToAction.description")}
            </p>
            <Button variant="customSecondary" className="w-1/2 mx-auto">
              <Link href={`/${locale}`}>{t("callToAction.button")}</Link>
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
