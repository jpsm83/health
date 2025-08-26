import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

export default function About() {
  const locale = useLocale();
  const t = useTranslations("about");

  return (
    <div className="min-h-screen bg-white md:mt-20 mt-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
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
            <div className="text-center p-6 bg-blue-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <div className="text-center p-6 bg-green-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <div className="text-center p-6 bg-purple-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("whatWeCover.lifestyleTravel.title")}
              </h3>
              <p className="text-gray-700">
                {t("whatWeCover.lifestyleTravel.description")}
              </p>
            </div>
            <div className="text-center p-6 bg-pink-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                {t("whatWeCover.relationshipsSex.title")}
              </h3>
              <p className="text-gray-700">
                {t("whatWeCover.relationshipsSex.description")}
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
            <div className="border-l-4 border-blue-600 p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("editorialStandards.accuracy.title")}
              </h3>
              <p className="text-gray-700">
                {t("editorialStandards.accuracy.description")}
              </p>
            </div>
            <div className="border-l-4 border-green-600 p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("editorialStandards.editorialIndependence.title")}
              </h3>
              <p className="text-gray-700">
                {t("editorialStandards.editorialIndependence.description")}
              </p>
            </div>
            <div className="border-l-4 border-purple-600 p-6 shadow-md">
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
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 py-24 px-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("callToAction.title")}
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {t("callToAction.description")}
          </p>
          <Link
            href={`/${locale}`}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            {t("callToAction.button")}
          </Link>
        </div>
    </div>
  );
}
