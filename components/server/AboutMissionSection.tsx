import { getTranslations } from "next-intl/server";

interface AboutMissionSectionProps {
  locale: string;
}

export default async function AboutMissionSection({
  locale,
}: AboutMissionSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
    </div>
  );
}

