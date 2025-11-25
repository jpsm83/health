import { getTranslations } from "next-intl/server";

interface AboutEditorialStandardsSectionProps {
  locale: string;
}

export default async function AboutEditorialStandardsSection({
  locale,
}: AboutEditorialStandardsSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-16">
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
  );
}

