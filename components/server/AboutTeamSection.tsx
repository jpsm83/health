import { getTranslations } from "next-intl/server";

interface AboutTeamSectionProps {
  locale: string;
}

export default async function AboutTeamSection({
  locale,
}: AboutTeamSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-16">
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
    </div>
  );
}

