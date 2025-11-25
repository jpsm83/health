import { getTranslations } from "next-intl/server";

interface AboutHeroSectionProps {
  locale: string;
}

export default async function AboutHeroSection({
  locale,
}: AboutHeroSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
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
  );
}

