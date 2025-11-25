import { getTranslations } from "next-intl/server";

interface AboutWhatWeDoSectionProps {
  locale: string;
}

export default async function AboutWhatWeDoSection({
  locale,
}: AboutWhatWeDoSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

