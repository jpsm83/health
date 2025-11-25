import { getTranslations } from "next-intl/server";
import { Heart, Zap, HeartHandshake, Activity, Sparkles } from "lucide-react";
import AboutCategoriesUI from "@/components/AboutCategoriesUI";

interface AboutCategoriesSectionProps {
  locale: string;
}

export default async function AboutCategoriesSection({
  locale,
}: AboutCategoriesSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  const categories = [
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
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {t("whatWeCover.title")}
        </h2>
        <AboutCategoriesUI categories={categories} locale={locale} />
      </div>
    </div>
  );
}

