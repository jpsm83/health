import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorBoundary from "@/components/ErrorBoundary";

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
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-20">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("mission.title")}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t("mission.description1")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("mission.description2")}
              </p>
            </div>

            {/* What We Do */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("whatWeDo.title")}</h2>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("team.title")}</h2>
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
                <div className="text-center p-6 bg-orange-50 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("whatWeCover.healthWellness.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("whatWeCover.healthWellness.description")}
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("whatWeCover.fitnessBeauty.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("whatWeCover.fitnessBeauty.description")}
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("whatWeCover.intimacy.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("whatWeCover.intimacy.description")}
                  </p>
                </div>
        <div className="text-center p-6 bg-orange-50 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("whatWeCover.weight-loss.title")}
          </h3>
          <p className="text-gray-700">
            {t("whatWeCover.weight-loss.description")}
          </p>
        </div>

        <div className="text-center p-6 bg-orange-50 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("whatWeCover.life.title")}
          </h3>
          <p className="text-gray-700">
            {t("whatWeCover.life.description")}
          </p>
        </div>
              </div>
            </div>

            {/* Editorial Standards */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("editorialStandards.title")}
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-orange-600 p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("editorialStandards.accuracy.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("editorialStandards.accuracy.description")}
                  </p>
                </div>
                <div className="border-l-4 border-orange-600 p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("editorialStandards.editorialIndependence.title")}
                  </h3>
                  <p className="text-gray-700">
                    {t("editorialStandards.editorialIndependence.description")}
                  </p>
                </div>
                <div className="border-l-4 border-orange-600 p-6 shadow-md">
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
          <div className="text-center bg-gradient-to-r from-orange-600 to-yellow-500 py-24 px-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("callToAction.title")}
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              {t("callToAction.description")}
            </p>
            <Link
              href={`/${locale}`}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              {t("callToAction.button")}
            </Link>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
